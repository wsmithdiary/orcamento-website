FROM node:lts-alpine AS builder
WORKDIR /front-end
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable
COPY --from=builder /front-end/dist/ /usr/share/nginx/html
EXPOSE 80
