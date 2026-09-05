# Use Java 21 as the base image
FROM openjdk:21-jdk-slim

# Set working directory
WORKDIR /app

# Copy the Maven wrapper and pom.xml first (for caching dependencies)
COPY .mvn .mvn/
COPY mvnw pom.xml ./

# Make mvnw executable
RUN chmod +x mvnw

# Download dependencies (cached to speed up future builds)
RUN ./mvnw dependency:go-offline -B

# Copy the source code
COPY src src/

# Build the application (skip tests for speed)
RUN ./mvnw clean install -DskipTests -Pproduction

# Expose the default port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/*.war"]
