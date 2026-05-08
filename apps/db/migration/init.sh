npm run db:start 
files=("migration/schema.sql")
source ./.env
set -e
for file in ${files[@]}; do
    if MYSQL_PWD=$MYSQL_ROOT_PASSWORD  mysql -u root $MYSQL_DATABASE -h $MYSQL_HOST -P $MYSQL_PORT < $file; then
        echo "success migration file "$file 
    else 
        echo "error running" $file
    fi
done 
npm run db:pull
npm run db:stop