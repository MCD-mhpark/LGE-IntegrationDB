import express, { Request, Response } from "express";

import AccountService from "@src/services/AccountService"
import * as LgApi from "@src/api/Lg_Api"
import { IAccountReq, IAccountRes} from "@src/api/interface/interfaceApi"


const DB_to_Account = async(req: Request, res: Response): Promise<void> =>{

    try {
        const AccountReq: IAccountReq = {
            LGCompanyDivision: "EKHQ",
            SourceSystemDivision: "MAT",
            perCount: 1000,
            nowPage: 1,
            beginDateTime: "2023-08-01 00:00",
            endDateTime: "2023-08-15 24:00",
        }

        const IntgrationDB_AccountData = await LgApi.AccountProvide(AccountReq);
        if(IntgrationDB_AccountData.total / AccountReq.perCount)
        res.json(IntgrationDB_AccountData)
        

        // for(let data of LGresult){
        //     console.log(`${data} >>> id 매칭 시작`);
            
        //     const aa = await AccountService.searchAccount(data);
        //     console.log(aa);
        // }

        //Account 조회 
        //console.log(AccountService.search_account)
        
        //Account Create
        //const aa = await AccountService.createAccount();
        //Account update
        //console.log(AccountService.search_account)
   
    }catch(error) {
        console.log('에러 발생2');
        
        res.status(500).json({
            message: error
        })
    }
}


export default {
    DB_to_Account
}