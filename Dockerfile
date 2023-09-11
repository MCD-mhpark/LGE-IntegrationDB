FROM node:18

ENV TZ=Asia/Seoul

WORKDIR /home/LG_IntegrationDB/
ADD . /home/LG_IntegrationDB/

RUN npm ci
RUN npm install -g pm2 

RUN npm run build

EXPOSE 4000

CMD ["pm2-runtime", "ecosystem.config.js"]
##CMD ["pm2-runtime", "start", "ecosystem.config.js"]


