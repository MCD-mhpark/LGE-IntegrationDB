import express, { Request, Response } from "express";
import AccountService from "@src/services/AccountService"
import * as LgApi from "@src/api/Lg_Api"
import * as utils from "@src/util/etc_function"
import { IAccountReq, IAccountRes} from "@src/api/interface/interfaceApi"
import { ICo } from "@src/models/CustomObjectDTO"
import logger from '../public/modules/jet-logger/lib/index';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

const DB_to_Account = async(): Promise<void> =>{

    try {
        logger.info('### 통합 DB Account Data INSERT ###');

        let nextSearch: boolean = true;
        const AccountReq: IAccountReq = {
            LGCompanyDivision: "EKHQ",
            SourceSystemDivision: "Eloqua",
            perCount: 1000,
            nowPage: 1,
            baseDate: '2023-11-08'
        };
        //baseDate: utils.getYesterday()
        
        logger.info(AccountReq);
        //console.time('Account DB INSERT Time');
        logger.warn("### STEP1. 통합 DB 생성 및 변경 Account 목록 COD 적재 ###"); 

        while(nextSearch){
            //1. 통합 DB 생성 및 변경 목록 Account 가져오기
            const AccountData = await LgApi.AccountProvideAPI(AccountReq);

            if(AccountData.resultCount == 0) {
                logger.info(`종료 >> account totalPage: ${AccountData.totalPage}, account totalCount: ${AccountData.totalCount}`);
                nextSearch = false;
                break;
            }
            logger.info(`${AccountReq.nowPage} >> account totalCount: ${AccountData.totalCount}`);
            
            //2. 통합 DB Account History에 insert
            await AccountService.insert_COD(AccountData);
            logger.info(`integrationAccount NOWPAGE INDEX: ${AccountReq.nowPage}의 resultCount:${AccountData.resultCount} END!`);

            ++AccountReq.nowPage;
        }

        //console.timeEnd('Account DB INSERT Time');
        logger.info("### Account 데이터 생성 및 업데이트 SUCCESS ###"); 

        logger.warn("### STEP2. Eloqua Account 생성 or 업데이트 ###"); 
        //3. Account COD Count Get
        const totalCount:number = await AccountService.get_AccountCOD("insert_get", true);
        if(totalCount == 0){
            logger.warn(" Eloqua Account에 적재할 데이터가 조회되지 않습니다. ")
        }else{
            const pageloopSize = Math.floor(totalCount / 1000) + 1
            for(let idx = 1; idx <= pageloopSize; idx++){
                //4.Account Create or Update logic
                let eloquaAccount:ICo = await AccountService.get_AccountCOD("insert_get",false,idx);
                await AccountService.integrationAccount(eloquaAccount);
            }
        }
   
    }catch(error) {
        logger.err({
            "error" : "DB_to_Account",
            "response_msg" : error.stack
        });        
    }
}

const COD_Delete = async(): Promise<void> => {



    if (isMainThread) { 
        const worker = new Worker(__filename); // 같은 dir폴더에 워커를 생성
        
        const numWorkers = 4; // 워커 스레드의 수
        
    } else { // 워커스레드
        // 위에서 생성한 worker는 여기서 동작
    }








    // let deleteData:ICo = await AccountService.get_AccountCOD();
    // logger.info(`COD 삭제 데이터 : ${deleteData.total}개`);
    
    // if(deleteData.total !== 0){

    //     for(let i = 1; i <= deleteData.total; i++){

    //     }
    //     //total이 0일때 까지 while 문 실행
    //     // while(deleteData.total == ){

    //     // }
    // }

    // let array = [1,2,3,4,5,6,7,8,9,10]
    // for(let i = 1; i <= array.length; i++){
    //     array[i] + 1
    // }

}

// const test = async(req: Request, res: Response): Promise<any> =>{
//     logger.info("account 성공성공성공성공성공");
//     return res.status(200).json({
//         message: "통신 성공"
//     })
// }

export default {
    DB_to_Account,
    //test
}