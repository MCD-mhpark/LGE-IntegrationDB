import express, {Request, Response, NextFunction} from 'express';
import * as schedule from 'node-schedule';
import AccountController from '@src/controller/AccountController';
import * as utils from "@src/util/etc_function";
import logger from '../public/modules/jet-logger/lib/index';
const router = express.Router();

//오후 14시, Account 정보 magration
if(process.env.INSTANCE_ID === '1'){
    schedule.scheduleJob('0 0 14 * * *', async () => {
        try {
            logger.settings.filepath = `./LGE_logs/account/${utils.getToday()}_jet-logger.log`
    
            await AccountController.DB_to_Account(); 
    
        } catch (error) {
            logger.err('AccountController.DB_to_Account schedule 중 오류:', error);
        }
    });
}

router.post('/bulktest', async (req: Request, res: Response):Promise<void> => {
    try{
         await AccountController.DB_to_BulkAccount();
    }catch(error){
        logger.err('### Error /bulktest ###');
        logger.err(error);
        res.json(error.message);
    }
})
//router.post('/update', AccountController.DB_to_Account);

//router.get('/test', AccountController.test);

export default router;