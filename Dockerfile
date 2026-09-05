FROM maven:3.9-eclipse-temurin-21-alpine AS build

WORKDIR /app

# Copy everything and build
COPY . .
RUN mvn clean install -DskipTests -Pproduction

# Runtime image
FROM openjdk:21-jdk-slim
COPY --from=build /app/target/*.war /app/app.war
EXPOSE 8080
CMD ["java", "-jar", "/app/app.war"]
