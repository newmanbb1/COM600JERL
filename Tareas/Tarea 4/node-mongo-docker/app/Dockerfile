# Usamos una imagen oficial de Node.js como base
FROM node:18

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos el package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalamos las dependencias de la aplicación
RUN npm install

# Copiamos el resto de los archivos de la aplicación al directorio de trabajo
COPY . .

# Exponemos el puerto en el que la aplicación se ejecuta
EXPOSE 3000

# El comando para iniciar la aplicación
CMD [ "npm", "start" ]