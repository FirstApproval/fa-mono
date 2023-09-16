#!/bin/bash

set -e

./gradlew clean bootJar &&
docker buildx build --platform linux/amd64 -f core/Dockerfile-prod -t ghcr.io/firstapproval/fa-mono-backend-prod . &&
docker push ghcr.io/firstapproval/fa-mono-backend-prod
