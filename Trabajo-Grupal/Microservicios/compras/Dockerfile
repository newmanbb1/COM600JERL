# Dockerfile para el servicio de Compras (Java/Spring Boot)

# --- Etapa 1: Construcción (usando Maven con JDK 21) ---
FROM maven:3-eclipse-temurin-21 as builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# --- Etapa 2: Ejecución (usando JRE 21) ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]