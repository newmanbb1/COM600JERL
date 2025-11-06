FROM node:18-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Copia todo el código, incluyendo la nueva carpeta 'proto'
COPY . .

EXPOSE 3003
CMD [ "npm", "start" ]