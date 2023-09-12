# FROM node:18
FROM ubuntu:20.04

ENV TZ=Asia/Seoul

ADD . /home/LG_IntegrationDB/
WORKDIR /home/LG_IntegrationDB/

RUN apt-get update -y && apt-get install -y vim && apt-get install -y sudo && apt-get install -y curl

RUN sudo apt-get install -y curl && curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
RUN sudo apt-get install -y nodejs

RUN npm ci
RUN npm install -g pm2 
RUN npm run build

EXPOSE 4000

CMD ["pm2-runtime", "start", "ecosystem.config.js"]



