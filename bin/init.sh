npm install 
set -e 

cat bin/setup_env.sh | sh

# DB Setup 
cd ./apps/db
docker compose pull

npm run db:migration
npm run db:start
