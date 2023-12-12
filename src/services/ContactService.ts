import { lge_eloqua, lgeSdk_eloqua } from '@src/routes/Auth';
import { Contact, IReqEloqua, ContactForm, IUpdateContact, IContact, SendContactData, CustomObjectData } from "@src/models/ContactDTO";
import { AccountForm } from "@src/models/AccountDTO"
import * as LgApi from "@src/api/Lg_Api"
import {IAccountRegisterReq, ICompanyData, IAccountRegisterRes} from "@src/api/interface/interfaceApi"
import * as utils from "@src/util/etc_function";
import logger from '../public/modules/jet-logger/lib/index';

//Contact 조건에 맞게 Search List
const Get_ContactList = async(code:string, time: string, pageindex?:number): Promise<any> => {
    
    let queryString: IReqEloqua = { search: '', depth:''};
    let timeQuery: string = '';
    let ptimeQuery: string = '';

    //처음 조회는 totalCount를 가져오기 위해 depth minimal로 하여 Search 속도 향상
    if(pageindex == 0){
        queryString.page = 1; queryString.depth = "minimal";
    }else{
        queryString.depth = "complete"
    }

    if(time == "1차시기"){timeQuery = `C_DateModified>='${utils.yesterday_getDateTime()} 00:00:00'C_DateModified<'${utils.yesterday_getDateTime()} 15:00:00'`};
    if(time == "2차시기"){timeQuery = `C_DateModified>'${utils.yesterday_getDateTime()} 16:00:00'C_DateModified<='${utils.yesterday_getDateTime()} 23:59:59'`};
    
    if(time == "수동업로드"){timeQuery = `email="alababidi@compuset.com"`};
    //if(time == "수동업로드"){timeQuery = `C_Common_Field__41="통합DBTEST"`};

    if(code == "KR"){
        //C_Company_Country_Code1 = South Korea && 사업자 등록번호
        let krQuery = `C_Company_Country_Code1="KR"C_KR_Business_Registration_Number1!=""C_LastName!=""C_Common_Field__51!="통합DB제외"`
        queryString.search = timeQuery + krQuery;
        //test
        //queryString.search = `C_Company_Country_Code1="KR"C_KR_Business_Registration_Number1!=""emailAddress=test*`

    }else if(code == "Global"){
        //C_Country != NULL && South Korea && TaxID != NULL
        let globalQuery = `C_Company_Country_Code1!="KR"C_Company_Country_Code1!=""C_LastName!=""C_Common_Field__51!="통합DB제외"C_DUNS_Number1>0`
        //let ktglobalQuery = `C_Company_Country_Code1!="KR"C_Company_Country_Code1!=""C_Tax_ID1!=""C_LastName!=""`
        queryString.search = timeQuery + globalQuery;

    }else if(code == "Pending"){
        if(time == "1차시기")ptimeQuery = `C_DateModified>='${utils.yesterday_getDateTime()} 15:00:00'C_DateModified<'${utils.yesterday_getDateTime()} 15:30:00'`;
        if(time == "2차시기")ptimeQuery = `C_DateModified>='${utils.yesterday_getDateTime()} 15:30:00'C_DateModified<='${utils.yesterday_getDateTime()} 16:00:00'`;
        let pendingQuery = `C_Account_UID1="pending*"`
        queryString.search = ptimeQuery + pendingQuery;
    }
    
    //console.log(queryString);
    
    return await lge_eloqua.contacts.getAll(queryString).then((result: any) => {
        return result
    }).catch((err: any) => {
        logger.err('### Get_ContactList ERROR 발생 ###');
        throw err
    });
    
}

//UID 발급 프로세스
const Check_UID = async(data:IContact): Promise<any> => {

    
    const email = data.emailAddress;
    const p_DUID = utils.matchFieldValues(data, '100423') ? utils.matchFieldValues(data, '100423') : ""; 
    const p_CountryCode = utils.matchFieldValues(data, '100458'); //Company Country Code
    const p_CompanyName = data.hasOwnProperty('accountName') ? data.accountName : "";
    const p_RegNum = utils.matchFieldValues(data, '100398');
    const p_DunsNum = Math.floor(utils.matchFieldValues(data, '100435')).toString();;
    
    //logger.info(`email: ${email}, companyCode: ${p_CountryCode}, uid: ${p_uid}, CompanyName: ${p_CompanyName}, regNum: ${p_RegNum}, DunsNum: ${p_DunsNum}`);
    
    // **Check_UID의 Return 변수.
    let uResult: {email:string, DUID: string, company: string, regName?:string, DunsNum?:string } 
        = { email, "DUID": p_DUID, "company": p_CompanyName, "DunsNum": p_DunsNum, "regName": p_RegNum };

    // UID 발급을 위한 변수.
    let reqUID: IAccountRegisterReq = {
        Account: [
            {
                LGCompanyDivision :"EKHQ", //그룹사코드
                SourceSystemDivision:"Eloqua",
                SourceSystemKey1 : "eloquaAccount" ,
                Country: p_CountryCode ,
                AccountName: p_CompanyName,
                CompanyRegistrationNumber: p_RegNum ? p_RegNum.replace(/[\s-]/g, "") : "",
                DunsNumber : p_DunsNum,
            }
        ]
    };

    // 발급 신청 후 SingleResultAPI UID 조회를 위한 변수. 
    let issueUID: ICompanyData = {
        LGCompanyDivision: "EKHQ",
        countryCode: p_CountryCode,
        bizRegNo: p_RegNum ? p_RegNum.replace(/[\s-]/g, "") : "",
        dunsNo: p_DunsNum
    }

    /**
     * Check_UID PROCESS
     **/
    try {
        
        let queryString: IReqEloqua = { search: '', depth:'complete' };
        if(p_CountryCode == 'KR'){
            queryString.search = `M_Company_Country_Code1='${p_CountryCode}'M_Business_Registration_Number1='${p_RegNum}'`
        }else{
            if(p_DunsNum){
                queryString.search = `M_Company_Country_Code1='${p_CountryCode}'M_DUNS_Number1='${p_DunsNum}'`
            }        
        }

        //1. UID 존재 여부 확인
        const eloquaAccount = await lge_eloqua.accounts.getAll(queryString);

        //2. 있을 경우 Eloqua Account Table UID Return.
        if(eloquaAccount.elements.length !== 0){
            logger.info(`### email: ${email}(${p_DunsNum}) Eloqua DUID 존재 => ${p_CountryCode}, ${p_CompanyName} ###`);
            uResult.DUID = utils.matchFieldValues(eloquaAccount.elements[0], '100424'); //100424: Account Fields ID
            uResult.company =  eloquaAccount.elements[0].name;
            
        // 2. 없을 경우 발급요청(companyName != null) 후 5초 대기 (단, Account UID가 pending* 인 것은 요청 하지 않음)
        }else if (eloquaAccount.elements.length == 0 && p_CompanyName !== undefined && !p_DUID.startsWith('pending')){

            logger.warn(`### email: ${email} UID 발급 요청=> ${p_CountryCode}, ${p_CompanyName}, BizNo: ${p_RegNum} , DunsNum: ${p_DunsNum} ###`);
            //console.log(reqUID);

            //2-1. UID 발급 API 
            await LgApi.AccountRegisterAPI(reqUID).then(async (value: IAccountRegisterRes) => {

                logger.info(`### 5초 대기 => ${JSON.stringify(value.result)} ###`);
                // 2-1-1. 5초 발급 대기
                await utils.delay(5000);
                // 2-1-2. 발급 받은 UID 및 CompanyName 확인
                const issueUIDResult = await LgApi.AccountSingleResultAPI(issueUID);

                //2-2. 발급이 된 UID Return
                if(issueUIDResult.Account.length !== 0){
                    //logger.info(`### issueUIDResult 발급결과 => ${JSON.stringify(issueUIDResult)} ###`);                    
                    uResult.DUID = issueUIDResult.Account[0].DUID;
                    uResult.company = issueUIDResult.Account[0].Name;

                    /*
                    * Account Insert 로직이 필요함 중복 요청을 안하기 위해서 폼프로세싱 처리.
                    */
                    const AccountFormId = 8930;
                    let account = {
                        DUID: uResult.DUID,
                        CountryCode: p_CountryCode,
                        BizNo: p_RegNum,
                        TaxId: "",
                        CompName: uResult.company,
                        DUNSNo: p_DunsNum
                    }
                    let convertFormData = new AccountForm(account);

                    await lge_eloqua.contacts.form_Create(AccountFormId, convertFormData);
                    logger.info(`### ${p_DunsNum} => DUID 폼프로세싱 처리 완료 ###`)

                }else {

                    //3-1. 발급 요청한 Company가 조회 되지 않을 경우
                    logger.warn(`
                    ***CHECKPOINT!***
                    pending =>  ${p_CountryCode}, ${p_CompanyName}, ${p_DunsNum}, ${p_RegNum} 
                    pending AccountRegister result => ${JSON.stringify(value.result)} `);
                    /*
                    * 추 후 발급 결과 조회 API 로그가 필요함 
                    */
                    uResult.company = p_CompanyName;
                    uResult.DUID = `pending(${JSON.parse(value.result).Account[0].VID})`;
                }
        
            }).catch(error => {
                throw error;
            });

        }
        
        return uResult;

    } catch (error) {
        logger.err(`### Check_UID logic Error : ${p_CountryCode}, ${p_CompanyName}, DunsNum: ${p_DunsNum}, BizNo: ${p_RegNum} ###`);
        logger.err(error.message);
        logger.err(error.stack);
        return `Check_UID logic Error`;
    }
}

//Contact Data Form 조건에 맞게 Insert
const Insert_Form = async (contact:Contact, updateContact:IUpdateContact): Promise<any> => {
    const id:number = 8888;
    const convertFormData = new ContactForm(contact, updateContact);
    //console.log(convertFormData);

    return await lge_eloqua.contacts.form_Create(id, convertFormData).then((result: any) => {
        //console.log(result);
        return `success`
    }).catch((error: any) => {
        logger.err(`### ${contact.emailAddress}: Insert_Form Error`);
        logger.err(error);
        return `fail`
    });
    
}


const Get_COD = async (type:string, pageindex?: number) => {

    //통합DB_History Custom Object
    const id:number = 408;
    let queryString: IReqEloqua = { search: '', page: pageindex ,depth:'complete' };

    // ____11 : 전송완료여부 필드
    if(type == "send"){
        queryString.search = `createdAt>='${utils.getToday()} 00:00:00'createdAt<='${utils.getToday()} 23:59:59'____11=""`
        //queryString.search = '____11=""'
    }
    if(type == "error"){
        queryString.search = `______11="Failed to Execute : Record does not exist"`
    }

    return await lge_eloqua.contacts.cod_Get(id, queryString).then((result: any) => {
        return result
    }).catch((error: any) => {
        logger.err('### Get_COD ERROR ###');
        throw error
    });

}

//Data 형식 Convert 후 통합 DB 데이터 전송
const Contact_Send =  async (customOjbectData: any) => {

    try {
        
        let returnResult = {"sendCreateData" : {}, "sendUpdateData": {}}
        let sendCreateData: { Contact: SendContactData[] } = { Contact: [] };
        let sendUpdateData: { Contact: SendContactData[] } = { Contact: [] };
        
        // 1. contact 등록 API에 맞게 Data 형식 covert
        for(const data of customOjbectData){

            let convertdata = new SendContactData(data);

            if(utils.matchFieldValues(data, "3280") !== ""){
                //UPDATE Array push
                sendUpdateData.Contact.push(convertdata);
            }else{
                //CREATE Array push
                sendCreateData.Contact.push(convertdata);
            }
        }
    
        logger.info(`sendCreateData.Contact.length , ${sendCreateData.Contact.length}`);
        logger.info(`sendUpdateData.Contact.length , ${sendUpdateData.Contact.length}`);

        // 2. 통합 DB 컨택 등록 요청 Process
        if (sendCreateData.Contact.length !== 0) {
            let createApiResult = await LgApi.ContactRegisterAPI(sendCreateData);
            //console.log('createApiResult', createApiResult);
            if(createApiResult.result == "ERROR"){
                logger.err(`################ INSERT INTERGRATION DB ERROR ################`);
                logger.err(createApiResult); logger.err(sendCreateData);
                returnResult.sendCreateData = "fail"
            }else{            
                returnResult.sendCreateData = createApiResult.result;
            }
        }

        // 3. 통합 DB 컨택 업데이트 요청 Process
        if (sendUpdateData.Contact.length !== 0) {
            let updateApiResult = await LgApi.ContactUpdateAPI(sendUpdateData);
            //console.log('updateApiResult', updateApiResult);
            if(JSON.parse(updateApiResult.result).Contact.length == 0){
                logger.warn(`### Update INTERGRATION DB Legth == 0 ###`);
                logger.warn(updateApiResult); logger.warn(sendUpdateData);
            }else{
                returnResult.sendUpdateData = updateApiResult.result;
            }
        } 

        //등록요청하거나 수정요청 한 Contact 이 없을경우 { "sendCreateData": {} , "sendUpdateData": {} }
        //logger.info(`returnResult: ${JSON.stringify(returnResult)}`);
        return returnResult
        
    } catch(error){
        logger.err('### Contact_Send Service ERROR ###');
        logger.err(error.message); logger.err(error.stack);
        return error
    }
}


const Update_EloquaData = async (RESULT:any) => {

    //***Update_ContactUID 함수에 대해서는 비동기 처리.

    try{
        //sendCreateData 결과 처리
        if(Object.entries(RESULT.sendCreateData).length !== 0 && RESULT.sendCreateData !== 'fail'){
            let createData = JSON.parse(RESULT.sendCreateData);
            for(const data of createData.Contact){
               UpdateData(data.SourceSystemKey1, data.Email, data.ContactUID);
            }
        }
    
        //sendUpdateData 결과 처리 
        if(Object.entries(RESULT.sendUpdateData).length !== 0){
            let updateData = JSON.parse(RESULT.sendUpdateData);
            for(const data of updateData.Contact){
                if(data.updateResult == 'SUCCESS'){
                    UpdateData(data.SourceSystemKey1, data.Email, data.UID);
                }else{
                    UpdateData(data.SourceSystemKey1, data.Email, data.UID, data.updateResultMessage);
                }
            }  
        }

    }
    catch(error){
        logger.err('### Update_EloquaData Service ERROR ###');
        logger.err(error.message); logger.err(error.stack);
        logger.err(`### status = error ${JSON.stringify(RESULT)}`);
    }
};

async function UpdateData (sourceSystemKey1:string, Email:string ,ContactUID:string, updateResultMessage? : string) {

    try{
        const [contactId, CustomObjectId] = sourceSystemKey1.split('-');
        let updateContactData = {
            id: contactId,
            emailAddress: Email,
            fieldValues: [
                        {
                            "id": "100460",
                            "value": ContactUID
                        }
                    ]
        }

        let updateCOData = {
            fieldValues: [
                        //Contact UID
                        {
                            "id": "3280",
                            "value": ContactUID
                        },
                        //통합DB 전송 여부
                        {
                            "id": "3181",
                            "value": "Y" 
                        },
                        //임시필드 1
                        {
                            "id": "3162",
                            "value": updateResultMessage
                        }
                    ]
            }

        // Contact UID 필드 업데이트 
        lge_eloqua.contacts.update(contactId, updateContactData);
        //console.log(contactFieldUpdate);
        
        // Custom Object Data 필드 업데이트
        lge_eloqua.contacts.cod_Update(408, CustomObjectId, updateCOData);
        //console.log(CustomObjectFieldUpdate);

        if(updateResultMessage){
            //updateResultMessage => 정상적으로 update가 되지 않을때 API의 Return 메세지 내용.
            logger.warn(`status = Data Update success Email = ${Email}, ContactUID = ${ContactUID}, updateResultMessage? = ${updateResultMessage} `)
        }else{
            logger.info(`status = Data Update success Email = ${Email}, ContactUID = ${ContactUID}`)
        }

    }catch(error){
        logger.err('### Update_ContactUID Function ERROR ###');
        logger.err(error.message);
        logger.err(`### status = error Email = ${Email}, ContactUID = ${ContactUID} ###`)
    }

}


//COD의 UID가 VID거나 NULL 값인 Data Eloqua Account 테이블 체크
// const pre_check = async (vidCheckData: any) => {
    
//     //1. COD Country Code FieldValues:2939 확인
//     let c_countryCode = utils.matchFieldValues(vidCheckData, '2939');
//     let bizRegNo = utils.matchFieldValues(vidCheckData, '2938'); //사업자등록번호 2938
//     let tax_ID = utils.matchFieldValues(vidCheckData, '2940'); //Tax ID 2940

//     let searchAccountReturn

//     console.log(c_countryCode);
    
//     //2. 발급 UID 확인
//     if(c_countryCode = "KR"){
//         //KR CASE 
//         searchAccountReturn = await AccountService.searchAccount(c_countryCode, bizRegNo);
//     }else{
//         //Global CASE
//         searchAccountReturn = await AccountService.searchAccount(c_countryCode, tax_ID);
//     }
//     logger.info(searchAccountReturn);


//     //3. 통합DB_History Custom Object 및 Contact 업데이트
//     if(searchAccountReturn.result == "success"){
//         //폼프로세싱으로 하면 편할듯? 가능한지는 봐야함
//     }


// }


export default {
    Get_ContactList,
    Check_UID,
    Insert_Form,
    Get_COD,
    Contact_Send,
    Update_EloquaData
}

