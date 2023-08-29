import express, { Request, Response } from "express";

import AccountService from "@src/services/AccountService"
import * as LgApi from "@src/api/Lg_Api"
import { IAccountReq, IAccountRes} from "@src/api/interface/interfaceApi"

//import {testData105, testData1050} from "@src/controller/testData"

const DB_to_Account = async(req: Request, res: Response): Promise<void> =>{

    try {
        const AccountReq: IAccountReq = {
            LGCompanyDivision: "EKHQ",
            SourceSystemDivision: "MAT",
            perCount: 5,
            nowPage: 1,
            beginDateTime: "2023-08-01 00:00",
            endDateTime: "2023-08-15 24:00",
        };
        
        //1. Account 생성 및 변경 목록 조회 (데이터가 없으면 CATCH로 떨어짐), 최초 1회 통신으로 totalpage Value 값 가져옴
        const accountData = await LgApi.AccountProvide(AccountReq);
        
        console.log(`AccountController>> account totalPage: ${accountData.totalPage}, account totalCount: ${accountData.totalCount}`);
        
        console.time('시작');
        //2. totalPage 수 만큼 for문 처리, 이후 data insert는 Service로직 태움
        for( let i = 1; i <= accountData.totalPage; i++ ){
            AccountReq.nowPage = i;
            console.log(AccountReq);

            const IntgrationDB_AccountData = await LgApi.AccountProvide(AccountReq);

            const result = await AccountService.integrationAccount(IntgrationDB_AccountData); 

            console.log(result);
            
        }

        console.log({
            "success" : "Account 데이터 생성 및 업데이트 완료",
        }); 
        console.timeEnd('시작');

        //배치프로그램이라 res, req 필요없음
        res.json({ success: 'success'})
   
    }catch(error) {
        console.log({
            "error" : "DB_to_Account",
            "response_msg" : error
        });        
        res.status(500).json({
            message: error
        })
    }
}


export default {
    DB_to_Account
}