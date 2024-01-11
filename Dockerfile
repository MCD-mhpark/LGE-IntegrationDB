FROM node:18

ENV LC_ALL=C.UTF-8
ENV TZ=Asia/Seoul

ADD . /home/LG_IntegrationDB/
WORKDIR /home/LG_IntegrationDB/

RUN apt-get update -y && apt-get install -y vim && apt-get install -y sudo && apt-get install -y curl

RUN sudo npm install --global pm2 
RUN sudo npm install
RUN npm run build

#VOLUME [ "/home/opc/LG_IntegrationDB_LGE_log"]

EXPOSE 9000

CMD ["sh", "-c", "pm2 list && pm2-runtime start ecosystem.config.js"]
