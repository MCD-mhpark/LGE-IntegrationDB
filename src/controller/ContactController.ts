import express, { Request, Response } from "express";
import { Contact, IReqEloqua } from "@src/models/ContactDTO";
import ContactService from "@src/services/ContactService"
import {convertCountry} from "@src/api/interface/interfaceApi"
import {AccountSingleResult} from "@src/api/Lg_Api"
import * as utils from "@src/util/etc_function";

import logger from 'jet-logger';

// logger.settings.filepath = './logs/contact/jet-logger.log'

const test = async(req: Request, res: Response): Promise<any> =>{
    console.log(process.env.JET_LOGGER_FILEPATH);
    
    logger.info('contact 성공성공성공성공성공');
    console.log("12contact 성공성공성공성공성공");
    console.log("12contact 성공성공성공성공성공");

    //res.header("Access-Control-Allow-Origin", "https://b2bmkt.lge.com");
    // res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    return res.json({
        message: "통신 성공"
    })
}


/*
* 전 날 C_DateModified 조회 Contact 기준
* KR => 국가 = KR && 사업자등록번호 != null
* Global => 국가 = Global 이면 TaxID != null
*/
const modified_Contact = async(req: Request, res: Response): Promise<void> => {
    
    try {
        
        //1. 전 날 C_DateModified AND C_Country, 사업자등록번호, TaxID != NULL  code 조건: KR, Global
        const resdata = await ContactService.Get_ContactList("KR");
        const contactData: Contact[] = resdata.elements;

        //* 1000 건 이상 조회 될때 페이지 처리 해야함
        console.time("Contact KR IntegrationDB")
        logger.info(resdata.total);
        

        //2. UID 조회 (KR: 국가코드 + 사업자 등록번호, Global: 국가코드 + Tax ID)
        for(const data of contactData){

            console.log('asdfasdfasdf', );
            
            const email = data.emailAddress;
            const companyName: string | undefined = data.hasOwnProperty('accountName') ? data.accountName : undefined ;
            const regNum: string | undefined = utils.matchFieldValues(data, '100398');
            const taxId: string | undefined = utils.matchFieldValues(data, '100420');
            //const duns_Number: string | undefined = utils.matchFieldValues(data, '100421');
            
            logger.info(`### email: ${email}, CompanyName: ${companyName}, regNum: ${regNum}, taxId: ${taxId}  ###`);
            //UID 존재 여부 확인 및 UID 발급 요청, return UID 값
            logger.info(`### CheckUID START ###`);
            const UID = await ContactService.Check_UID(convertCountry(data.country), companyName, regNum, taxId);
            console.log(UID);

            //convert contact data


            //Contact Data Form Insert

        }

        console.timeEnd;("Contact KR IntegrationDB")

        //const sendContactData = await ContactService.Insert_Form();
        
        // 최종적으로 통합 DB에 전달 하는 controller 
        //modidfed 된 컨택 
        res.json(contactData);
    } catch (error) {
        console.log('error', error);
        console.log('에러 발생 컨트롤러');
        res.json(error);

    }


}


export default {
    test,
    modified_Contact
    
}