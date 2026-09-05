# Use a standard Maven image
FROM maven:3.9-eclipse-temurin-21-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the entire project into the container
COPY . .

# Build the application
RUN mvn clean install -DskipTests -Pproduction

# Expose the default port
EXPOSE 8080

# --- This is the most important part for debugging ---
# Step 1: Find the built .jar or .war file and print its location
# Step 2: Run that specific file
RUN echo "Searching for the built artifact..."
RUN find /app -name "*.jar" -o -name "*.war" > /tmp/artifact.txt && cat /tmp/artifact.txt

CMD sh -c 'ARTIFACT_FILE=$(cat /tmp/artifact.txt | head -n1); echo "Starting application: $ARTIFACT_FILE"; java -jar $ARTIFACT_FILE'
