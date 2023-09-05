import express, { Request, Response } from "express";

import { Contact, IReqContact } from "@src/models/ContactDTO";
import ContactService from "@src/services/ContactService"
import {convertCountry} from "@src/api/interface/interfaceApi"
import {AccountSingleResult} from "@src/api/Lg_Api"
import * as utils from "@src/util/etc_function";

const test = async(req: Request, res: Response): Promise<any> =>{

    console.log(req);
    
    return res.status(200).json({
        message: "통신 성공"
    })
}


/*
* 전 날 C_DateModified 조회 Contact 기준
* KR => 국가 = KR && 사업자등록번호 != null
* Global_T => 국가 = Global 이면 TaxID != null
* Global_D => 국가 = Global 이면 DunsNumber != null
*/
const modified_Contact = async(req: Request, res: Response): Promise<void> => {
    
    try {
        
        //1. 전 날 C_DateModified이면서 code 조건: KR, Global_D, Global_T
        const resdata = await ContactService.Get_ContactList("KR");
        const contactData: Contact[] = resdata.elements;

        //* 페이지 처리 해야함
        console.log(resdata.total);
        

        //2. UID 조회 (KR: 국가코드 + 사업자 등록번호, Global: 국가코드 + Tax ID or Duns N)
        for(const data of contactData){

            const email = data.emailAddress;
            let companyName: string | undefined = data.hasOwnProperty('accountName') ? data.accountName : undefined ;
            console.log(`### email: ${email}, CompanyName: ${companyName} ###`);
            
            
            
            let regNum: string = utils.matchFieldValues(data, '100398');
            let taxId: string = utils.matchFieldValues(data, '100420');
            let duns_Number: string = utils.matchFieldValues(data, '100421');


            //UID 존재 여부 확인 및 UID 발급 요청, return UID 값
            const UID = await ContactService.Check_UID(convertCountry(data.country), regNum, taxId, duns_Number);

            //Contact Data Update

            //Contact Data Form Insert
   
            //AccountSingleResult
        }



        //const sendContactData = await ContactService.Insert_Form();
        
        // 최종적으로 통합 DB에 전달 하는 controller 
        //modidfed 된 컨택 
        res.json(contactData);
    } catch (error) {

        console.log('에러 발생 컨트롤러');
        res.json(error);

    }


}


export default {
    test,
    modified_Contact
    
}