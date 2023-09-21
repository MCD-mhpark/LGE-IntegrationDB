import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import cors from "cors";
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

console.log("test1");

// **** Setup **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(cookieParser(EnvVars.CookieProps.Secret));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production) {
  app.use(helmet());
}

// const whitelist = ['https://b2bmkt.lge.com', 'http://127.0.0.1:5500'] ;

// const corsOptions = {
// 	origin : function (origin:any, cb:any){
// 		if(whitelist.indexOf(origin) !== -1){
// 			console.log(`cors: ${origin} >> pass`);
// 			cb(null, true);
// 		}else{
// 			console.log(`cors: ${origin} >> false`);
// 			cb(new Error("not allow origin Error"))
// 		}
// 	},
// 	credential: true
// }

// app.use(cors(corsOptions));

const allowedOrigins = ["http://127.0.0.1:5500", "https://b2bmkt.lge.com"];

app.use((req:Request, res:Response, next) => {
// 클라이언트의 Origin 헤더 값을 가져옵니다.
let origin:any = "";
origin = req.headers.origin ;

  // 허용할 도메인들 중에 포함되어 있는지 확인합니다.
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  // preflight 요청(예: OPTIONS 메서드)에 대한 처리
  if (req.method === "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
})
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
