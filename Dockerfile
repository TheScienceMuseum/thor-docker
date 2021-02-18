# Basic Thor Dockerfile.

FROM nginx:latest

COPY ./public-html/ /usr/share/nginx/html

