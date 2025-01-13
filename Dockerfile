FROM node:22.12.0-slim AS build

# Create user and add it to the app group
RUN groupadd app && useradd -g app -s /bin/sh -m app
USER app
WORKDIR /app

# Install Yarn globally
RUN npm install yarn

# Copy package.json and yarn.lock files
COPY --chown=app:app package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy all other files into the container
COPY --chown=app:app . .

# Build the application using Yarn
RUN yarn build

FROM nginx:alpine

# Copy the build output from the build stage to the Nginx server directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration file
COPY ./nginx.conf /etc/nginx/nginx.conf

# Set environment variable for CloudFront URL
ENV REACT_APP_CLOUDFRONT_URL=https://d24m1jw4p6pn47.cloudfront.net/front_end_assets

# Expose port 80
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
