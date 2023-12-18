FROM node:20 as build

COPY package.json .
RUN npm install
COPY . .

FROM nginx:1.24
COPY --from=build /build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
