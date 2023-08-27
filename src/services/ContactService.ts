import { lge_eloqua, lgeSdk_eloqua } from '@src/routes/Auth';
import { IReqContact } from "@src/models/ContactDTO";

//Contact 조건에 맞게 Search List
const Get_ContactList = async(queryString: IReqContact): Promise<any> => {

    await lge_eloqua.contacts.getAll(queryString).then((result: any) => {
        //console.log(result.elements);
        return result.elements
    }).catch((err: any) => {
        return err
    });
    
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
    Insert_Form
}

