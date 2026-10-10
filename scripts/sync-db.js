const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const envPath = path.join(rootDir, '.env');
const envLocalPath = path.join(rootDir, '.env.local');
const schemaPath = path.join(rootDir, 'prisma', 'schema.prisma');

function parseEnv() {
  const env = {};
  [envPath, envLocalPath].forEach(filePath => {
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const match = trimmed.match(/^([\w.-]+)\s*=\s*(.*)?$/);
      if (match) {
        let val = (match[2] || '').trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        env[match[1]] = val;
      }
    });
  });
  return env;
}

function syncProvider() {
  const env = parseEnv();
  const dbUrl = env.DATABASE_URL || '';

  let detectedProvider = 'mysql'; // default
  if (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://')) {
    detectedProvider = 'postgresql';
  } else if (dbUrl.startsWith('mysql://')) {
    detectedProvider = 'mysql';
  } else if (dbUrl.startsWith('file:')) {
    detectedProvider = 'sqlite';
  }

  let schemaContent = fs.readFileSync(schemaPath, 'utf8');
  const currentProviderMatch = schemaContent.match(/datasource\s+db\s+\{\s+provider\s*=\s*"([^"]+)"/);
  const currentProvider = currentProviderMatch ? currentProviderMatch[1] : null;

  const hasDirectUrl = Boolean(env.DIRECT_URL && detectedProvider === 'postgresql');

  let updated = false;

  if (currentProvider !== detectedProvider) {
    console.log(`\n🔄 [Sync DB] Auto-detected ${detectedProvider.toUpperCase()} in .env (schema was ${currentProvider}).`);
    schemaContent = schemaContent.replace(
      /datasource\s+db\s+\{\s+provider\s*=\s*"[^"]+"/g,
      `datasource db {\n  provider = "${detectedProvider}"`
    );
    updated = true;
  }

  // Handle directUrl for Supabase connection pooling if configured
  if (hasDirectUrl && !schemaContent.includes('directUrl')) {
    schemaContent = schemaContent.replace(
      /url\s*=\s*env\("DATABASE_URL"\)/,
      'url      = env("DATABASE_URL")\n  directUrl = env("DIRECT_URL")'
    );
    updated = true;
  } else if (!hasDirectUrl && schemaContent.includes('directUrl')) {
    schemaContent = schemaContent.replace(/\s*directUrl\s*=\s*env\("DIRECT_URL"\)/, '');
    updated = true;
  }

  if (updated) {
    fs.writeFileSync(schemaPath, schemaContent, 'utf8');
    console.log(`✔ [Sync DB] prisma/schema.prisma synchronized with provider "${detectedProvider}".`);
  }

  // Safe Prisma client generate only if schema was actually updated
  if (updated) {
    try {
      execSync('npx prisma generate', { stdio: 'inherit', cwd: rootDir });
    } catch (err) {
      console.log('ℹ️ Note: Prisma client engine locked by running dev server. Restart dev server to reload client.');
    }
  }

  return detectedProvider;
}

if (require.main === module) {
  syncProvider();
}

module.exports = { syncProvider, parseEnv };
