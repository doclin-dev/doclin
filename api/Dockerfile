FROM node:20.17.0-alpine

WORKDIR /api
COPY ./api /api
COPY ./shared /shared

RUN npm install -g pm2
RUN npm ci
RUN npm run build

EXPOSE 3000

CMD [ "pm2-runtime", "dist/api/src/index.js" ]