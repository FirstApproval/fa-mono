FROM eclipse-temurin:17.0.6_10-jdk-focal as builder

WORKDIR /app

COPY gradle/ gradle/
COPY gradlew .

RUN ./gradlew --version

COPY . .

RUN ./gradlew core:build --no-daemon

FROM eclipse-temurin:17.0.6_10-jdk-focal

WORKDIR /app

COPY --from=builder /app/core/build/libs/core.jar core.jar
COPY core/src/main/resources/*.properties ./

USER www-data

ENTRYPOINT ["java", "-Dspring.profiles.active=dev", "-jar", "core.jar"]
