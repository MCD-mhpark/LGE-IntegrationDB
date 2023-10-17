import './pre-start'; // Must be the first import
import logger from './public/modules/jet-logger/lib/index';
import app from './server';
import EnvVars from '@src/constants/EnvVars';
import fs from 'fs';
import https from 'https';

// **** Run **** //
//console.log(process.env.JET_LOGGER_FILEPATH);

// **** SSL Setup **** //
let sslKeys = {};

//eloqua-dnb.lge.com
//if (process.env.NODE_ENV === 'production') {
       sslKeys = {
              key: fs.readFileSync(`${process.cwd()}/config/ssl/eloqua-dnb_lge_com_Nopasskey.pem`),
              cert: fs.readFileSync(`${process.cwd()}/config/ssl/eloqua-dnb_lge_com_cert.pem`)
       };
//}

// sslKeys = {
//        key: fs.readFileSync(`${process.cwd()}/config/sslTest/private.key`),
//        cert: fs.readFileSync(`${process.cwd()}/config/sslTest/certificate.crt`)
// };

const server = https.createServer(sslKeys, app);
//console.log(server);
//let hostname = 'www.eloqua-dnb.lge.com';

const SERVER_START_MSG = (
`
#############################################
       Server listening on port: ${EnvVars.Port.toString()} 
############################################# 
`);
//const server = https.createServer(sslKeys, app).listen(443);
server.listen(EnvVars.Port, () => logger.info(SERVER_START_MSG));
