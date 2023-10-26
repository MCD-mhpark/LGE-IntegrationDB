import express, { Request, Response } from "express";
import { Contact, IReqEloqua, ContactForm, IUpdateContact, IContact, SendContactData, CustomObjectData } from "@src/models/ContactDTO";
import ContactService from "@src/services/ContactService"
import {convertCountry} from "@src/api/interface/interfaceApi"
import * as utils from "@src/util/etc_function";
import logger from '../public/modules/jet-logger/lib/index';
import { rejects } from 'assert';
import { resolve } from 'path';

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
            logger.info(`##################### START ${logic} PROCESS #####################`);
            
            //0. 최초 1회 통신으로 totalData Count 가져옴
            const totalData = await ContactService.Get_ContactList(logic, time, pageindex);

            const totalCount:number = totalData.total;
            const pageloopSize = Math.floor(totalCount / 1000) + 1

            logger.info(`totalCount : ${totalCount} pageloopSize : ${pageloopSize}`);
            
            //조회 건수가 없을때 for문 종료
            if(totalCount == 0) continue; 
    
            console.time("Contact IntegrationDB");
            
            //* 1000 건 이상 조회 될때 페이지 처리 해야함
            for(let page:number = 1; page <= pageloopSize; page++){

                logger.warn(`### START Page: ${page} ###`);

                //Push CompanyID
                const companyId:any[] = [];

                //최종 전송 결과를 담기 위한 배열
                const successRESULT:any[] = [];
                const failRESULT:any[] = [];

                //Promise 병렬처리를 담기 위한 배열
                const promistRESULT:any[] = [];

                //1. 전 날 C_DateModified AND C_Country, 사업자등록번호, TaxID != NULL  code 조건: KR, Global
                const resdata = await ContactService.Get_ContactList(logic, time);
                const contactData = resdata.elements;

                contactData.map((item: IContact) => {
                    if(logic == 'KR') companyId.push(utils.matchFieldValues(item, '100398')); 
                    if(logic == 'Global') companyId.push(utils.matchFieldValues(item, '100437'));
                });
                
                for(const [index, data] of contactData.entries()){

                    let firstIdx = companyId.indexOf(utils.matchFieldValues(data, '100437')); // 조회 된 CompanyId 중 가장 먼저 나오는 index
                    
                    // console.log(utils.matchFieldValues(data, '100437'));
                    // console.log('firstIdx', firstIdx);
                    // console.log('실제i', index);

                    //병렬 처리시 동일한 회사의, UID 중복 요청으로 인한 오류를 피하기 위해 1초 대기
                    if(index > firstIdx) {
                        //logger.info('중복 요청으로 인한 오류를 피하기 위해 0.3초 대기');
                        await utils.delay(300);
                    }; 
                    
                    function promise (data:IContact) {
                        return new Promise<IUpdateContact>(async(resolve, reject) => {

                            //2. UID 존재 여부 확인 및 UID 발급 요청 (KR: 국가코드 + 사업자 등록번호, Global: 국가코드 + Tax ID)
                            const updateResult:IUpdateContact = await ContactService.Check_UID(data);
                            logger.info(`### @1번@ CheckUID ${JSON.stringify(updateResult)} END ###`);

                            if(updateResult.uID !== '' && updateResult.uID !== undefined){
                                //정상 발급 OR pending(UID)
                                logger.info(`### @2번@ UID 정상 발급 : ${updateResult.uID} ###`);
                                resolve(updateResult);
                            }else{
                                //UID 발급 조건 충족 X 또는 발급 과정에서 ERROR.
                                logger.info(`### @2번@ UID 발급 조건에서 PASS : ${updateResult.uID} ###`);
                                logger.info(`${updateResult.email}: form insert Pass reasonInfo => CompanyName: ${updateResult.company} regNum: ${updateResult.regName}, taxId: ${updateResult.taxId}`);
                                reject(`${data.emailAddress} UID 발급 fail`);
                            }
                        })
                    }; 
                    

                    function formResult (updateResult: IUpdateContact) {
                        return new Promise<string>(async(resolve, reject) => {
                            
                            //UID 정상 발급에 대한 Contact Form Insert
                            //logger.info(`### @3번@ Contact Form INSERT ###`);
                            const insertForm = await ContactService.Insert_Form(data, updateResult);

                            if(insertForm == 'success'){
                               resolve(`${updateResult.email} insert success`);
                            }else{
                                reject(`${updateResult.email} insert fail`)
                            }

                        });
                    };
                    
                    const promiseFunc = promise(data)
                        .then(formResult)
                        .catch((error) => {
                            logger.err(error);
                        });
                    promistRESULT.push(promiseFunc);

                };

                let resData = await Promise.allSettled(promistRESULT);
                resData.forEach((result, index) => {
                    if(result.status == 'fulfilled'){
                        successRESULT.push(result.value)
                    }
                    if (result.status == 'rejected') {
                        logger.err(`Promise_allSettled at ${index} rejected with reason: ${JSON.stringify(result, null, 2)}`);
                        failRESULT.push(JSON.stringify(result, null, 2));
                    }
                });

                logger.info(successRESULT);
                logger.warn(failRESULT);

                logger.warn(`### END Page: ${page} ###`);
            }

            console.timeEnd("Contact IntegrationDB");
            logger.info(`##################### END ${logic} PROCESS #####################`);
        }
        
        //res.json('success');

    } catch (error) {
        logger.err('### UID_Process Contact Controller Error ###');
        logger.err(error);
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
        // 등록 및 수정 API 로직 Contact 갯수 
        const batchSize = 10;

        let page: number = 1;
        let nextSearch: boolean = true;
        
        // 최종: 통합 DB로 COD 데이터 전송
        logger.warn(`##################### START SEND CONTACT DATA #####################`)
        
        //1000건 넘을경우 pageing 처리
        while(nextSearch){
            logger.warn(`현재 page: ${page}`);
            
            //1.통합 DB 전송 Custom Object Data 조회
            const resdata = await ContactService.Get_COD(page);
            const customOjbectData:CustomObjectData[] = resdata.elements; 

            //1-1. element == 0 이면 While 문 break;
            if( !customOjbectData || customOjbectData.length == 0 ) { 
                logger.warn(`408번 customobject send contact data 최종 로직 종료`)
                nextSearch = false; 
                break; 
            };
            
            logger.info(`page = ${page} totalCount = ${resdata.total}`);

            //2. batchSize 만큼 잘라서 Send 로직 
            for(let i = 0; i < customOjbectData.length; i += batchSize){
                logger.info(`'i', ${i}`); //logger.info(`'i+batchsize', ${i + batchSize}`);
                
                let batchData = customOjbectData.slice(i, i + batchSize);
                let RESULT = await ContactService.Contact_Send(batchData);
                logger.warn(RESULT); 

                //2-1 전송 이후 Eloqua Data 처리하는 부분(비동기)
                ContactService.Update_EloquaData(RESULT);
            }

            logger.warn(`현재 page = ${page} Eloqua Field Update Logic END, 다음 page 실행`);
            
            //다음 데이터 조회를 위해 page += 1;
            page++;
        }
        
        // if(req.body.search)
        //     res.json('success');
        

    }catch(error){
        logger.err('### Send_Contact Controller Error ###');
        logger.err(error.message);

        // if(req.body.search)
        //     res.json({error: error, "error.message" : error.message});
    }
    
}

/*
* COD 30일 지난 데이터 삭제 로직(추 후 필요한 기능여부)
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