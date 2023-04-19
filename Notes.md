## dependencies
npm install @prisma/client fastify fastify-zod zod zod-to-json-schema @fastify/jwt @fastify/cors @fastify/swagger @fastify/swagger-ui
## devDependencies
npm install -D ts-node-dev typescript @types/node
## Add script dev to package.json
"dev": "tsnd --respawn --transpile-only --exit-child src/index.ts"

## Initialise prisma
npx prisma init --datasource-provider postgresql
## Migrate theschema
npx prisma migrate dev --name init
