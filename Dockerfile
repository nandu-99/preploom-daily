FROM node:22-bookworm-slim AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend/package.json frontend/package.json
COPY backend/package.json backend/package.json
COPY backend/prisma7.config.ts backend/prisma7.config.ts
COPY backend/prisma/schema.prisma backend/prisma/schema.prisma

# Prisma generation runs during npm install and does not connect to this URL.
ENV DATABASE_URL=postgresql://preploom:preploom@localhost:5432/preploom
RUN npm ci --include=dev

FROM dependencies AS backend-build

COPY backend backend
RUN npm run prisma:generate --workspace backend \
    && npm run build --workspace backend

FROM node:22-bookworm-slim AS backend

WORKDIR /app
ENV NODE_ENV=production PORT=4000

COPY --chown=node:node --from=backend-build /app/package.json ./package.json
COPY --chown=node:node --from=backend-build /app/node_modules ./node_modules
COPY --chown=node:node --from=backend-build /app/backend ./backend

USER node
EXPOSE 4000
CMD ["npm", "run", "start", "--workspace", "backend"]

FROM dependencies AS frontend-build

COPY frontend frontend
ARG NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
RUN npm run build --workspace frontend

FROM node:22-bookworm-slim AS frontend

WORKDIR /app
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000

COPY --chown=node:node --from=frontend-build /app/package.json ./package.json
COPY --chown=node:node --from=frontend-build /app/node_modules ./node_modules
COPY --chown=node:node --from=frontend-build /app/frontend ./frontend

USER node
EXPOSE 3000
CMD ["npm", "run", "start", "--workspace", "frontend"]
