import cors from "cors";
import express, {Request, Response, NextFunction} from 'express';
import ContactController from '../controller/ContactController' 
import {lge_eloqua , lgeSdk_eloqua} from '@src/routes/Auth';
import * as utils from "@src/util/etc_function";
import {api_searchCompany} from "@src/api/singlex_Api";
import logger from '../public/modules/jet-logger/lib/index';
import {ILgToken, ICompanyData, IAccountReq, IAccountRes ,convertCountry} from "@src/api/interface/interfaceApi"

const whitelist = ['https://b2bmkt.lge.com', 'http://127.0.0.1:5500'] ;
// const corsOptons : cors.CorsOptions = {
//     origin: whitelist,
//     credentials: true,
//     optionsSuccessStatus: 200
// }
// const corsOptions = {
//     origin: "https://b2bmkt.lge.com", // 허용할 origin을 여기에 지정하세요.
//     //credentials: true, // 인증 정보를 포함할 경우 true로 설정하세요.
//     optionsSuccessStatus: 200
//   };
const corsOptions = {
	origin : function (origin:any, cb:any){
		if(whitelist.indexOf(origin) !== -1){
			console.log(`cors: ${origin} >> pass`);
			cb(null, true);
		}else{
			console.log(`cors: ${origin} >> false`);
			cb(new Error("not allow origin Error"))
		}
	},
	credential: true
}
const router = express.Router();


function logPath (req: Request, res: Response, next:NextFunction) {
    logger.settings.filepath = `./LGE_logs/contact/${utils.getToday()}_jet-logger.log`;
    next();
}
function sendlogPath (req: Request, res: Response, next:NextFunction) {
    logger.settings.filepath = `./LGE_logs/contact/send/${utils.getToday()}_jet-logger.log`;
    next();
}

router.post('/test' ,ContactController.test);
//cors(corsOptions)


/*
* Contact 연동
*/
// Contact UID 발급 프로세스 오후 3~4시
router.post('/modified', logPath, ContactController.UID_Process);

// Contact Data => 통합 DB 전송 오후 4시
router.post('/send', sendlogPath, ContactController.Send_Contact);





function slogPath (req: Request, res: Response, next:NextFunction) {
    logger.settings.filepath = `./LGE_logs/singlex/${utils.getToday()}_jet-logger.log`;
    next();
}
router.post('/gpSinglexAPI', cors(corsOptions) , async (req: Request, res: Response):Promise<void> => {
    console.log(req.body);
    try{
        let result = await api_searchCompany(req.body.type, req.body.url ,req.body.value);
        //console.log('result', result);
        res.json(result);
    }catch(error){
        logger.err('### gp error /gpSinglexAPI ###');
        logger.err('error', error);
        console.log(error);
        res.json(error);
    }
    //res.json("성공")

});



export default router;
