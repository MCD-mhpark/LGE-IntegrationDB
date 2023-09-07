FROM node:18

WORKDIR /home/cns-fileUpload/

RUN npm install
RUN npm install -g pm2 

EXPOSE 4001

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
#CMD [ "nodemon", "-L", "./bin/www" ]

