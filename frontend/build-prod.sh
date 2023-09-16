#!/bin/bash

set -e

npm run build-prod &&
docker buildx build --platform linux/amd64 -f Dockerfile -t ghcr.io/firstapproval/fa-mono-frontend-prod . &&
docker push ghcr.io/firstapproval/fa-mono-frontend-prod
