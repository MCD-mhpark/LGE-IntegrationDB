import express, {Request, Response, NextFunction} from 'express';
import ContactController from '../controller/ContactController' 
import {lge_eloqua , lgeSdk_eloqua} from '@src/routes/Auth';
import * as utils from "@src/util/etc_function";
import cors from "cors";
import {searchKoreaCompany, searchCompany} from "@src/api/singlex_Api";
import logger from 'jet-logger';
import {ILgToken, ICompanyData, IAccountReq, IAccountRes ,convertCountry} from "@src/api/interface/interfaceApi"

const whitelist = ['https://b2bmkt.lge.com'];
// const corsOptons : cors.CorsOptions = {
//     origin: whitelist,
//     credentials: true,
//     optionsSuccessStatus: 200
// }
const corsOptons = {
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
    logger.settings.filepath = `./logs/contact/${utils.getToday()}_jet-logger.log`;
    next();
}

function slogPath (req: Request, res: Response, next:NextFunction) {
    logger.settings.filepath = `./logs/singlex/${utils.getToday()}_jet-logger.log`;
    next();
}

router.get('/test', logPath , ContactController.test);

router.post('/modified', logPath, ContactController.modified_Contact);

router.post('/gpSinglexAp/kr', cors(corsOptons) ,slogPath, async (req: Request, res: Response) => {
    logger.info(req.body);
    try{
        let result = await searchKoreaCompany(req.body.type, req.body.value);
        console.log('result', result);
        res.json(result);
    }catch(error){
        logger.err('### gp error /gpSinglexAp/kr api ###');
        logger.err('error', error);
        console.log(error);
        res.json(error);
    }

});

router.post('/gpSinglexApi/global', cors(corsOptons) , slogPath, async (req: Request, res: Response) => {
    logger.info(req.body);
    try{
        let result = await searchCompany(req.body.type, req.body.value, req.body.countryCode);
        res.json(result);
    }catch(error){
        logger.err('### gp error /gpSinglexAp/global api ###');
        logger.err('error', error);
        res.json(error);
    }

});





//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
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
