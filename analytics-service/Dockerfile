# Stage 1: Builder
FROM node:alpine3.22 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Stage 2: Runtime
FROM node:alpine3.22 AS runtime

WORKDIR /app

RUN adduser -S nexacore

COPY --from=builder /app/package*.json ./

RUN npm ci --only=production 

COPY --from=builder /app/src ./src

ENV NODE_ENV=production
ENV PORT=3006

USER nexacore

EXPOSE 3006

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3006/health || exit 1

CMD ["node", "src/index.js"]



