FROM node:18-alpine

WORKDIR /app

# Solo dependencias primero (cache eficiente)
COPY package*.json ./
RUN npm install --omit=dev

# Luego el resto del código
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
