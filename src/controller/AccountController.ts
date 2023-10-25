import express, { Request, Response } from "express";
import AccountService from "@src/services/AccountService"
import * as LgApi from "@src/api/Lg_Api"
import * as utils from "@src/util/etc_function"
import { IAccountReq, IAccountRes} from "@src/api/interface/interfaceApi"
import logger from '../public/modules/jet-logger/lib/index';

const DB_to_Account = async(): Promise<void> =>{

    try {
        logger.info('### 통합 DB Account Data INSERT ###');

        let nextSearch: boolean = true;
        const AccountReq: IAccountReq = {
            LGCompanyDivision: "EKHQ",
            SourceSystemDivision: "Eloqua",
            perCount: 1000,
            nowPage: 1,
            baseDate: utils.getYesterday()
        };

        logger.info(AccountReq);
        
        console.time('Account DB INSERT Time');
        
        //2. totalPage 수 만큼 for문 처리, 이후 data insert는 Service로직 태움
        while(nextSearch){
            const AccountData = await LgApi.AccountProvideAPI(AccountReq);
            if(AccountData.result.Account == undefined) {
                logger.info(`최종>> account totalPage: ${AccountData.totalPage}, account totalCount: ${AccountData.totalCount}`);
                nextSearch = false;
                break;
            }
            logger.info(`integrationAccount NOWPAGE INDEX: ${AccountReq.nowPage} START!`); 
            
            await AccountService.integrationAccount(AccountData);

            logger.info(`integrationAccount NOWPAGE INDEX: ${AccountReq.nowPage} END!`);

            ++AccountReq.nowPage;
        }

        console.timeEnd('Account DB INSERT Time');
        logger.info("### Account 데이터 생성 및 업데이트 SUCCESS ###"); 

        //res.json({ success: 'success'})
   
    }catch(error) {
        logger.err({
            "error" : "DB_to_Account",
            "response_msg" : error
        });        
        // res.status(500).json({
        //     message: error
        // })
    }
}

const test = async(req: Request, res: Response): Promise<any> =>{
    logger.info("account 성공성공성공성공성공");
    return res.status(200).json({
        message: "통신 성공"
    })
}

export default {
    DB_to_Account,
    test
}