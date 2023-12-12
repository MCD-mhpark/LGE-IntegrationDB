import express, { Request, Response } from "express";
import AccountService from "@src/services/AccountService"
import * as LgApi from "@src/api/Lg_Api"
import * as utils from "@src/util/etc_function"
import { IAccountReq, IAccountProvideRes, AccountProvideInfo } from "@src/api/interface/interfaceApi"
import { ICo } from "@src/models/CustomObjectDTO"
import logger from '../public/modules/jet-logger/lib/index';
import { lge_eloqua, lgeSdk_eloqua } from '@src/routes/Auth';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import { ImportDefinitionRes, ImportDefCDO, ISyncRes, ISyncCheckRes } from "@src/models/BulkDTO"

const DB_to_BulkAccount = async(): Promise<void> =>{

    try {
        logger.info('### 통합 DB Account Data INSERT ###');
        logger.warn("STEP1. Bulk API Syncs URL 생성");
        //logger.warn("STEP1. 통합 DB 생성 및 변경 Account 목록 COD 적재"); 
        
        const importDefDTO = new ImportDefCDO();
        const importDef:ImportDefinitionRes = await lge_eloqua.bulk.def_CO_Imports(462, importDefDTO); 
        logger.info(importDef);
        
        //console.time('Account DB INSERT Time');        
        let nextSearch: boolean = true;
        const AccountReq: IAccountReq = {
            LGCompanyDivision: "EKHQ",
            SourceSystemDivision: "Eloqua",
            perCount: 1000,
            nowPage: 1,
            baseDate: utils.getYesterday()
        };

        while(nextSearch){
            //1. 통합 DB 생성 및 변경 목록 Account 가져오기
            const AccountData: IAccountProvideRes = await LgApi.AccountProvideAPI(AccountReq);
            if(AccountData.resultCount == 0) {
                logger.info(`종료 >> totalCount: ${AccountData.totalCount}`);
                nextSearch = false;
                break;
            }

            logger.info(`${AccountReq.nowPage} >> account totalCount: ${AccountData.totalCount}`);
            
            //2. 통합 DB Account History에 Bulk insert
            await AccountService.bulkInsert_CDO(AccountData, importDef.uri, AccountReq.nowPage, AccountData.resultCount);

            ++AccountReq.nowPage;
        }

        logger.warn("STEP2. Eloqua Account 생성 or 업데이트"); 
        //3. Account COD Count Get
        const totalCount:number = await AccountService.get_AccountCOD("insert_get", true);
        if(totalCount == 0){
            logger.warn(" Eloqua Account에 적재할 데이터가 조회되지 않습니다. ")
        }else{
            const pageloopSize = Math.floor(totalCount / 1000) + 1
            for(let idx = 1; idx <= pageloopSize; idx++){
                //4.Account Create or Update logic
                logger.info(`${idx} start`)
                let eloquaAccount:ICo = await AccountService.get_AccountCOD("insert_get",false,idx);
                logger.info(`${eloquaAccount.total} 중에 ${eloquaAccount.elements.length}`)
                await AccountService.integrationAccount(eloquaAccount);
                
            }
        }
        logger.info("### Account Table 적재 SUCCESS ###"); 

    }catch(error){
        logger.err(error); 
        logger.err(error.stack);
    }


}

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
        //console.time('Account DB INSERT Time');
        logger.warn("STEP1. 통합 DB 생성 및 변경 Account 목록 COD 적재"); 

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

        logger.warn("STEP2. Eloqua Account 생성 or 업데이트"); 
        //3. Account COD Count Get
        const totalCount:number = await AccountService.get_AccountCOD("insert_get", true);
        if(totalCount == 0){
            logger.warn(" Eloqua Account에 적재할 데이터가 조회되지 않습니다. ")
        }else{
            const pageloopSize = Math.floor(totalCount / 1000) + 1
            for(let idx = 1; idx <= pageloopSize; idx++){
                //4.Account Create or Update logic
                logger.info(`${idx} start`)
                let eloquaAccount:ICo = await AccountService.get_AccountCOD("insert_get",false,idx);
                logger.info(`${eloquaAccount.total} 중에 ${eloquaAccount.elements.length}`)
                await AccountService.integrationAccount(eloquaAccount);
                
            }
        }
        logger.info("### Account Table 적재 SUCCESS ###"); 
   
    }catch(error) {
        logger.err({
            "error" : "DB_to_Account",
            "response_msg" : error.stack
        });        
    }
}


// const COD_Delete = async(): Promise<void> => {

    //     if (isMainThread) { 
    //         const worker = new Worker(__filename); // 같은 dir폴더에 워커를 생성
            
    //         const numWorkers = 4; // 워커 스레드의 수
            
    //     } else { // 워커스레드
    //         // 위에서 생성한 worker는 여기서 동작
    //     }

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

//}

export default {
    DB_to_Account,
    DB_to_BulkAccount
    //test
}