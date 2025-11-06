# Microservicio Compras

Estructura base creada automáticamente.

Arquitectura: Spring Boot, RabbitMQ (placeholder), H2 in-memory para desarrollo.

Archivos principales:
- `pom.xml` - dependencias Maven
- `Dockerfile` - imagen Java 17
- `src/main/java/com/practica/compras` - código fuente
- `src/main/resources/application.properties` - configuración

Instrucciones:
- `mvn package` para compilar
- `docker build -t compras:latest .` para crear imagen