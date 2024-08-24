FROM node:20.17.0-alpine

WORKDIR /api
COPY . .

RUN npm install -g pm2
RUN npm install
RUN npm run build

EXPOSE 3000

CMD [ "pm2-runtime", "dist/index.js" ]