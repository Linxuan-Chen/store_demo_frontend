FROM nginx:alpine

# Copy the build output from the build stage to the Nginx server directory
COPY ./build /usr/share/nginx/html

# Copy custom Nginx configuration file
COPY ./nginx.conf /etc/nginx/nginx.conf

# Set environment variable for CloudFront URL
ENV REACT_APP_CLOUDFRONT_URL=https://d24m1jw4p6pn47.cloudfront.net/front_end_assets

# Expose port 80
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]