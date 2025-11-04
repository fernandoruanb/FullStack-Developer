FROM node:18
# Define our working directory
WORKDIR /app
# Copy the package*.json to the conteiner
COPY package*.json ./
# 
COPY server.js ./
# Install everything there
RUN npm install
# Copy everything to the container
COPY . .
EXPOSE 3002
CMD [ "nodemon", "server.js" ]
