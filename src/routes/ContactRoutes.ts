import express, {Request, Response, NextFunction} from 'express';
import ContactController from '../controller/ContactController' 
import * as utils from "@src/util/etc_function";
import {api_searchCompany} from "@src/api/singlex_Api";
import logger from '../public/modules/jet-logger/lib/index';
import * as schedule from 'node-schedule';
import cors from "cors";

const router = express.Router();
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
//cors(corsOptions)

/*
* Contact 연동
*/
// Contact UID 발급 프로세스 오후 3시, 3시 30분
const rule = new schedule.RecurrenceRule();
rule.hour = 15;
rule.minute = [1, 30]; // 15시 1분과 15시 30분
schedule.scheduleJob(rule, async () => {
    const currentTime = new Date();
    const time = currentTime.getMinutes() === 1 ? "1차시기" :  "2차시기";
    console.log(currentTime.getMinutes());
    
    try {
        logger.settings.filepath = `./LGE_logs/contact/${utils.getToday()}_jet-logger.log`

        await ContactController.UID_Process(time); 

    } catch (error) {
        logger.err('AccountController.DB_to_Account schedule 중 오류:', error);
    }
});
//router.post('/modified', logPath, ContactController.UID_Process);

// Contact Data => 통합 DB 전송 오후 4시
schedule.scheduleJob('0 50 15 * * *', async () => {
    try {
        logger.settings.filepath = `./LGE_logs/contact/send/${utils.getToday()}_jet-logger.log`;

        await ContactController.Send_Contact(); 

    } catch (error) {
        logger.err('ContactController.Send_Contact schedule 중 오류:', error);
    }
});
//router.post('/send', sendlogPath, ContactController.Send_Contact);

// 랜딩페이지에서 사용하는 Company 조회
router.post('/gpSinglexAPI', slogPath ,async (req: Request, res: Response):Promise<void> => {
    try{
        let result = await api_searchCompany(req.body.type, req.body.url ,req.body.value);
        res.json(result);
    }catch(error){
        logger.err('### gp error /gpSinglexAPI ###');
        logger.err(error);
        res.json(error);
    }
    
});

//router.post('/test' ,ContactController.test);

/*
* LOG PATH 설정
*/
function logPath (req: Request, res: Response, next:NextFunction) {
    logger.settings.filepath = `./LGE_logs/contact/${utils.getToday()}_jet-logger.log`;
    next();
}
function sendlogPath (req: Request, res: Response, next:NextFunction) {
    logger.settings.filepath = `./LGE_logs/contact/send/${utils.getToday()}_jet-logger.log`;
    next();
}

function slogPath (req: Request, res: Response, next:NextFunction) {
    logger.settings.filepath = `./LGE_logs/singlex/${utils.getToday()}_jet-logger.log`;
    next();
}

export default router;
