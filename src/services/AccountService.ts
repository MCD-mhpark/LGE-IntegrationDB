import { lge_eloqua, lgeSdk_eloqua } from '@src/routes/Auth';
import { IAccountRes } from "@src/api/interface/interfaceApi"
import { Account, AccountForm } from "@src/models/AccountDTD"


//Account Search
const integrationAccount = async (IntgrationDB_AccountData: IAccountRes): Promise<any> => {

    try {

        let resultarr = [];

        const AccountArr: Account[] = IntgrationDB_AccountData.result.Account;
        const formId = 8930;
        console.time('time');

        //result Data .length Insert logic
        for (const account of AccountArr){

            let converFormData = new AccountForm(account);
            
            //Eloqua Form Insert 비동기 처리 
            const Iresult = lge_eloqua.contacts.form_Create(formId, converFormData);
            resultarr.push(Iresult);

        }
        
        //resultarr에 담긴 Promise를 병렬 처리
        const resData = await Promise.all(resultarr);
        console.timeEnd('time');

        console.log(resData);
        return resData

    } catch (error) {
        console.log({
            "error" : "integrationAccount service Error",
            "response_msg" : error
        });
        return error;
    }
};


////////////////////////////////////////////////////////
/*
*REST API ELOQUA
*/
////////////////////////////////////////////////////////
//Account Search
const searchAccount = async (accountUID:string): Promise<any> => {
   
    let search = ''
    try {
        const options = {
        search: `M_Account_UID1='${accountUID}'`, //`name='3M'`
        depth: "Minimal" // id만 확인하면 되어서 최소 정보만 확인하면 됨
        };

        const sResult = await lge_eloqua.accounts.getAll(options);
        //console.log(sResult);
        
        /*{
            elements: [
              {
                type: 'Account',
                id: '11',
                createdAt: '1643348137',
                depth: 'minimal',
                description: '',
                name: '3M',
                updatedAt: '1692751526',
                fieldValues: [Array]
              }
            ],
            page: 1,
            pageSize: 1000,
            total: 1
          }*/
        //console.log(sResult.elements);
        return sResult

    } catch (error) {
        console.error('에러가 발생');
        console.error(error);
        throw error;
    }
};

//Account CREATE
const createAccount = async(): Promise<any> => {
    try{
        let data = {
            "name": "TES2",
            "address1": "test",
            "address2": "test",
            "address3": "test",
            "businessPhone": "01000000000",
            "city": "seoul",
            "country": "korea",
            "postalCode": "postalCode",
            "province": "province"
        }
    
        const cResult = await lge_eloqua.accounts.create(data)
        return cResult;
    }catch(error){
        console.error('에러가 발생1');
        console.error(error);
        throw error;
    }    
}

//Account UPDATE
const updateAccount = async(): Promise<any> => {

    let data = {
        "name": "TES1",
        "address1": "test",
        "address2": "test",
        "address3": "test",
        "businessPhone": "01000000000",
        "city": "seoul",
        "country": "",
        "fieldValues": [
            {
                "type": "FieldValue",
                "id": "100170",
                "value": "100170 update"
            },
            {
                "type": "FieldValue",
                "id": "100181",
                "value": "100181"
            },
            {
                "type": "FieldValue",
                "id": "100182",
                "value": "100182"
            }
        ],
        "postalCode": "postalCode",
        "province": "province"
    }

    await lge_eloqua.accounts.update(data).then((result: any) => {
        console.log(result);
        return result.elements
    }).catch((err: any) => {
        return err
    });
    
}

const Insert_Form = async(account: Account): Promise<any> => {

    try {
        const min= 0;
        const max= 10000;
        const randomNumber = Math.floor(Math.random() * (max-min)) + min;

        let id = 8930;
        let resultform = {
            type: "FormData",
            fieldValues: [
                {
                    "type": "FieldValue",
                    "id": "159226",
                    "name": "Account UID",
                    "value": randomNumber
                },
                {
                    "type": "FieldValue",
                    "id": "159227",
                    "name": "CountryCode",
                    "value": account.CountryCode
                },
                {
                    "type": "FieldValue",
                    "id": "159228",
                    "name": "BizNo",
                    "value": account.BizNo
                },
                {
                    "type": "FieldValue",
                    "id": "159229",
                    "name": "TaxID",
                    "value": account.TaxId
                },
                {
                    "type": "FieldValue",
                    "id": "159230",
                    "name": "DUNSNo",
                    "value": account.DUNSNo
                },
                {
                    "type": "FieldValue",
                    "id": "159231",
                    "name": "CompName",
                    "value": account.CompName
                },
                {
                    "type": "FieldValue",
                    "id": "159232",
                    "name": "CompNameEng",
                    "value": account.CompNameEng
                },
                {
                    "type": "FieldValue",
                    "id": "159233",
                    "name": "Zip",
                    "value": account.Zip
                },
                {
                    "type": "FieldValue",
                    "id": "159234",
                    "name": "CorpNo",
                    "value": account.CorpNo
                },
                {
                    "type": "FieldValue",
                    "id": "159235",
                    "name": "DetailAddr",
                    "value": account.DetailAddr
                }
            ]
        };

        const result = await lge_eloqua.contacts.form_Create(id, resultform);
        return result

    }catch(error){
        console.log({
            "error" : "Account Form Data Insert Error",
            "response_msg" : error
        });

        //error 던지는게 아니라 value 값만 전달해야함, error 처리는 integrationAccount에서 catch
        return error;
    }
    
   
    
}


export default {
    integrationAccount
}



