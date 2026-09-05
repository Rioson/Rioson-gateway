FROM maven:3.9-eclipse-temurin-21-alpine

WORKDIR /app

# Copy everything — no selective copy
COPY . .

# Build
RUN mvn clean install -DskipTests -Pproduction

EXPOSE 8080
CMD ["java", "-jar", "target/*.war"]
