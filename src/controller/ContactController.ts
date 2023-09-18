import express, { Request, Response } from "express";
import { Contact, IReqEloqua, ContactForm, IUpdateContact } from "@src/models/ContactDTO";
import ContactService from "@src/services/ContactService"
import {convertCountry} from "@src/api/interface/interfaceApi"
import {AccountSingleResult} from "@src/api/Lg_Api"
import * as utils from "@src/util/etc_function";

import logger from 'jet-logger';

const test = async(req: Request, res: Response): Promise<any> =>{
    
    logger.info('contact 성공성공성공성공성공');
    console.log("12contact 성공성공성공성공성공");

    return res.json({
        message: "통신 성공"
    })
}


/*
* 전 날 C_DateModified 조회 Contact 기준
* KR => 국가 = KR && 사업자등록번호 != null
* Global => 국가 = Global 이면 TaxID != null
*/
const UID_Process = async(req: Request, res: Response): Promise<void> => {

    const RESULT:any[] = [];

    try {

        //1. 전 날 C_DateModified AND C_Country, 사업자등록번호, TaxID != NULL  code 조건: KR, Global
        const resdata = await ContactService.Get_ContactList("KR");
        const contactData = resdata.elements;

        //* 1000 건 이상 조회 될때 페이지 처리 해야함
        console.time("Contact KR IntegrationDB")
        logger.info(resdata.total);

        //2. UID 조회 (KR: 국가코드 + 사업자 등록번호, Global: 국가코드 + Tax ID)
        for(const data of contactData){

            const email = data.emailAddress;
            const companyName: string | undefined = data.hasOwnProperty('accountName') ? data.accountName : undefined ;
            const regNum: string | undefined = utils.matchFieldValues(data, '100398');
            const taxId: string | undefined = utils.matchFieldValues(data, '100420');
            //const duns_Number: string | undefined = utils.matchFieldValues(data, '100421');
            
            logger.info(`### email: ${email}, CompanyName: ${companyName}, regNum: ${regNum}, taxId: ${taxId} ###`);

            //2-1. UID 존재 여부 확인 및 UID 발급 요청, return updateContact 값
            const updateResult:IUpdateContact = await ContactService.Check_UID(convertCountry(data.country), companyName, regNum, taxId);
            logger.info(`### CheckUID ${JSON.stringify(updateResult)} END ###`);

            if(updateResult.uID != ''){
                logger.info(`### Contact Form INSERT UID : ${updateResult.uID} ###`);
                //3. Form Data Insert
                const formResult = await ContactService.Insert_Form(data, updateResult);
                RESULT.push(formResult);
                logger.info(`### ${formResult} ###`);
            }else{
                //reason => CompanyName: ${companyName} OR regNum: ${regNum}, taxId: ${taxId}
                RESULT.push(`${email}: form insert Pass`);
            }

        }
        console.timeEnd;("Contact KR IntegrationDB")
        res.json(RESULT);

    } catch (error) {
        logger.err('에러 발생 컨트롤러');
        logger.err('error', error);
        res.json(error);
    }


}


export default {
    test,
    UID_Process
    
}