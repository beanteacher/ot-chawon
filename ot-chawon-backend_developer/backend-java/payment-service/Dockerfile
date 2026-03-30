# ---- development ----
FROM gradle:8-jdk17 AS development
WORKDIR /app
COPY . .
CMD ["gradle", "bootRun", "--no-daemon"]

# ---- builder ----
FROM gradle:8-jdk17 AS builder
WORKDIR /app
COPY build.gradle settings.gradle ./
COPY gradle ./gradle
RUN gradle dependencies --no-daemon || true
COPY src ./src
RUN gradle bootJar --no-daemon -x test

# ---- runtime ----
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S spring && adduser -S spring -G spring
COPY --from=builder /app/build/libs/*.jar app.jar
USER spring:spring
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]
