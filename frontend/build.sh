#!/bin/bash

set -e

npm run build-dev &&
docker buildx build --platform linux/amd64 -f Dockerfile -t ghcr.io/firstapproval/fa-mono-frontend . &&
docker push ghcr.io/firstapproval/fa-mono-frontend
