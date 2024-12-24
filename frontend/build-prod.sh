#!/bin/bash

set -e

cp ../backend/core/api/src/core.openapi.yaml ../frontend/core.openapi.yaml &&
npm run build-prod &&
docker buildx build --platform linux/amd64 -f Dockerfile -t ghcr.io/firstapproval/fa-mono-frontend-prod . &&
docker push ghcr.io/firstapproval/fa-mono-frontend-prod
