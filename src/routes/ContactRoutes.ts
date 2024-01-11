import express, {Request, Response, NextFunction} from 'express';
import ContactController from '../controller/ContactController' 
import * as utils from "@src/util/etc_function";
import {api_searchCompany} from "@src/api/singlex_Api";
import logger from '../public/modules/jet-logger/lib/index';
import * as schedule from 'node-schedule';

const router = express.Router();

/*
* Contact UID Check Logic
*/
// Contact UID 발급 프로세스 오후 3시, 3시 30분
const rule = new schedule.RecurrenceRule();
rule.hour = 15;
rule.minute = [1, 30]; // 15시 1분과 15시 30분
if(process.env.INSTANCE_ID === '2'){
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
}
//router.post('/modified', logPath, ContactController.UID_Process);

// Contact Data => 통합 DB 전송 오후 4시
if(process.env.INSTANCE_ID === '2'){
    schedule.scheduleJob('0 0 16 * * *', async () => {
        try {
            //로그 path Setting
            logger.settings.filepath = `./LGE_logs/contact/send/${utils.getToday()}_jet-logger.log`;

            ContactController.Send_Contact(); 

        } catch (error) {
            logger.err('ContactController.Send_Contact schedule 중 오류:', error);
        }
    });
}
//Contact Data => 통합 DB 전송 POST 요청 (수동 업로드 시, 편하게 사용하기 위하여)
//router.post('/send', clogPath ,ContactController.Send_Contact);

// 랜딩페이지에서 사용하는 Company 조회
router.post('/gpSinglexAPI', slogPath ,async (req: Request, res: Response):Promise<void> => {
    try{
        let result = await api_searchCompany(req.body.type, req.body.url ,req.body.device ,req.body.value);
        res.json(result);
    }catch(error){
        logger.err('### Error /gpSinglexAPI ###');
        logger.err(error);
        res.json(error.message);
    }
    
});

//router.post('/test' ,ContactController.test);



/*
* LOG PATH 설정
*/
function slogPath (req: Request, res: Response, next:NextFunction) {
    logger.settings.filepath = `./LGE_logs/singlex/${utils.getToday()}_jet-logger.log`;
    next();
}

function clogPath (req: Request, res: Response, next:NextFunction) {
    logger.settings.filepath = `./LGE_logs/contact/send/${utils.getToday()}_jet-logger.log`;
    next();
}

export default router;
