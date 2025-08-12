#!/bin/bash

set -e

cp ../backend/core/api/src/core.openapi.yaml ../frontend/core.openapi.yaml &&
npm run build-dev &&
docker buildx build --platform linux/amd64 -f Dockerfile-local -t ghcr.io/firstapproval/fa-mono-frontend . &&
docker push ghcr.io/firstapproval/fa-mono-frontend
