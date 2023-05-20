FROM node:18.15.0-alpine
WORKDIR /api
COPY ["package.json", "./"]
RUN npm install
COPY . ./
EXPOSE 3000
