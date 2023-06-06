FROM node:20 as build
RUN apt-get update \
     && apt-get install default-jre -y \
     && apt-get install default-jdk -y
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.24
COPY --from=build /build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]