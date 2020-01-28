#
FROM node:13
#
WORKDIR /usr/src/multi-repo1
#
COPY package*.json ./
RUN npm install
#
COPY . .
#
CMD ["npm", "start"]