#!/bin/sh
set -e

echo "=== Wuxia Cultivation Tracker - Starting ==="
echo "DATABASE_URL: ${DATABASE_URL}"

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma
echo "Migrations applied successfully."

# Seed admin account if no users exist (first run)
echo "Checking for existing users..."
node -e "
const { PrismaClient } = require('./src/generated/prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const bcrypt = require('bcryptjs');

async function seed() {
  const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  try {
    const count = await prisma.user.count();
    if (count === 0) {
      console.log('No users found. Creating default admin account...');
      const hash = await bcrypt.hash('admin', 10);
      await prisma.user.create({
        data: { username: 'admin', password: hash, name: 'Administrator', role: 'admin', experience: 0 }
      });
      console.log('Default admin account created (admin/admin).');
      console.log('WARNING: Change the default password immediately after first login.');
    } else {
      console.log('Found ' + count + ' existing user(s). Skipping seed.');
    }
  } finally {
    await prisma.\$disconnect();
  }
}
seed().catch(e => { console.error('Seed error:', e); process.exit(1); });
"

echo "Starting application server..."
exec "$@"
