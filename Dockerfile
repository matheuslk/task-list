FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY . ./

RUN ng build --configuration=production

FROM nginx:latest

COPY --from=build app/dist/task-list /usr/share/nginx/html

RUN ls

EXPOSE 80