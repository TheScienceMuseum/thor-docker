# Basic Thor Dockerfile.

FROM nginx:latest

LABEL maintainer="Science Musuem Group"

COPY public_html /usr/share/nginx/html
