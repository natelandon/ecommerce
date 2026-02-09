FROM node:20-alpine AS base

WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/api/package.json apps/api/package.json

RUN npm install

COPY tsconfig.base.json tsconfig.base.json
COPY apps/api/tsconfig.json apps/api/tsconfig.json
COPY apps/api/tsconfig.build.json apps/api/tsconfig.build.json
COPY apps/api/src apps/api/src

RUN npm run build -w apps/api

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=base /app/node_modules /app/node_modules
COPY --from=base /app/apps/api/dist /app/apps/api/dist
COPY apps/api/package.json apps/api/package.json

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "apps/api/dist/index.js"]
