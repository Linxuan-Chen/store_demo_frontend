FROM node:22.12.0-slim
# Create an app group and put app user in it
RUN groupadd app && useradd -g app -s /bin/sh -m app
USER app
WORKDIR /app
COPY --chown=app:app package*.json ./
RUN ["npm", "install"]
COPY . .
EXPOSE 3000
ENTRYPOINT [ "npm", "start" ]