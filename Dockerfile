FROM maven:3.9-eclipse-temurin-21-alpine

WORKDIR /app

COPY .mvn .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw

COPY src src/

RUN ./mvnw clean install -DskipTests -Pproduction

EXPOSE 8080
CMD ["java", "-jar", "target/*.war"]
