FROM openjdk:21-jdk-slim

# Set JAVA_HOME explicitly
ENV JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
ENV PATH=$JAVA_HOME/bin:$PATH

WORKDIR /app

# Copy Maven wrapper and dependencies
COPY .mvn .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source and build
COPY src src/
RUN ./mvnw clean install -DskipTests -Pproduction

EXPOSE 8080
CMD ["java", "-jar", "target/*.war"]
