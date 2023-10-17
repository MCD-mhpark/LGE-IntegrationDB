import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import cors from "cors";
// import fs from 'fs';
// import https from 'https';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from './public/modules/jet-logger/lib/index';
import 'express-async-errors';

// import BaseRouter from '@src/routes/api';
// import Paths from '@src/routes/constants/Paths';

import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import { NodeEnvs } from '@src/constants/misc';
import { RouteError } from '@src/other/classes';

import contactRoutes from '@src/routes/ContactRoutes';
import accountRoutes from '@src/routes/AccountRoutes';

// **** Variables **** //

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(cookieParser(EnvVars.CookieProps.Secret));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev) {
  app.use(morgan('dev'));
}

const whitelist = ['https://b2bmkt.lge.com', 'http://127.0.0.1:5501'] ;
// const whitelist = ["*"] ;

const corsOptions = {
  origin : function (origin:any, cb:any){
    if(whitelist.indexOf(origin) !== -1){
      logger.info(`cors: ${origin} >> pass`);
      cb(null, true);
    }else{
      logger.info(`cors: ${origin} >> false`);
      //cb(new Error("not allow origin Error"))
    }
  },
  credential: true
}
// Security
if (EnvVars.NodeEnv === NodeEnvs.Production) {
  app.use(helmet());
  app.use(cors(corsOptions));
}



//Add APIs, must be after middleware
// app.use(Paths.Base, BaseRouter);

// Add error handler
app.use((
  err: Error,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if (EnvVars.NodeEnv !== NodeEnvs.Test) {
    logger.err(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
  }
  return res.status(status).json({ error: err.message });
});


//app.use(Auth);
app.use('/eloquaContact', contactRoutes);
app.use('/eloquaAccount', accountRoutes);

// **** Export default **** //

export default app;
