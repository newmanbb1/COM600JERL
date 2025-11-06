# Usamos una imagen ligera de Node.js
FROM node:18-alpine

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos primero el package.json y package-lock.json
# Esto aprovecha el caché de capas de Docker
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código fuente de nuestra aplicación
COPY . .

# Exponemos el puerto en el que correrá nuestro servidor
EXPOSE 3001

# El comando para iniciar la aplicación
CMD [ "npm", "start" ]