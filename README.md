# Demo Store

This project is created to demonstrate my web development skills. It is a private project, and all rights are reserved. Redistribution, modification, or commercial use of any part of this project is strictly prohibited without the explicit written permission of the author.

## Devlopment Instructions

-   Run `npm install` to install dependencies.
-   Run `npm start` to start the project listening on port 3000.

## Deployment Instructions

Run the following command on your local machine to generate the production-ready bundle before uploading the files. This step reduces the workload on the AWS EC2 instance.

-   Run `docker build -t <image-name>:<tag> -f <Dockerfile-path> <path>` to build an docker image
    -   \<image-name>: (string) The name of the Docker image
    -   \<tag>: (string) The tag of the Docker image
    -   \<path>: (string) Path of root directory of the source code
    -    example: `docker build -t demo-store-frontend:1.0.0 -f Dockerfile.dev .` to start a container in devlopment mode
-   run `docker run -p <host-port>:3000 --name <container-name> <image-name>:<tag>` to run the image in an isolated development container
    -   \<host-port>: (number) host port
    -   \<container-name>: (string) container name
    -    example: `docker run -p 3000:3000 --name frontend demo-store-frontend:1.0.0`

## Backend source code can be found [here](https://github.com/Linxuan-Chen/store_demo_backend)

## Integration using Docker Compose
The project utilizes Docker Compose to facilitate the integration of multiple services. The docker-compose.yml file can be found [here](https://github.com/Linxuan-Chen/store_demo_docker_compose_yml).