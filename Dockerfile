FROM node:18

ENV TZ=Asia/Seoul

ADD . /home/cns-fileUpload/
WORKDIR /home/cns-fileUpload/

RUN npm install
RUN npm install -g pm2 

# TypeScript를 빌드합니다. (tsconfig.json 파일을 작성해야 합니다.)
RUN npm run build
RUN npm install -g pm2

EXPOSE 4001

CMD ["pm2-runtime", "ecosystem.config.js"]
##CMD ["pm2-runtime", "start", "ecosystem.config.js"]


