FROM node:18

ENV TZ=Asia/Seoul

ADD . /home/LG_IntegrationDB/
WORKDIR /home/LG_IntegrationDB/

RUN apt-get update -y && apt-get install -y vim && apt-get install -y sudo && apt-get install -y curl

RUN sudo npm install --global pm2 
RUN sudo npm install
RUN npm run build

EXPOSE 4000

CMD ["sh", "-c", "pm2 list && pm2-runtime start ecosystem.config.js"]
#ENTRYPOINT ["pm2-runtime", "start", "ecosystem.config.js"]

# CMD ["npm", "run", "start"]
