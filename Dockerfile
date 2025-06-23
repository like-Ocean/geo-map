FROM node:20-alpine as build

WORKDIR /app

COPY . ./

RUN yarn
RUN yarn build

# ---------------------------------------------------

FROM nginx:1.21.4

COPY --from=build /app/dist/ /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]