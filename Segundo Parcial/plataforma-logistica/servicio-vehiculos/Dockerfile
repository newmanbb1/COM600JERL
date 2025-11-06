# Usamos una imagen oficial de Python
FROM python:3.10-slim

# Establecemos el directorio de trabajo
WORKDIR /usr/src/app

# Instalamos las dependencias
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el código de la aplicación, incluyendo los stubs gRPC generados
COPY ./app /usr/src/app/app

# Exponemos el puerto de la API REST (FastAPI)
EXPOSE 8000

# Exponemos el puerto de gRPC
EXPOSE 50051

# Comando para iniciar la aplicación
# Uvicorn correrá la API REST, y nuestra app (main.py)
# se encargará de iniciar el servidor gRPC en un hilo separado.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]