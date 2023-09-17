#!/bin/bash

set -e

./gradlew clean bootJar &&
docker buildx build --platform linux/amd64 -f core/Dockerfile -t ghcr.io/firstapproval/fa-mono-backend . &&
docker push ghcr.io/firstapproval/fa-mono-backend

docker buildx build --platform linux/amd64 -f elastic/Dockerfile -t ghcr.io/firstapproval/fa-elastic-init . &&
docker push ghcr.io/firstapproval/fa-elastic-init
