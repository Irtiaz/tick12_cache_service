# Auth service Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 8005

CMD ["npm", "start"]
