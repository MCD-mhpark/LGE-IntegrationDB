import express, { Request, Response } from "express";
import { Contact, IReqEloqua, ContactForm, IUpdateContact } from "@src/models/ContactDTO";
import ContactService from "@src/services/ContactService"
import {convertCountry} from "@src/api/interface/interfaceApi"
import * as utils from "@src/util/etc_function";
import logger from '../public/modules/jet-logger/lib/index';

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

    const countryLogic = ["KR", "Global"];
    const pageindex = 0;
    
    try {
        
        for(const logic of countryLogic){
            const totalData = await ContactService.Get_ContactList(logic, pageindex);
            console.time("Contact IntegrationDB");
            logger.info(`##################### START ${logic} PROCESS #####################`)
            
            const totalCount:number = totalData.total;
            const pageloopSize = Math.floor(totalCount / 1000) + 1
            logger.info(`totalCount : ${totalCount} pageloopSize : ${pageloopSize}`);
            
            //* 1000 건 이상 조회 될때 페이지 처리 해야함
            for(let page:number = 1; page <= pageloopSize; page++){
                logger.info(`### ${page} ###`);
                const RESULT:any[] = [];

                //1. 전 날 C_DateModified AND C_Country, 사업자등록번호, TaxID != NULL  code 조건: KR, Global
                const resdata = await ContactService.Get_ContactList(logic, page);
                const contactData = resdata.elements;
                
                //2. UID 조회 (KR: 국가코드 + 사업자 등록번호, Global: 국가코드 + Tax ID)
                for(const data of contactData){

                    const email = data.emailAddress;
                    const companyName = data.hasOwnProperty('accountName') ? data.accountName : undefined ;
                    const regNum = utils.matchFieldValues(data, '100398');
                    const taxId = utils.matchFieldValues(data, '100420');
                    //const duns_Number: string | undefined = utils.matchFieldValues(data, '100421');
                    
                    logger.info(`### email: ${email}, CompanyName: ${companyName}, regNum: ${regNum}, taxId: ${taxId} ###`);

                    //2-1. UID 존재 여부 확인 및 UID 발급 요청, return updateContact 값
                    const updateResult:IUpdateContact = await ContactService.Check_UID(convertCountry(data.country), companyName, regNum, taxId);
                    logger.info(`### CheckUID ${JSON.stringify(updateResult)} END ###`);

                    if(updateResult.uID != '' && updateResult.uID != undefined){
                        logger.info(`### Contact Form INSERT UID : ${updateResult.uID} ###`);
                        //3. Form Data Insert
                        const formResult = await ContactService.Insert_Form(data, updateResult);
                        RESULT.push(formResult);
                        logger.info(`### ${formResult} ###`);
                    }else{
                        RESULT.push(`${email}: form insert Pass reasonInfo => CompanyName: ${companyName} OR regNum: ${regNum}, taxId: ${taxId}`);
                    }

                }

                logger.info(RESULT);
            }

            console.timeEnd("Contact IntegrationDB");
        }
        
        res.json('success');

    } catch (error) {
        logger.err('### UID_Process Contact Controller Error ###');
        logger.err('error', error);
        res.json(error);
    }


}

const Send_Contact = async (req:Request, res: Response):Promise<void> => {

    let page: number = 1;
    let nextSearch: boolean = true;
    try {    
        while(nextSearch){
            logger.info(page);
            
            //1. yesterDay Custom Object Data
            const resdata = await ContactService.Get_COD(page);
            
            
            
            //2. covert API 

            page++;
            
            if( !resdata.elements || resdata.elements.length == 0 ) { 
                logger.info(`408번 customobject send contact data : ${resdata.total} `)
                nextSearch = false; 
                break; 
            };

            res.json(resdata);
        }


    }catch(error){

    }
    
}


export default {
    test,
    UID_Process,
    Send_Contact,
    
}