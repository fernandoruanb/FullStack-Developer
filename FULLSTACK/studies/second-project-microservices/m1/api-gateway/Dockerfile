FROM node:18
WORKDIR /app
COPY package*.json ./
COPY server.js ./
RUN npm install
COPY . .
EXPOSE 3001
CMD [ "nodemon", "server.js" ]
