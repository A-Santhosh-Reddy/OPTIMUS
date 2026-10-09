const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetProvider = process.argv[2]?.toLowerCase();
const customUrl = process.argv[3];
const validProviders = ['mysql', 'postgresql', 'sqlite'];

if (!validProviders.includes(targetProvider)) {
  console.error(`\n❌ Invalid provider "${targetProvider}". Valid options:`);
  console.error(`   - mysql      (Local or hosted MySQL)`);
  console.error(`   - postgresql (Supabase or PostgreSQL)`);
  console.error(`   - sqlite     (Local zero-config dev.db)\n`);
  console.error(`Usage:`);
  console.error(`   node scripts/switch-db.js mysql [connection_url]`);
  console.error(`   node scripts/switch-db.js postgresql [supabase_connection_url]`);
  console.error(`   node scripts/switch-db.js sqlite\n`);
  process.exit(1);
}

const rootDir = path.join(__dirname, '..');
const schemaPath = path.join(rootDir, 'prisma', 'schema.prisma');
const envPath = path.join(rootDir, '.env');

console.log(`\n======================================================`);
console.log(`     SWITCHING DATABASE PROVIDER TO: ${targetProvider.toUpperCase()}`);
console.log(`======================================================\n`);

// 1. Update prisma/schema.prisma
let schemaContent = fs.readFileSync(schemaPath, 'utf8');
schemaContent = schemaContent.replace(
  /datasource\s+db\s+\{\s+provider\s*=\s*"[^"]+"/g,
  `datasource db {\n  provider = "${targetProvider}"`
);
fs.writeFileSync(schemaPath, schemaContent, 'utf8');
console.log(`✔ [1/3] Updated prisma/schema.prisma provider to "${targetProvider}".`);

// 2. Adjust .env
if (fs.existsSync(envPath)) {
  let envContent = fs.readFileSync(envPath, 'utf8');
  let currentDbUrlMatch = envContent.match(/DATABASE_URL="([^"]+)"/);
  const currentDbUrl = currentDbUrlMatch ? currentDbUrlMatch[1] : '';

  let newUrl = currentDbUrl;

  if (customUrl) {
    newUrl = customUrl.trim();
    // If MySQL and contains unencoded @ in password:
    if (targetProvider === 'mysql' && newUrl.includes('@')) {
      const parts = newUrl.match(/^mysql:\/\/([^:]+):(.*)@([^@\/]+)(\/.*)?$/);
      if (parts && parts[2].includes('@')) {
        const encodedPass = encodeURIComponent(parts[2]);
        newUrl = `mysql://${parts[1]}:${encodedPass}@${parts[3]}${parts[4] || ''}`;
      }
    }
  } else if (targetProvider === 'mysql' && !currentDbUrl.startsWith('mysql:')) {
    const savedMysql = envContent.match(/#\s*DATABASE_URL="(mysql:[^"]+)"/);
    newUrl = savedMysql ? savedMysql[1] : 'mysql://root:Bily%400318@localhost:3306/optimus_drp';
  } else if (targetProvider === 'postgresql' && !currentDbUrl.startsWith('postgres')) {
    const savedSupabase = envContent.match(/#\s*DATABASE_URL="(postgres[^"]+)"/);
    newUrl = savedSupabase
      ? savedSupabase[1]
      : 'postgresql://postgres.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true';
  } else if (targetProvider === 'sqlite' && !currentDbUrl.startsWith('file:')) {
    newUrl = 'file:./dev.db';
  }

  // Backup previous URL in comments if switching away
  if (currentDbUrl && !currentDbUrl.includes('YOUR_PROJECT_REF') && currentDbUrl !== newUrl) {
    if (!envContent.includes(currentDbUrl)) {
      envContent = `# PREVIOUS_DATABASE_URL="${currentDbUrl}"\n` + envContent;
    }
  }

  envContent = envContent.replace(/DATABASE_URL="[^"]*"/, `DATABASE_URL="${newUrl}"`);
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log(`✔ [2/3] Updated DATABASE_URL in .env to match ${targetProvider.toUpperCase()}.`);
  console.log(`       URL: ${newUrl.replace(/:([^:@]+)@/, ':****@')}`);
}

// 3. Run prisma generate safely (handling Windows locks)
try {
  console.log(`⏳ [3/3] Generating Prisma Client for ${targetProvider.toUpperCase()}...`);
  execSync('npx prisma generate', { stdio: 'inherit', cwd: rootDir });
  console.log(`\n✅ Succeeded! Prisma is now configured for ${targetProvider.toUpperCase()}.`);
} catch (err) {
  console.log(`\n⚠️ Note: Prisma client engine DLL locked by running dev server. Restart the dev server to reload.`);
}

console.log(`\nNext Steps:`);
if (targetProvider === 'postgresql') {
  console.log(`   1. Verify your Supabase connection string in .env (DATABASE_URL)`);
  console.log(`   2. Run "npm run db:push" to deploy tables to Supabase`);
  console.log(`   3. Run "npm run db:seed" to populate initial demo data and roles`);
  console.log(`   4. Run "npm run db:check" to verify connectivity\n`);
} else if (targetProvider === 'mysql') {
  console.log(`   1. Verify MySQL is running on port 3306`);
  console.log(`   2. Run "npm run db:push" or "npm run db:setup"`);
  console.log(`   3. Run "npm run db:check" to verify connectivity\n`);
}
