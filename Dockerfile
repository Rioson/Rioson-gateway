FROM maven:3.9-eclipse-temurin-21-alpine

WORKDIR /app

COPY . .

# Build only the web module (replace with actual module name)
RUN mvn clean install -DskipTests -Pproduction -pl server -am

# Find the artifact in the module's target folder
RUN find /app -path "*/target/*.war" -o -path "*/target/*.jar" | grep -v "maven-wrapper" > /tmp/artifact.txt

EXPOSE 8080

CMD sh -c 'ARTIFACT=$(cat /tmp/artifact.txt | head -1); \
           echo "Starting: $ARTIFACT"; \
           java -jar $ARTIFACT'
