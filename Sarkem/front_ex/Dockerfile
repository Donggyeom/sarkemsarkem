FROM node:16

WORKDIR /

COPY package.json .

RUN npm install

RUN npm install face-api.js

COPY . .

EXPOSE 3000

CMD ["npm", "start"]