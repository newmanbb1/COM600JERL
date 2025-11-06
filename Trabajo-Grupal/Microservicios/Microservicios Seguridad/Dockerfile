# Dockerfile para el servicio de Eventos (Python/Flask)

FROM python:3.9-slim
WORKDIR /app

# Asumo que el archivo de dependencias se llama 'requeriments.txt'
# Si tiene otro nombre, ajústalo aquí.
COPY requeriments.txt .
RUN pip install --no-cache-dir -r requeriments.txt

COPY . .

# Expone el puerto que usa el servicio
EXPOSE 5002

# Comando para iniciar el servicio (ajusta 'Eventos.py' si el archivo se llama diferente)
CMD ["python", "Eventos.py"]