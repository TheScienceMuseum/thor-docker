# Basic Thor Dockerfile.

#FROM ubuntu
FROM nginx:latest

LABEL maintainer="Science Musuem Group"

# Install git
RUN apt-get update
RUN apt-get install -y git

# create nginx
RUN mkdir ./thor-repo
RUN cd ./thor-repo     
RUN git clone https://github.com/Abbe98/thor.git

# cp files to nginx html directory
COPY ./public-html/ /usr/share/nginx/html
