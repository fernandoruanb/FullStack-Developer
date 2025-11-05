FROM node:18
# Define our working directory
WORKDIR /app
# Copy the package*.json to the conteiner
COPY package*.json ./
# Copy everything to the container
COPY . .
# Install everything there
RUN npm install
EXPOSE 3002
CMD [ "node", "server.js" ]
