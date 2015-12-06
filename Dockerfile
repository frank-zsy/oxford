# Set the base image to CentOS
FROM  index.alauda.cn/frankzhao/centbase

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

# Start serivce
RUN sails lift
