# Demo Store

This project is created to demonstrate my web development skills. It is a private project, and all rights are reserved. Redistribution, modification, or commercial use of any part of this project is strictly prohibited without the explicit written permission of the author.

## Frontend Tech Stack
- React + Redux + React Router
- Nginx
- Docker

## Super user account for demonstration purposes and admin page access
Visit [http://35.183.186.59/](http://35.183.186.59/) to access the main page with:
- Username and password: demouser
- The order confirmation email will be sent to a mock email address

Visit [http://35.183.186.59/admin/](http://35.183.186.59/admin/) to access the admin panel with:
- Username and password: demouser

## Devlopment Instructions

-   Run `yarn install` to install dependencies.
-   Run `yarn start` to start the project listening on port 3000.

## Deployment Instructions

-   Run `yarn build` to build the optimized bundle.

-   Run `docker build -t <image-name>:<tag> -f <Dockerfile-path> <path>` to build a docker image
    -    example: `docker build -t demo-store-frontend:1.0.0 -f Dockerfile.dev .` to start a container in devlopment mode
-   run `docker run -p <host-port>:3000 --name <container-name> <image-name>:<tag>` to run the image in an isolated development container listening on port 3000
    -    example: `docker run -p 3000:3000 --name frontend demo-store-frontend:1.0.0`

## Backend source code can be found [here](https://github.com/Linxuan-Chen/store_demo_backend)

## Integration using Docker Compose
The project utilizes Docker Compose to facilitate the integration of multiple services. The docker-compose.yml file can be found [here](https://github.com/Linxuan-Chen/store_demo_docker_compose_yml).