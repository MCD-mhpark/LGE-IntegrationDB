import './pre-start'; // Must be the first import
import logger from './public/modules/jet-logger/lib/index';
import server from './server';
import EnvVars from '@src/constants/EnvVars';

// **** Run **** //
//console.log(process.env.JET_LOGGER_FILEPATH);
const SERVER_START_MSG = (
`
#############################################
       Server listening on port: ${EnvVars.Port.toString()} 
############################################# 
`);

server.listen(EnvVars.Port, () => logger.info(SERVER_START_MSG));
