import express, {Request, Response} from 'express';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import ContactController from '../controller/ContactController' 
import {lge_eloqua , lgeSdk_eloqua} from '@src/routes/Auth';

import * as LgApi from "@src/api/Lg_Api"
import * as utils from "@src/util/etc_function"

import axios from "axios";

const router = express.Router();


router.get('/test', ContactController.test);

router.post('/modified', ContactController.modified_Contact);

router.get('/tokentest', async (req:Request, res:Response):Promise<void> => {
  let asdf = await LgApi.AccountSingleResult()
  res.json(asdf)
})

router.post('/testest', async (req:Request, res:Response):Promise<void> => {

    const queryText = 
        "C_DateModified>" + "'" + utils.yesterday_getDateTime().start + " 10:00:00'" + 
        "C_DateModified<" + "'" + utils.yesterday_getDateTime().end + " 11:00:59'" +
        "C_DateCreated!=" + "'" + utils.yesterday_getDateTime().start +"'";	

    const queryText1 = 
        "C_DateCreated>" + "'" + utils.yesterday_getDateTime().start + " 00:00:00'" + 
        "C_DateCreated<" + "'" + utils.yesterday_getDateTime().start + " 23:59:59'"
    
       const queryText2 = 
    "createdAt>" + "'" + utils.yesterday_getDateTime().start + " 00:00:00'" + 
    "createdAt<" + "'" + utils.yesterday_getDateTime().start + " 23:59:59'"
    const qt3 = `name='test12309@naver.com'`
    let qs = {
        search : queryText,
        depth : ""
    };

    let asdf = queryText

    let bulkq = {
        q: "createdAt>" + "'" + utils.yesterday_getDateTime().start + " 00:00:00'" + 
        "createdAt<" + "'" + utils.yesterday_getDateTime().start + " 23:59:59'",
        limit: 5000,
        offset: 5000,
        orderBy:'name ASC'
    }
    // q['search'] = email; 
    // q['depth'] = depth ? depth : ""
    console.log(bulkq);//{ search: '1eee@goldenplanet.co.kr', depth: 'complete' }
    //lge_eloqua.contacts.getAll(q).then((result: any) => {
    //await lgeSdk_eloqua.data.contacts.get(q).then((result: any) => {
    await lgeSdk_eloqua.bulk.contacts.lists.get(bulkq).then((result: any) => {
        res.json(result.data);
    }).catch((err: any) => {
        console.error(err.message);
        res.json("연락처조회에 실패하였습니다.");
    });
});


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
