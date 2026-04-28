npm install 

cat bin/setup_env.sh | sh

# DB Setup 
cd ./apps/db
npm run db:migration
npm run db:start
npm run db:pull

