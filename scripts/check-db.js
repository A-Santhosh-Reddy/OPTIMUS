const path = require('path');
const fs = require('fs');

// 1. Automatically synchronize schema provider with .env URL
const { syncProvider } = require('./sync-db');
syncProvider();

// 2. Read environment
const envPath = path.join(__dirname, '..', '.env');
const envLocalPath = path.join(__dirname, '..', '.env.local');
[envPath, envLocalPath].forEach(filePath => {
  if (fs.existsSync(filePath)) {
    const envText = fs.readFileSync(filePath, 'utf8');
    envText.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const match = trimmed.match(/^([\w.-]+)\s*=\s*(.*)?$/);
      if (match) {
        let val = (match[2] || '').trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[match[1]] = val;
      }
    });
  }
});

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('\n======================================================');
  console.log('       OPTIMUS DRP DATABASE CONNECTION DIAGNOSTIC     ');
  console.log('======================================================\n');

  const rawUrl = process.env.DATABASE_URL || '';
  const maskedUrl = rawUrl.replace(/:([^:@]+)@/, ':****@');
  console.log(`Target URL: ${maskedUrl}`);

  if (rawUrl.includes('YOUR_PROJECT_REF') || rawUrl.includes('YOUR_PASSWORD')) {
    console.error('\n⚠️ Supabase Placeholder Detected in .env:');
    console.error('   You need to replace YOUR_PROJECT_REF and YOUR_PASSWORD with your actual Supabase credentials.');
    console.error('\nHow to get your Supabase connection string:');
    console.error('   1. Open your Supabase Dashboard: https://supabase.com/dashboard');
    console.error('   2. Go to Project Settings -> Database -> Connection string');
    console.error('   3. Select "URI" or "Transaction Pooler (6543)"');
    console.error('   4. Run: node scripts/switch-db.js postgresql "YOUR_ACTUAL_SUPABASE_URI"');
    console.error('   5. Then run: npm run db:push\n');
    process.exit(1);
  }

  try {
    await prisma.$connect();
    console.log('\n✔ Connection: SUCCESSFUL!');

    // Query record counts
    const [userCount, orgCount, assetCount, incidentCount] = await Promise.all([
      prisma.user.count().catch(() => 0),
      prisma.organization.count().catch(() => 0),
      prisma.brandAsset.count().catch(() => 0),
      prisma.incident.count().catch(() => 0),
    ]);

    console.log(`✔ Records: ${userCount} Users | ${orgCount} Organizations | ${assetCount} Protected Brands | ${incidentCount} Incidents`);
    console.log('\nStatus: Database is fully connected and ready for production/demo use!\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Connection Failed:');
    console.error(`   ${err.message.split('\n')[0]}`);
    console.log('\nTroubleshooting Guidance:');
    if (rawUrl.startsWith('mysql:')) {
      console.log('   - Ensure MySQL service is running on port 3306 (check services.msc)');
      console.log('   - If your password contains special characters like @, encode it (e.g. @ -> %40)');
      console.log('   - Run "npm run db:setup" to create database tables and seed accounts');
    } else if (rawUrl.startsWith('postgres')) {
      console.log('   - Check that your Supabase password and project reference are correct');
      console.log('   - For Supabase connection pooler, port is 6543 with ?pgbouncer=true');
      console.log('   - For direct Supabase connection, port is 5432');
      console.log('   - Run "npm run db:push" to deploy schema tables to Supabase');
      console.log('   - Run "npm run db:seed" to create the default admin & analyst accounts');
    }
    console.log('\n');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
