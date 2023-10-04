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
// console.log(process.cwd());
// console.log('__dirname', __dirname);

//eloqua-dnb.lge.com
if (process.env.NODE_ENV === 'production') {
       sslKeys = {
              key: fs.readFileSync(`${process.cwd()}/config/ssl/eloqua-dnb_lge_com_Nopasskey.pem`),
              cert: fs.readFileSync(`${process.cwd()}/config/ssl/eloqua-dnb_lge_com_cert.pem`),
       };
}

const server = https.createServer(sslKeys, app);
//console.log(server);


const SERVER_START_MSG = (
`
#############################################
       Server listening on port: ${EnvVars.Port.toString()} 
############################################# 
`);
//const server = https.createServer(sslKeys, app).listen(443);
server.listen(EnvVars.Port, () => logger.info(SERVER_START_MSG));
