import express, {Request, Response} from 'express';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import ContactController from '../controller/ContactController' 
import { lge_eloqua } from '@src/routes/Auth';
import { lgeSdk_eloqua } from '@src/routes/Auth';

import * as utils from "@src/util/etc_function"

const router = express.Router();

interface contactSearch {
      email: string;
      depth: string;
  }


router.get('/test', ContactController.test);

router.post('/modified', ContactController.modified_Contact);

router.post('/testest', (req: Request, res: Response):void => {

    const queryText = 
        "C_DateModified>" + "'" + utils.yesterday_getDateTime().start + " 10:00:00'" + 
        "C_DateModified<" + "'" + utils.yesterday_getDateTime().end + " 11:00:59'" +
        "C_DateCreated!=" + "'" + utils.yesterday_getDateTime().start +"'";	

    const queryText1 = 
        "C_DateCreated>" + "'" + utils.yesterday_getDateTime().start + " 00:00:00'" + 
        "C_DateCreated<" + "'" + utils.yesterday_getDateTime().start + " 23:59:59'"
        

    let q = {
        search : queryText1,
        depth : ""
    };
    // q['search'] = email; 
    // q['depth'] = depth ? depth : ""
    console.log(q);//{ search: '1eee@goldenplanet.co.kr', depth: 'complete' }
    //lge_eloqua.contacts.getAll(q).then((result: any) => {
    lgeSdk_eloqua.data.contacts.get(q).then((result: any) => {
        res.json(result);
    }).catch((err: any) => {
        console.error(err.message);
        res.json("연락처조회에 실패하였습니다.");
    });
});



export default router;
