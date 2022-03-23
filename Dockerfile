# Dockerfile adapted from
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./dr.handyman/package.json ./

RUN npm install

# Bundle app source
FROM ubuntu
COPY ./dr.handyman/ .
RUN ls -la .*


EXPOSE 3000
CMD [ "node", "index.js" ]
