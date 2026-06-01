docker compose up -d 

. ./.env

until MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysqladmin ping \
  -h "$MYSQL_HOST" \
  -P "$MYSQL_PORT" \
  -u root --silent; do
  echo "waiting for mysql..."
  sleep 0.5
done