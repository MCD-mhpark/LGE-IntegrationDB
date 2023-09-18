import { lge_eloqua, lgeSdk_eloqua } from '@src/routes/Auth';
import { Contact, IReqEloqua, ContactForm, IUpdateContact } from "@src/models/ContactDTO";
import {AccountSingleResult, AccountRegister} from "@src/api/Lg_Api"
import {IAccountRegister} from "@src/api/interface/interfaceApi"
import * as utils from "@src/util/etc_function";
import logger from 'jet-logger';

//Contact 조건에 맞게 Search List
const Get_ContactList = async(code:string): Promise<any> => {
    
    //const queryText = 
    // "C_DateModified>" + "'" + utils.yesterday_getDateTime().start + " 00:00:00'" + 
    // "C_DateModified<" + "'" + utils.yesterday_getDateTime().start + " 23:59:59'";						
    let queryString: IReqEloqua = { search: '', depth:'' };
    queryString.depth = 'complete'

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
const Check_UID = async(countryCode:string, companyName?:string, regNum?: string, taxId? :string): Promise<any> => {
    
    let queryString: IReqEloqua = { search: '', depth:'' };
    let uResult: { uID: string, company: string }  = { uID: '', company: '' };


    queryString.depth = 'complete'

    if(countryCode = 'KR'){
        queryString.search =  `M_Country_Code1='${countryCode}'M_Business_Registration_Number1='${regNum}'`
    }else{
        if(taxId){
            queryString.search =  `M_Country_Code1='${countryCode}'M_Tax_ID1='${taxId}'`
        }        
    }

    try {
        console.log(queryString);
        // 1. UID 존재 여부 확인
        const eloquaAccount = await lge_eloqua.accounts.getAll(queryString);

        if(eloquaAccount.elements.length !== 0){
            logger.info(`### Eloqua UID 존재 ${countryCode}, ${companyName}, ${regNum}, ${taxId} ###`);
            //console.log(utils.matchFieldValues(eloquaAccount.elements[0], '100424'));
            uResult.uID = utils.matchFieldValues(eloquaAccount.elements[0], '100424'); //100424: Account Fields ID
            uResult.company =  eloquaAccount.elements[0].name;
            
        // 2. 없을 경우 발급요청(companyName != null) 후 10초 대기
        }else if (eloquaAccount.elements.length == 0 && companyName !== undefined){
            console.log(`### UID 발급 요청 ${countryCode}, ${companyName}, ${regNum}, ${taxId} ###`);
            let data: IAccountRegister = {
                Account: [
                    {
                        LGCompanyDivision :"EKHQ", //그룹사코드
                        Country: countryCode ,
                        AccountName: companyName,
                        CompanyRegistrationNumber: regNum,
                        TaxId : taxId,
                    }
                ]
            }
            console.log(data);

            //발급 API
            // const functionAccountR = await AccountRegister(data)
            // .then((value) => {
            //     console.log(value);
            //     //setTimeout(sayHi, 10000, "홍길동", "안녕하세요."); 
            //     AccountSingleResult
            // }).catch(error => {
            //     throw error;
            //   });

            // if (functionAccountR) {
            //     tasks.push(functionAPromise);
            //     tasks.push(delay(10000).catch(error => {
            //         console.error("Error during delay:", error);
            //     }));
            //     tasks.push(async () => {
            //         try {
            //         await functionB();
            //         } catch (error) {
            //         console.error("Error in functionB:", error);
            //         }
            //     });
            // }
        }
        
        return uResult;

    } catch (error) {
        logger.err(`### Check_UID logic Error : ${countryCode}, ${companyName}, ${regNum}, ${taxId} ###`);
        logger.err(error);
        return `Check_UID logic Error`;
    }
}

//Contact Data Form 조건에 맞게 Insert
const Insert_Form = async (contact:Contact, updateContact:IUpdateContact): Promise<any> => {
    const id = 8888;
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

export default {
    Get_ContactList,
    Check_UID,
    Insert_Form
}

