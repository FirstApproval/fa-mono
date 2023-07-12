#!/bin/bash

set -e

npm run build-local &&
rm -f core.openapi.yaml &&
cp ../backend/core/api/src/core.openapi.yaml . &&
docker buildx build --platform linux/amd64 -f Dockerfile -t ghcr.io/firstapproval/fa-mono-frontend . &&
docker push ghcr.io/firstapproval/fa-mono-frontend
