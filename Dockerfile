# Set the base image to CentOS
FROM  index.alauda.cn/frankzhao/centbase:final

# File Author / Maintainer
MAINTAINER Frank

# Change work dir
COPY . /app

# Install node modules
WORKDIR /app
RUN npm install

# Install sails to global
RUN npm install sails -g
RUN npm install sails-mongo
RUN npm install pm2 -g

EXPOSE 80

# Start serivce
ENTRYPOINT pm2 start app.js --node-args "port=80"
