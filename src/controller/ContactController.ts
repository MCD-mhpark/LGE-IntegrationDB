import express, { Request, Response } from "express";
import { Contact, IReqEloqua, ContactForm, IUpdateContact, SendContactData, CustomObjectData } from "@src/models/ContactDTO";
import ContactService from "@src/services/ContactService"
import {convertCountry} from "@src/api/interface/interfaceApi"
import * as utils from "@src/util/etc_function";
import logger from '../public/modules/jet-logger/lib/index';

/*
* 전 날 C_DateModified 조회 Contact 기준
* KR => 국가 = KR && 사업자등록번호 != null
* Global => 국가 = Global 이면 TaxID != null
*/
const UID_Process = async(time:string): Promise<void> => {

    //let time = req.body.time; //1차시기 //2차시기 
    logger.info(time);
    
    //const countryLogic = ["KR", "Global", "Pending"];
    const countryLogic = ["Global", "Pending"];
    const pageindex = 0;
    
    try {
        
        for(const logic of countryLogic){
            //0. 최초 1회 통신으로 totalData Count 가져옴
            logger.info(`##################### START ${logic} PROCESS #####################`);

            const totalData = await ContactService.Get_ContactList(logic, pageindex, time);
            const totalCount:number = totalData.total;
            const pageloopSize = Math.floor(totalCount / 1000) + 1
            logger.info(`totalCount : ${totalCount} pageloopSize : ${pageloopSize}`);
            
            if(totalCount == 0) continue; 
    
            console.time("Contact IntegrationDB");
            
            //* 1000 건 이상 조회 될때 페이지 처리 해야함
            for(let page:number = 1; page <= pageloopSize; page++){
                logger.info(`### ${page} ###`);
                const RESULT:any[] = [];

                //1. 전 날 C_DateModified AND C_Country, 사업자등록번호, TaxID != NULL  code 조건: KR, Global
                const resdata = await ContactService.Get_ContactList(logic, page, time);
                const contactData = resdata.elements;
                
                //2. UID 존재 여부 확인 및 UID 발급 요청 (KR: 국가코드 + 사업자 등록번호, Global: 국가코드 + Tax ID)
                for(const data of contactData){

                    const email = data.emailAddress;
                    const uid = utils.matchFieldValues(data, '100423') ? utils.matchFieldValues(data, '100423') : ""; 
                    const companyName = data.hasOwnProperty('accountName') ? data.accountName : undefined;
                    const companyCode = utils.matchFieldValues(data, '100458'); //Company Country Code
                    const regNum = utils.matchFieldValues(data, '100398');
                    const taxId = utils.matchFieldValues(data, '100420');
                    //const duns_Number: string | undefined = utils.matchFieldValues(data, '100421');
                    
                    logger.info(`email: ${email}, companyCode: ${companyCode}, uid: ${uid}, CompanyName: ${companyName}, regNum: ${regNum}, taxId: ${taxId}`);

                    const updateResult:IUpdateContact = await ContactService.Check_UID(companyCode, uid, companyName, regNum, taxId);
                    logger.info(`### CheckUID ${JSON.stringify(updateResult)} END ###`);

                    if(updateResult.uID !== '' && updateResult.uID !== undefined && updateResult.uID !== undefined){
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
        
        //res.json('success');

    } catch (error) {
        logger.err('### UID_Process Contact Controller Error ###');
        logger.err('error', error);
        //res.json(error);
    }


}


/*
* Custom Object Data => 통합 DB로 전송
* 1 UID: pending(VID)인 것들 Account UID 발급 여부 체크
* 2. 전날동안 쌓인 COD 전송 후, 전송여부 Y로 체크
*/
const Send_Contact = async ():Promise<void> => {
    
    try {
        let page: number = 1;
        let nextSearch: boolean = true;           

        // 최종: 통합 DB로 COD 데이터 전송
        logger.info(`##################### START SEND CONTACT DATA #####################`)
        
        //1000건 넘을경우 pageing 처리
        while(nextSearch){
            logger.info(page);
        
            //1.통합 DB 전송 Custom Object Data 조회
            const resdata = await ContactService.Get_COD(page);
            //1-1. element == 0 이면 While 문 break;
            if( !resdata.elements || resdata.elements.length == 0 ) { 
                logger.info(`408번 customobject send contact data : ${resdata.total}`)
                nextSearch = false; 
                break; 
            };
            
            logger.info(`page = ${page} totalCount = ${resdata.total}`);

            //2. 형식 변환 후 Data 전송
            const customOjbectData:CustomObjectData[] = resdata.elements; 

            let RESTULT = await ContactService.Contact_Send(customOjbectData);

            logger.warn(RESTULT);

            // {
                //     "sendCreateData": "{\"Status\":\"Success\",\"Contact\":[{\"LGCompanyDivision\":\"EKHQ\",\"SourceSystemDivision\":\"Eloqua\",\"SourceSystemKey1\":\"164455\",
                //\"Email\":\"test@test.pl\",\"ContactUID\":\"UC00002166\",\"AccountUID\":\"KR00302600\"},{\"LGCompanyDivision\":\"EKHQ\",\"SourceSystemDivision\":\"Eloqua\",
                //\"SourceSystemKey1\":\"170930\",\"Email\":\"test@cns.com\",\"ContactUID\":\"UC00002164\",\"AccountUID\":\"KR01650700\"}]}",
                //     "sendUpdateData": {}
                //   }
                
            logger.info(`page = ${page} Eloqua Field Update Logic Start`);

            //3. COD 전송 여부 필드 = "Y" AND Contact UID 필드 Update
            //3-1. sendCreateData 결과 처리 
            if(Object.entries(RESTULT.sendCreateData).length !== 0 && RESTULT.sendCreateDat !== 'fail'){
                let createData = JSON.parse(RESTULT.sendCreateData);
                for(const data of createData.Contact){
                    let uidresult = await ContactService.Update_ContactUID(data.SourceSystemKey1, data.Email, data.ContactUID);
                    logger.info(`### createstatus = ${uidresult} SourceSystemKey1 = ${data.SourceSystemKey1}, Email = ${data.Email}, ContactUID = ${data.ContactUID} ###`);
                }
            }

            //3-2. sendUpdateData 결과 처리 
            if(Object.entries(RESTULT.sendCreateData).length !== 0){
                let updateData = JSON.parse(RESTULT.sendUpdateData);
                for(const data of updateData.Contact){
                    if(data.updateResult == 'SUCCESS'){
                        let uidresult = await ContactService.Update_ContactUID(data.SourceSystemKey1, data.Email, data.UID);
                        logger.info(`### updatestatus = ${uidresult} SourceSystemKey1 = ${data.SourceSystemKey1}, Email = ${data.Email}, ContactUID = ${data.ContactUID} ###`);
                    }else{
                        let uidresult = await ContactService.Update_ContactUID(data.SourceSystemKey1, data.Email, data.UID, data.updateResultMessage);
                        logger.info(`### updateFailstatus = ${uidresult} SourceSystemKey1 = ${data.SourceSystemKey1}, Email = ${data.Email}, ContactUID = ${data.ContactUID} updateResultMessage = ${data.updateResultMessage}###`);
                    }
                }

            }
            logger.info(`page = ${page} Eloqua Field Update Logic END`);

            page++;
        }
        
        //res.json('success');

    }catch(error){
        logger.err('### Send_Contact Controller Error ###');
        logger.err('error', error);

        //res.json(error);
    }
    
}

/*
* COD 30일 지난 데이터 삭제 로직
*/


// const test = async(req: Request, res: Response): Promise<any> =>{
//     logger.info('contact 성공성공성공성공성공');
//     return res.json({
//         message: "통신 성공"
//     })
// }


export default {
    //test,
    UID_Process,
    Send_Contact
    
}