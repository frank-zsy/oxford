# Set the base image to CentOS
FROM tutum/centos:centos6

# File Author / Maintainer
MAINTAINER Frank / Frank

# Change work dir
COPY . /app

# Install some tools for node
RUN yum -y install gcc make gcc-c++ openssl-devel wget

# Install node
RUN wget http://nodejs.org/dist/v0.10.26/node-v0.12.2.tar.gz
RUN tar -zxf node-v0.10.26.tar.gz /node/
WORKDIR /node
RUN make && make install
RUN node -v

# Install node modules
WORKDIR /app
RUN npm init

# Install sails-mongo module
RUN npm install sails-mongo -s

# Start serivce
RUN node app.js --NODE_EVN=production
