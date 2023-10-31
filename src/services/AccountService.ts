import { lge_eloqua, lgeSdk_eloqua } from '@src/routes/Auth';
import { IAccountRes } from "@src/api/interface/interfaceApi"
import { Account, AccountForm } from "@src/models/AccountDTD"
import logger from '../public/modules/jet-logger/lib/index';


const integrationAccount = async (IntgrationDB_AccountData: IAccountRes): Promise<any> => {

    try {

        let resultarr = [];

        //200건씩 처리
        const batchSize = 200;

        const AccountArr: Account[] = IntgrationDB_AccountData.result.Account;
        const formId = 8930;

        for(let i = 0; i < AccountArr.length; i += batchSize){
            
            //1000건씩 처리되는 배열 200건씩 자르기
            let batchData:Account[] = AccountArr.slice(i, i + batchSize);

            //result Data .length Insert logic
            for (const account of batchData){

                //Form 형식에 맞게 Data Convert
                let convertFormData = new AccountForm(account);
                
                //Eloqua Form Insert 비동기 처리 
                const Iresult = lge_eloqua.contacts.form_Create(formId, convertFormData);
                resultarr.push(Iresult);
            }
            
            //resultarr에 담긴 Promise를 병렬 처리
            const resData = await Promise.allSettled(resultarr);
            
            // 로그에 reject 된 Promise 결과 기록
            resData.forEach((result, index) => {
                if (result.status == 'rejected') {
                    logger.err(`${i}~${i+batchSize} err`); 
                    logger.err(`Promise_allSettled at ${index} rejected with reason: ${JSON.stringify(result, null, 2)}`);
                }
            });
        }

        // resData 성공 시,
        // status:'fulfilled'
        // value:{type: 'FormData', id: '13536981', fieldValues: Array(22), submittedAt: '1697418079'}
 

    } catch (error) {
        logger.err({
            "error" : "integrationAccount service Error",
            "response_msg" : error.message
        });
        throw error.stack
    }
};


////////////////////////////////////////////////////////
/*
*REST API ELOQUA
*/
////////////////////////////////////////////////////////
//Account Search
// const searchAccount = async (countryCode:string, companyNum:string): Promise<SearchAccount> => {
   
//     let returnResult: SearchAccount = {result: "", companyName: "", uID: ""}

//     try {
//         let options = { search: "", depth: "Complete" };

//         if(countryCode = "KR") options.search =  `M_Country="${countryCode}"M_Business_Registration_Number1"${companyNum}"`
//         if(countryCode != "KR") options.search =  `M_Country="${countryCode}"M_Tax_ID1"${companyNum}"`

//         const sResult = await lge_eloqua.accounts.getAll(options);
//         //console.log(sResult);
//         const data: EloquaAccount[] = sResult.elements;
 
//         if(data.length != 0) {
//             returnResult.uID = utils.matchFieldValues(data[0], "100424");
//             returnResult.companyName = data[0].name;
//             returnResult.result = "success"
//         }else{
//             returnResult.result = "eloqua Account과 매칭되는 값 없음"
//         }

//         return returnResult

//     } catch (error) {
//         logger.err('searchAccount Service Error');
//         logger.err(error);
//         return error;
//     }
// };

//Account CREATE
// const createAccount = async(): Promise<any> => {
//     try{
//         let data = {
//             "name": "TES2",
//             "address1": "test",
//             "address2": "test",
//             "address3": "test",
//             "businessPhone": "01000000000",
//             "city": "seoul",
//             "country": "korea",
//             "postalCode": "postalCode",
//             "province": "province"
//         }
    
//         const cResult = await lge_eloqua.accounts.create(data)
//         return cResult;
//     }catch(error){
//         console.error('에러가 발생1');
//         console.error(error);
//         throw error;
//     }    
// }

//Account UPDATE
// const updateAccount = async(): Promise<any> => {

//     let data = {
//         "name": "TES1",
//         "address1": "test",
//         "address2": "test",
//         "address3": "test",
//         "businessPhone": "01000000000",
//         "city": "seoul",
//         "country": "",
//         "fieldValues": [
//             {
//                 "type": "FieldValue",
//                 "id": "100170",
//                 "value": "100170 update"
//             },
//             {
//                 "type": "FieldValue",
//                 "id": "100181",
//                 "value": "100181"
//             },
//             {
//                 "type": "FieldValue",
//                 "id": "100182",
//                 "value": "100182"
//             }
//         ],
//         "postalCode": "postalCode",
//         "province": "province"
//     }

//     await lge_eloqua.accounts.update(data).then((result: any) => {
//         console.log(result);
//         return result.elements
//     }).catch((err: any) => {
//         return err
//     });
    
// }

//Insert_Form
// const Insert_Form = async(account: Account): Promise<any> => {

//     try {
//         const min= 0;
//         const max= 10000;
//         const randomNumber = Math.floor(Math.random() * (max-min)) + min;

//         let id = 8930;
//         let resultform = {
//             type: "FormData",
//             fieldValues: [
//                 {
//                     "type": "FieldValue",
//                     "id": "159226",
//                     "name": "Account UID",
//                     "value": randomNumber
//                 },
//                 {
//                     "type": "FieldValue",
//                     "id": "159227",
//                     "name": "CountryCode",
//                     "value": account.CountryCode
//                 },
//                 {
//                     "type": "FieldValue",
//                     "id": "159228",
//                     "name": "BizNo",
//                     "value": account.BizNo
//                 },
//                 {
//                     "type": "FieldValue",
//                     "id": "159229",
//                     "name": "TaxID",
//                     "value": account.TaxId
//                 },
//                 {
//                     "type": "FieldValue",
//                     "id": "159230",
//                     "name": "DUNSNo",
//                     "value": account.DUNSNo
//                 },
//                 {
//                     "type": "FieldValue",
//                     "id": "159231",
//                     "name": "CompName",
//                     "value": account.CompName
//                 },
//                 {
//                     "type": "FieldValue",
//                     "id": "159232",
//                     "name": "CompNameEng",
//                     "value": account.CompNameEng
//                 },
//                 {
//                     "type": "FieldValue",
//                     "id": "159233",
//                     "name": "Zip",
//                     "value": account.Zip
//                 },
//                 {
//                     "type": "FieldValue",
//                     "id": "159234",
//                     "name": "CorpNo",
//                     "value": account.CorpNo
//                 },
//                 {
//                     "type": "FieldValue",
//                     "id": "159235",
//                     "name": "DetailAddr",
//                     "value": account.DetailAddr
//                 }
//             ]
//         };

//         const result = await lge_eloqua.contacts.form_Create(id, resultform);
//         return result

//     }catch(error){
//         console.log({
//             "error" : "Account Form Data Insert Error",
//             "response_msg" : error
//         });

//         //error 던지는게 아니라 value 값만 전달해야함, error 처리는 integrationAccount에서 catch
//         return error;
//     }
    
   
    
// }


export default {
    integrationAccount
}



