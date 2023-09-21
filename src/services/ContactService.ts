import { lge_eloqua, lgeSdk_eloqua } from '@src/routes/Auth';
import { Contact, IReqEloqua, ContactForm, IUpdateContact } from "@src/models/ContactDTO";
import {AccountSingleResult, AccountRegister} from "@src/api/Lg_Api"
import {IreqAccountRegister, ICompanyData, IresAccountRegister} from "@src/api/interface/interfaceApi"
import * as utils from "@src/util/etc_function";
import logger from '../public/modules/jet-logger/lib/index';

//Contact 조건에 맞게 Search List
const Get_ContactList = async(code:string, pageindex:number): Promise<any> => {
    
    let queryString: IReqEloqua = { search: '', page: undefined , depth:''};
    //const queryText = 
    // "C_DateModified>" + "'" + utils.yesterday_getDateTime().start + " 00:00:00'" + 
    // "C_DateModified<" + "'" + utils.yesterday_getDateTime().start + " 23:59:59'";

    //처음 조회는 totalCount를 가져오기 위해 depth minimal로 하여 Search 속도 향상
    if(pageindex == 0){
        queryString.page = 1;
        queryString.depth = "minimal";
    }else{
        queryString.page = pageindex;
        queryString.depth = "complete"
    }

    if(code = "KR"){
        //C_Country = South Korea && 사업자 등록번호
        //queryString.search = `C_DateModified>'2023-09-03 00:00:00'C_DateModified<'2023-09-04 23:59:59'C_Country="South Korea"C_KR_Business_Registration_Number1!=""`
        //test
        queryString.search = `C_Country="South Korea"C_KR_Business_Registration_Number1!=""emailAddress=test*`
    }else if(code = "Global"){
        //C_Country != NULL && South Korea && TaxID != NULL
        queryString.search = `C_DateModified>'2023-09-03 00:00:00'C_DateModified<'2023-09-04 23:59:59'C_Country!="South Korea"C_Country!=""C_Tax_ID1!=""`
    }
    
    return await lge_eloqua.contacts.getAll(queryString).then((result: any) => {
        return result
    }).catch((err: any) => {
        logger.err('### Get_ContactList ERROR 발생 ###');
        throw err
    });
    
}

//UID 발급 프로세스
const Check_UID = async(p_CountryCode:string, p_CompanyName?:string, p_RegNum?: string, p_TaxId? :string): Promise<any> => {
    
    let queryString: IReqEloqua = { search: '', depth:'complete' };
    let uResult: { uID: string, company: string }  = { uID: '', company: '' };
    let reqUID: IreqAccountRegister = {
        Account: [
            {
                LGCompanyDivision :"EKHQ", //그룹사코드
                Country: p_CountryCode ,
                AccountName: p_CompanyName,
                CompanyRegistrationNumber: p_RegNum,
                TaxId : p_TaxId,
            }
        ]
    };
    let issueUID: ICompanyData = {
        countryCode: p_CountryCode,
        bizRegNo: p_RegNum,
        taxId: p_TaxId
    }

    if(p_CountryCode = 'KR'){
        queryString.search =  `M_Country_Code1='${p_CountryCode}'M_Business_Registration_Number1='${p_RegNum}'`
    }else{
        if(p_TaxId){
            queryString.search =  `M_Country_Code1='${p_CountryCode}'M_Tax_ID1='${p_TaxId}'`
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
            
        // 2. 없을 경우 발급요청(companyName != null) 후 7초 대기
        }else if (eloquaAccount.elements.length == 0 && p_CompanyName !== undefined){
            logger.info(`### UID 발급 요청 ${p_CountryCode}, ${p_CompanyName}, ${p_RegNum}, ${p_TaxId} ###`);
            console.log(reqUID);

            //2-1. UID 발급 API 
            await AccountRegister(reqUID).then(async (value: IresAccountRegister) => {

                logger.info(`### 7초 대기 => ${JSON.stringify(value.result)} ###`);
                // 2-1-1. 7초 발급 대기
                await utils.delay(7000);
                // 2-1-2. 발급 받은 UID 및 CompanyName 확인
                const issueUIDResult = await AccountSingleResult(issueUID);

                //3. 발급이 된 UID Return
                if(issueUIDResult.Account.length != 0){
                    //console.log('issueUIDResult', issueUIDResult);                    
                    uResult.uID = issueUIDResult.Account[0].UID;
                    uResult.company = issueUIDResult.Account[0].Name;
                }else {
                //3-1. 발급 요청한 Company가 조회 되지 않을 경우
                    logger.info(`
                    ***CHECKPOINT!***
                    pending =>  ${p_CountryCode}, ${p_CompanyName}, ${p_RegNum}, ${p_TaxId} 
                    pending AccountRegister result => ${JSON.stringify(value.result)} 
                    `);

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
    queryString.search = `createdAt>'2023-09-18 00:00:00'createdAt<'2023-09-18 23:59:59'Account_UID1!="pending*"`
    
    return await lge_eloqua.contacts.cod_Get(id, queryString).then((result: any) => {
        return result
    }).catch((err: any) => {
        logger.err('### Get_COD ERROR ###');
        throw err
    });

}

const Update_COD =async () => {
    
    //통합DB_History Custom Object
    const id:number = 408;
    let queryString: IReqEloqua = { search: '', depth:'complete' };
    queryString.search = `createdAt>'2023-09-18 00:00:00'createdAt<'2023-09-18 23:59:59'Account_UID1!="pending*"`
    
    return await lge_eloqua.contacts.cod_Get(id, queryString).then((result: any) => {
        return result
    }).catch((err: any) => {
        logger.err('### Get_COD ERROR ###');
        throw err
    });

}

export default {
    Get_ContactList,
    Check_UID,
    Insert_Form,
    Get_COD
}

