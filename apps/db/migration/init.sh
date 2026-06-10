set -e
docker compose up -d
files="migration/schema.sql migration/views.sql migration/storeprocedures.sql migration/triggers.sql migration/exploitsData.sql migration/data.sql migration/autorization.sql"

. ./.env

## Check if mysql is up
until MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysqladmin ping \
  -h "$MYSQL_HOST" \
  -P "$MYSQL_PORT" \
  -u root --silent; do
  echo "waiting for mysql..."
  sleep 2
done

# Creating database
MYSQL_PWD=$MYSQL_ROOT_PASSWORD mysql \
  -u root \
  -h $MYSQL_HOST \
  -P $MYSQL_PORT \
  -e " CREATE DATABASE IF NOT EXISTS \`$MYSQL_DATABASE\` DEFAULT CHARACTER SET utf8mb4;"

for file in $files; do
  if MYSQL_PWD=$MYSQL_ROOT_PASSWORD mysql -u root -h $MYSQL_HOST -P $MYSQL_PORT $MYSQL_DATABASE <$file; then
    echo "success migration file "$file
  else
    echo "error running" $file
    exit 1
  fi
done

echo "WARNING: Check if drizzle schemas are up to date"
