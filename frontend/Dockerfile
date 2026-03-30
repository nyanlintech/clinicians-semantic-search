# ── Stage 1: build ────────────────────────────────────────────
FROM node:20-alpine3.21 AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile

COPY . .

ARG VITE_API_URL=http://localhost:8000/api/v1
ENV VITE_API_URL=$VITE_API_URL

RUN yarn build

# ── Stage 2: serve ────────────────────────────────────────────
FROM nginx:1.27-alpine3.21

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
