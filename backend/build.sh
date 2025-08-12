#!/bin/bash

set -e

./gradlew clean bootJar &&
docker buildx build --platform linux/amd64 -f core/Dockerfile-local -t ghcr.io/firstapproval/fa-mono-backend . &&
docker push ghcr.io/firstapproval/fa-mono-backend
