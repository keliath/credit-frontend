# Etapa de build
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Exponer el puerto de Angular
EXPOSE 4200

# Comando por defecto: levantar el servidor de desarrollo
CMD ["npm", "start"] 