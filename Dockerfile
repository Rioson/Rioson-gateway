# syntax=docker/dockerfile:1.7

FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /workspace

COPY .mvn/ .mvn/
COPY . .
RUN chmod +x mvnw
RUN ./mvnw -B -ntp -pl opba-embedded-starter -am package -DskipTests \
    && test -f opba-embedded-starter/target/open-banking-gateway-*-exec.jar

FROM eclipse-temurin:21-jre-alpine AS runtime
RUN addgroup -S opba && adduser -S -G opba opba
WORKDIR /app

COPY --from=build /workspace/opba-embedded-starter/target/open-banking-gateway-*-exec.jar /app/open-banking-gateway.jar
RUN chown -R opba:opba /app

USER opba
EXPOSE 8085
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75 -XX:+ExitOnOutOfMemoryError"

HEALTHCHECK --interval=30s --timeout=5s --start-period=90s --retries=5 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:8085/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "/app/open-banking-gateway.jar"]
