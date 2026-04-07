#!/usr/bin/env sh
set -eu

echo "Starting Car Express API container..."

# APP_KEY can be missing in fresh environments.
php artisan key:generate --force >/dev/null 2>&1 || true

# Wait for database and run migrations with retries.
attempt=1
max_attempts=10
until php artisan migrate --force; do
  if [ "$attempt" -ge "$max_attempts" ]; then
    echo "Database is not ready after ${max_attempts} attempts. Exiting."
    exit 1
  fi

  echo "Migration failed (attempt ${attempt}/${max_attempts}). Retrying in 3s..."
  attempt=$((attempt + 1))
  sleep 3
done

php artisan config:cache || true
php artisan view:cache || true
php artisan l5-swagger:generate || true

exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
