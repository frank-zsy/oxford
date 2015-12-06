# Set the base image to CentOS
FROM tutum/centos:centos6
 
# File Author / Maintainer
MAINTAINER Frank / Frank

# Change work dir
COPY . /app
WORKDIR /app

# Install node.js
RUN yum install node -y

# Install node modules
RUN npm init

# Install sails-mongo module
RUN npm install sails-mongo -s

# Start serivce
RUN node app.js --NODE_EVN=production
