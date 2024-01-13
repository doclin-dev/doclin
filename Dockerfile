# Use an official Node.js runtime as a parent image
FROM node:lts-alpine
# Set the working directory in the container
WORKDIR /doclin-api
COPY api/ .
RUN npm install
EXPOSE 3000
# Define the command to run your Node.js application
CMD [ "node", "dist/index.js" ]