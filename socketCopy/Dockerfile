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
COPY ./dr.handyman/. ./
#ARG CERTKEY
#ENV CERTKEY ${CERTKEY}

#ARG CERT
#ENV CERT ${CERT}

EXPOSE 4000
CMD [ "node", "index.js" ]
