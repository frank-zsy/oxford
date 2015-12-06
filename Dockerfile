# Set the base image to CentOS
FROM tutum/centos:centos6
 
# File Author / Maintainer
MAINTAINER Frank / Frank

# Install node.js
sudo yum install node -y

# Install node modules
npm init

# Install sails-mongo and pm2 module
npm install sails-mongo pm2 -s

# Start serivce
pm2 start app.js --NODE_EVN=production
