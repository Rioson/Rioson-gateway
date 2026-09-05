FROM maven:3.9-eclipse-temurin-21-alpine

WORKDIR /app

COPY . .

# List all pom.xml locations (this shows all modules)
RUN echo "=== ALL MODULES ==="
RUN find . -name "pom.xml" -exec dirname {} \;

# Build everything (no -pl)
RUN mvn clean install -DskipTests -Pproduction

# Find the artifact
RUN find /app -name "*.war" -o -name "*.jar" | grep -v "maven-wrapper" > /tmp/artifact.txt
RUN cat /tmp/artifact.txt || echo "NO ARTIFACT FOUND"

EXPOSE 8080

CMD sh -c 'ARTIFACT=$(grep -v "maven-wrapper" /tmp/artifact.txt | head -1); \
           if [ -z "$ARTIFACT" ]; then \
               echo "NO ARTIFACT FOUND. AVAILABLE FILES:"; \
               find /app -name "*.war" -o -name "*.jar" | grep -v "maven-wrapper"; \
               tail -f /dev/null; \
           else \
               echo "Starting: $ARTIFACT"; \
               java -jar $ARTIFACT; \
           fi'
