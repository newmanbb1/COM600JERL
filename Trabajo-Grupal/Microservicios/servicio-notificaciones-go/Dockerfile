# ---- Etapa de Construcción ----
# Usamos una imagen de Go para compilar la aplicación
FROM golang:1.21-alpine as builder

WORKDIR /app

# Copiar los archivos del módulo de Go y descargar dependencias
COPY go.mod ./
COPY go.sum ./
RUN go mod download

# Copiar el resto del código fuente
COPY *.go ./

# Compilar la aplicación. CGO_ENABLED=0 es para compatibilidad.
RUN CGO_ENABLED=0 GOOS=linux go build -o /notificaciones-service

# ---- Etapa Final ----
# Usamos una imagen vacía (scratch) que es la más pequeña posible
FROM scratch

# Copiar el ejecutable compilado desde la etapa de construcción
COPY --from=builder /notificaciones-service /

# Comando que se ejecutará cuando el contenedor inicie
CMD ["/notificaciones-service"]