#!/bin/sh
set -e

echo "=== Wuxia Cultivation Tracker - Starting ==="

# Run database migrations if DATABASE_URL points to a file
if echo "$DATABASE_URL" | grep -q "file:"; then
  echo "Running database migrations..."
  npx prisma migrate deploy 2>/dev/null || echo "Migrations skipped (already up to date or first run)"
fi

echo "Starting application server..."
exec "$@"
