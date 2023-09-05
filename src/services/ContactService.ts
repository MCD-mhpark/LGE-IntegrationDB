import { lge_eloqua, lgeSdk_eloqua } from '@src/routes/Auth';
import { IReqContact } from "@src/models/ContactDTO";
import {AccountSingleResult, AccountRegister} from "@src/api/Lg_Api"
import * as utils from "@src/util/etc_function";


//Contact 조건에 맞게 Search List
const Get_ContactList = async(code:string): Promise<any> => {

    //const queryText = 
        // "C_DateModified>" + "'" + utils.yesterday_getDateTime().start + " 00:00:00'" + 
        // "C_DateModified<" + "'" + utils.yesterday_getDateTime().start + " 23:59:59'";						
    const queryString: IReqContact = {
            search: '',
            depth: "complete"
    }
    if(code = "KR"){
        queryString.search = "C_DateModified>'2023-09-03 00:00:00'C_DateModified<'2023-09-04 23:59:59'C_Country='South Korea'C_KR_Business_Registration_Number1!=''"
    }else if(code = "Global_T"){
        queryString.search = "C_DateModified>'2023-09-03 00:00:00'C_DateModified<'2023-09-04 23:59:59'C_Country!='South Korea'C_Tax_ID1!=''"
    }else if(code = "Global_D"){
        queryString.search = "C_DateModified>'2023-09-03 00:00:00'C_DateModified<'2023-09-04 23:59:59'C_Country!='South Korea'C_DUNS_Number1!=''"
    }
    console.log(queryString);
    
    return await lge_eloqua.contacts.getAll(queryString).then((result: any) => {
        return result
    }).catch((err: any) => {
        console.log('에러 발생 서비스');
        throw err
    });
    
}

const Check_UID = async( countryCode:string, regNum?: string, taxId? :string, duns_number?:string ): Promise<any> => {
    
    let UID: string;

    let options = {
        search: '',
        depth: "Minimal" 
    };

    if(countryCode = 'KR'){
        options.search =  `M_Country_Code1='${countryCode}'M_Business_Registration_Number1='${regNum}'`
        
    }else{
        if(taxId){
            options.search =  `M_Country_Code1='${countryCode}'M_Tax_ID1='${taxId}'`
        }
        options.search =  `M_Country_Code1='${countryCode}'M_DUNS_Number1='${duns_number}'`           
    }

    try {

        // 1. UID 존재 여부 확인
        const eloquaAccount = await lge_eloqua.accounts.getAll(options);

        if(eloquaAccount.elements.length !== 0){
            UID = utils.matchFieldValues(eloquaAccount.elements[0], '100424') //100424: Account Fields ID
            return UID;
            
        // 2. 없을 경우 발급요청 후 10초 대기, 
        }else if (eloquaAccount?.elements !== undefined && eloquaAccount.elements.length == 0){
            let data = {

            }
            await AccountRegister(data)

            return
        }

    } catch (error) {
        console.error('에러가 발생');
        console.error(error);
        throw error;
    }
    
}


//Contact Data Form 조건에 맞게 Insert
const Insert_Form = async(): Promise<any> => {
    let id = 8888;
    let resultform = {
        type: "FormData",
        fieldValues: [
            {
                "type": "FieldValue",
                "id": "158358",
                "name": "Email Address",
                "value": "asdf@asdf.com" 
            },
            {
                "type": "FieldValue",
                "id": "158359",
                "name": "First Name",
                "value": "LEE"
            },
            {
                "type": "FieldValue",
                "id": "158360",
                "name": "Last Name",
                "value": "test"
            },
            {
                "type": "FieldValue",
                "id": "158361",
                "name": "Company",
                "value": "goldenplanet"
            },
            {
                "type": "FieldValue",
                "id": "158362",
                "name": "국가코드",
                "value": "KR"
            },
            {
                "type": "FieldValue",
                "id": "158363",
                "name": "Account UID",
                "value": "123123"
            },
            {
                "type": "FieldValue",
                "id": "158364",
                "name": "KR_Business_Registration_Number",
                "value": "df45658"
            },
            {
                "type": "FieldValue",
                "id": "158365",
                "name": "Tax ID",
                "value": "1231234"
            },
            {
                "type": "FieldValue",
                "id": "158366",
                "name": "DUNS Number",
                "value": "123123"
            }
        ]
    };

    await lge_eloqua.contacts.form_Create(id, resultform).then((result: any) => {
        console.log(result);
        return result
    }).catch((err: any) => {
        console.log(err);
        return err
    });
    
}

export default {
    Get_ContactList,
    Check_UID,
    Insert_Form
}

