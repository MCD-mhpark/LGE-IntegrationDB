import express, {Request, Response, NextFunction} from 'express';
import ContactController from '../controller/ContactController' 
import {lge_eloqua , lgeSdk_eloqua} from '@src/routes/Auth';
import * as utils from "@src/util/etc_function"
import logger from 'jet-logger';



import {ILgToken, ICompanyData, IAccountReq, IAccountRes ,convertCountry} from "@src/api/interface/interfaceApi"

const router = express.Router();
function logPath (req: Request, res: Response, next:NextFunction) {
    logger.settings.filepath = `./logs/contact/${utils.getToday()}_jet-logger.log`;
    next();
}


router.get('/test', logPath , ContactController.test);

router.post('/modified', logPath, ContactController.modified_Contact);








//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
interface test {
    age: number,
    name: string,
}

router.get('/tokentest', async (req:Request, res:Response):Promise<void> => {
  
})

// router.post('/testest', async (req:Request, res:Response):Promise<void> => {
//     try{
//         let data: IAccountReq = {
//             LGCompanyDivision:"EKHQ",
//             SourceSystemDivision:"MAT", 
//             perCount: 20,
//             nowPage: 3, 
//             beginDateTime:"2023-08-01 16:00",
//             endDateTime: "2023-08-24 16:00"
//         };
//         let aa = LgApi.AccountProvide(data);
//         res.json(aa);
//     }catch(error){
//         res.json(error)
//     }
// });


router.post('/testest1', async (req, res) => {

    const queryText = 
        "C_DateModified>" + "'" + utils.yesterday_getDateTime().start + " 10:00:00'" + 
        "C_DateModified<" + "'" + utils.yesterday_getDateTime().end + " 11:00:59'" +
        "C_DateCreated!=" + "'" + utils.yesterday_getDateTime().start +"'";	

    const queryText1 = 
        "C_DateCreated>" + "'" + utils.yesterday_getDateTime().start + " 00:00:00'" + 
        "C_DateCreated<" + "'" + utils.yesterday_getDateTime().start + " 23:59:59'"
        

    let q = {
        search : queryText,
        depth : ""
    };
    // q['search'] = email; 
    // q['depth'] = depth ? depth : ""
    console.log(q);//{ search: '1eee@goldenplanet.co.kr', depth: 'complete' }
    //lge_eloqua.contacts.getAll(q).then((result: any) => {
    await lgeSdk_eloqua.data.contacts.get(q).then((result:any) => {
        res.json(result.data);
    }).catch((err:any) => {
        console.error(err.message);
        res.json("연락처조회에 실패하였습니다.");
    });
});



export default router;
