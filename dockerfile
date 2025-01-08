FROM node:22.12.0-slim AS build

# create user under app group
RUN groupadd app && useradd -g app -s /bin/sh -m app
USER app
WORKDIR /app

COPY --chown=app:app package.json package-lock.json ./
RUN ["npm", "install"]

COPY . .
RUN ["npm", "run", "build"]

FROM nginx:alpine 

COPY ./build /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
