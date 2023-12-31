#!/bin/bash

set -e

npm run build &&
docker buildx build --platform linux/amd64 -f Dockerfile -t ghcr.io/firstapproval/fa-mono-landing-prod . &&
docker push ghcr.io/firstapproval/fa-mono-landing-prod
