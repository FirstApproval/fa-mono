FROM alpine:3.13

RUN apk add --no-cache curl

COPY elastic/elastic.json /elastic.json
COPY elastic/init-es-index.sh /init-es-index.sh

RUN chmod +x /init-es-index.sh

CMD [ "/init-es-index.sh" ]
