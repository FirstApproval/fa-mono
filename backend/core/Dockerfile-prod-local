FROM openjdk:17-slim

COPY core/build/libs/core.jar core.jar

ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "core.jar"]
