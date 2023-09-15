import express, {Request, Response, NextFunction} from 'express';
import AccountController from '@src/controller/AccountController';
import * as utils from "@src/util/etc_function";
import logger from 'jet-logger';
const router = express.Router();

function logPath (req: Request, res: Response, next:NextFunction) {
    logger.settings.filepath = `./LGE_logs/account/${utils.getToday()}_jet-logger.log`
    next();
}

router.get('/test', logPath , AccountController.test);

router.post('/update', logPath ,AccountController.DB_to_Account);



export default router;