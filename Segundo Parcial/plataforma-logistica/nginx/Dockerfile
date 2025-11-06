# Usamos la imagen oficial de Nginx
FROM nginx:alpine

# Eliminamos la configuración por defecto
RUN rm /etc/nginx/conf.d/default.conf

# Copiamos nuestra configuración personalizada
COPY nginx.conf /etc/nginx/nginx.conf