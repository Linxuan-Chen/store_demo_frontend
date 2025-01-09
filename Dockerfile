FROM node:22.12.0-slim AS build

# create user under app group
RUN groupadd app && useradd -g app -s /bin/sh -m app
USER app
WORKDIR /app

COPY --chown=app:app package.json package-lock.json ./
RUN ["npm", "install"]

COPY . .

FROM nginx:alpine 

COPY ./build /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/nginx.conf

ENV REACT_APP_CLOUDFRONT_URL=https://d24m1jw4p6pn47.cloudfront.net/front_end_assets

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
