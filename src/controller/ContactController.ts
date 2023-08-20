import express, { Request, Response } from "express";

import { IReqContact } from "@src/models/ContactDTO";
import ContactService from "@src/services/ContactService"
import * as utils from "@src/util/etc_function";

const test = async(req: Request, res: Response): Promise<any> =>{

    console.log(req);
    
    return res.status(200).json({
        message: "통신 성공"
    })
}

const modified_Contact = async(req: Request, res: Response): Promise<void> => {
    
    try {
        const queryText = 
        "C_DateModified>" + "'" + utils.yesterday_getDateTime().start + " 10:00:00'" + 
        "C_DateModified<" + "'" + utils.yesterday_getDateTime().end + " 11:00:59'";						
        //let queryText = "emailAddress='jtlim@goldenplanet.co.kr'";
        const queryString: IReqContact = {
            search: queryText,
            depth: "complete"
        }

        // 데이터 service에서 데이터 정제 완료 비즈니스 로직
    
        const sendContactData = ContactService.modified_Contact(queryString);
        
        // 최종적으로 통합 DB에 전달 하는 controller 
        //modidfed 된 컨택 
        console.log(sendContactData);
        
        res.status(200).json({
            message: "통신 성공"
        })
    } catch (error) {

    }


}


export default {
    test,
    modified_Contact
    
}