#!/bin/sh

# Waiting for Elasticsearch to be ready
until $(curl --output /dev/null --silent --get --fail "http://elasticsearch:9200/_cluster/health?wait_for_status=yellow"); do
    echo "Waiting for Elasticsearch..."
    sleep 5
done

if curl --output /dev/null --silent --head --fail "http://elasticsearch:9200/publications"; then
    echo "Index publications already exists, exiting."
    exit 0
else
    echo "Index publications does not exist, proceeding with creation..."
    curl -X PUT "http://elasticsearch:9200/publications" -H 'Content-Type: application/json' -d @/elastic.json
    echo "Index publications created."
fi
