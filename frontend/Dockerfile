FROM node:21 AS builder
WORKDIR /app
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn --frozen-lockfile
COPY . .
ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
RUN yarn build

FROM nginx:latest
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/out/ /app/