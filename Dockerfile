FROM node:16-alpine3.11

WORKDIR /usr/app

ARG SPARQL_ENDPOINT
ENV SPARQL_ENDPOINT $SPARQL_ENDPOINT

COPY . .

RUN npm install -g http-server
RUN node index.js

CMD http-server ./public_html -p 80