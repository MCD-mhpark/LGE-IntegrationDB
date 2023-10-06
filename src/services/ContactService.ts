import { lge_eloqua, lgeSdk_eloqua } from '@src/routes/Auth';
import { Contact, IReqEloqua, ContactForm, IUpdateContact, SendContactData, CustomObjectData } from "@src/models/ContactDTO";
import * as LgApi from "@src/api/Lg_Api"
import {IreqAccountRegister, ICompanyData, IresAccountRegister} from "@src/api/interface/interfaceApi"
import * as utils from "@src/util/etc_function";
import logger from '../public/modules/jet-logger/lib/index';

//Contact 조건에 맞게 Search List
const Get_ContactList = async(code:string, pageindex:number, time: string): Promise<any> => {
    
    let queryString: IReqEloqua = { search: '', page: undefined , depth:''};

    let timeQuery: string = '';

    //처음 조회는 totalCount를 가져오기 위해 depth minimal로 하여 Search 속도 향상
    if(pageindex == 0){
        queryString.page = 1; queryString.depth = "minimal";
    }else{
        queryString.page = pageindex; queryString.depth = "complete"
    }

    if(time == "1차시기"){timeQuery = `C_DateModified>='${utils.yesterday_getDateTime()} 00:00:00'C_DateModified<'${utils.yesterday_getDateTime()} 15:00:00'`};
    if(time == "2차시기"){timeQuery = `C_DateModified>'${utils.yesterday_getDateTime()} 16:00:00'C_DateModified<='${utils.yesterday_getDateTime()} 23:59:59'`};
    
    if(time == "수동업로드"){timeQuery = `C_DateModified>'2023-10-06 16:00:00'C_DateModified<='2023-10-06 23:59:59'`};

    if(code == "KR"){
        //C_Company_Country_Code1 = South Korea && 사업자 등록번호
        let krQuery = `C_Company_Country_Code1="KR"C_KR_Business_Registration_Number1!=""C_Common_Field__51!="통합DB제외"`
        queryString.search = timeQuery + krQuery;
        //test
        //queryString.search = `C_Company_Country_Code1="KR"C_KR_Business_Registration_Number1!=""emailAddress=test*`
    }else if(code == "Global"){
        //C_Country != NULL && South Korea && TaxID != NULL
        let globalQuery = `C_Company_Country_Code1!="KR"C_Company_Country_Code1!=""C_Tax_ID1!=""C_Common_Field__51!="통합DB제외"`
        queryString.search = timeQuery + globalQuery
    }else if(code == "Pending"){
        queryString.search = `C_DateModified>='${utils.yesterday_getDateTime()} 00:00:00'C_DateModified<='${utils.yesterday_getDateTime()} 23:59:59'C_Account_UID1="pending*"`
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
const Check_UID = async(p_CountryCode:string, p_uid :string, p_CompanyName?:string, p_RegNum?: string, p_TaxId? :string): Promise<any> => {
    console.log("p_CountryCode", p_CountryCode);
    
    let queryString: IReqEloqua = { search: '', depth:'complete' };
    let uResult: { uID: string, company: string }  = { uID: '', company: '' };
    let reqUID: IreqAccountRegister = {
        Account: [
            {
                LGCompanyDivision :"EKHQ", //그룹사코드
                SourceSystemDivision:"Eloqua",
                SourceSystemKey1 : "eloquaAccount" ,
                Country: p_CountryCode ,
                AccountName: p_CompanyName,
                CompanyRegistrationNumber: p_RegNum ? p_RegNum.replace(/[\s-]/g, "") : "",
                TaxId : p_TaxId,
            }
        ]
    };
    let issueUID: ICompanyData = {
        countryCode: p_CountryCode,
        bizRegNo: p_RegNum ? p_RegNum.replace(/[\s-]/g, "") : "",
        taxId: p_TaxId
    }

    if(p_CountryCode == 'KR'){
        queryString.search =  `M_Company_Country_Code1='${p_CountryCode}'M_Business_Registration_Number1='${p_RegNum}'`
    }else{
        if(p_TaxId){
            queryString.search =  `M_Company_Country_Code1='${p_CountryCode}'M_Tax_ID1='${p_TaxId}'`
        }        
    }

    try {
        console.log(queryString);
        // 1. UID 존재 여부 확인
        const eloquaAccount = await lge_eloqua.accounts.getAll(queryString);

        if(eloquaAccount.elements.length !== 0){
            logger.info(`### Eloqua UID 존재 ${p_CountryCode}, ${p_CompanyName}, ${p_RegNum}, ${p_TaxId} ###`);

            uResult.uID = utils.matchFieldValues(eloquaAccount.elements[0], '100424'); //100424: Account Fields ID
            uResult.company =  eloquaAccount.elements[0].name;
            
        // 2. 없을 경우 발급요청(companyName != null) 후 5초 대기 (단, Account UID가 pending* 인 것은 요청 하지 않음)
        }else if (eloquaAccount.elements.length == 0 && p_CompanyName !== undefined && !p_uid.startsWith('pending')){
            logger.info(`### UID 발급 요청 ${p_CountryCode}, ${p_CompanyName}, ${p_RegNum}, ${p_TaxId} ###`);
            //console.log(reqUID);

            //2-1. UID 발급 API 
            await LgApi.AccountRegisterAPI(reqUID).then(async (value: IresAccountRegister) => {

                logger.info(`### 5초 대기 => ${JSON.stringify(value.result)} ###`);
                // 2-1-1. 5초 발급 대기
                await utils.delay(5000);
                // 2-1-2. 발급 받은 UID 및 CompanyName 확인
                const issueUIDResult = await LgApi.AccountSingleResultAPI(issueUID);

                //3. 발급이 된 UID Return
                if(issueUIDResult.Account.length !== 0){
                    //console.log('issueUIDResult', issueUIDResult);                    
                    uResult.uID = issueUIDResult.Account[0].UID;
                    uResult.company = issueUIDResult.Account[0].Name;

                    /*
                    * 추 후 Account Insert 로직이 필요함 중복 요청을 안하기 위해서 
                    */

                }else {
                //3-1. 발급 요청한 Company가 조회 되지 않을 경우
                    logger.info(`
                    ***CHECKPOINT!***
                    pending =>  ${p_CountryCode}, ${p_CompanyName}, ${p_RegNum}, ${p_TaxId} 
                    pending AccountRegister result => ${JSON.stringify(value.result)} 
                    `);

                    /*
                    * 추 후 발급 결과 조회 API 로그가 필요함 
                    */

                    uResult.company = p_CompanyName;
                    uResult.uID = `pending(${JSON.parse(value.result).Account[0].VID})`;
                }
        
            }).catch(error => {
                throw error;
            });

        }
        
        return uResult;

    } catch (error) {
        logger.err(`### Check_UID logic Error : ${p_CountryCode}, ${p_CompanyName}, ${p_RegNum}, ${p_TaxId} ###`);
        logger.err(error);
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
        return `${contact.emailAddress}: form insert success`
    }).catch((error: any) => {
        logger.err(`### ${contact.emailAddress}: Insert_Form Error`);
        logger.err(error);
        return `${contact.emailAddress}: form insert fail`
    });
    
}


const Get_COD = async (pageindex: number) => {

    //통합DB_History Custom Object
    const id:number = 408;
    let queryString: IReqEloqua = { search: '', page: pageindex ,depth:'complete' };

    // ____11 : 전송완료여부 필드
    //queryString.search = `updatedAt>'2023-09-18 00:00:00'updatedAt<'2023-09-18 23:59:59'Account_UID1!="pending*"` ____11!=""
    //queryString.search = `____11=""`
    queryString.search = `updatedAt>='${utils.getToday()} 00:00:00'updatedAt<='${utils.getToday()} 23:59:59'____11=""`

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
                logger.warn(`################ CREATE INTERGRATION DB ERROR ################`);
                logger.warn(createApiResult); logger.warn(sendCreateData);
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

        //등록요청하거나 수정요청 한 Contact 이 없을경우 {"sendCreateData": {} , "sendUpdateData": {}}
        console.log("returnResult", returnResult);
        return returnResult
        
    } catch(error){
        logger.err('### Contact_Send Service ERROR ###');
        logger.err(error);
        return error
    }
}

const Update_ContactUID = async (sourceSystemKey1:string, Email:string ,ContactUID:string, updateResultMessage? : string) => {

    try{

        console.log(sourceSystemKey1);
        console.log(Email);
        console.log(ContactUID);
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

        // 1. Contact UID 필드 업데이트 
        await lge_eloqua.contacts.update(contactId, updateContactData);
        //console.log(contactFieldUpdate);
        
        // 2. Custom Object Data 필드 업데이트
        await lge_eloqua.contacts.cod_Update(408, CustomObjectId, updateCOData);
        //console.log(CustomObjectFieldUpdate);
    
        return 'Update_ContactUID success';

    }catch(error){
        logger.err('### Update_ContactUID Service ERROR ###');
        return error;
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
    Update_ContactUID
}

