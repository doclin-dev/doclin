FROM node:20.17.0-alpine

WORKDIR /webapp
COPY . .

RUN npm install

EXPOSE 3002

CMD ["npm", "run", "dev"]