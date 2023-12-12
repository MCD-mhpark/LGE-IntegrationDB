import { lge_eloqua, lgeSdk_eloqua } from '@src/routes/Auth';
import { IAccountRes, IAccountProvideRes, AccountProvideInfo } from "@src/api/interface/interfaceApi"
import logger from '../public/modules/jet-logger/lib/index';
import * as utils from "@src/util/etc_function"
import { Account, AccountForm, IEloquaAccount } from "@src/models/AccountDTO"
import { CustomObjectData, IAccountCOD, ICo } from '@src/models/CustomObjectDTO';
import { IAccountBulkCDO, ISyncRes, ISyncCheckRes } from "@src/models/BulkDTO"

let insertArr:IAccountBulkCDO[] = [];
const bulkInsert_CDO = async (AccountData: IAccountProvideRes, uri:string, nowpage:number, totalCount:number): Promise<void> => {

    try {
        const AccountArr: AccountProvideInfo[] = AccountData.result.Account
        let insertResult:ISyncRes;
        let checkSyncsUri:ISyncRes[] = [];

        for (const account of AccountArr){
            let data = new IAccountBulkCDO(account);
            insertArr.push(data);
        }

        //page 10건 씩 bulk Insert API 처리
        if(nowpage % 10 === 0 || totalCount < 1000){
            insertResult = await lge_eloqua.bulk.co_Imports(uri, insertArr);
            logger.info(insertResult);

            let lastResult:ISyncCheckRes = await lge_eloqua.bulk.checkSync(insertResult.uri);
            checkSyncsUri.push(lastResult);
            logger.info(`integrationAccount page INDEX: ${nowpage} execute!`);
            
            if(totalCount < 1000){
                for(const arr of checkSyncsUri){
                    const checkResult:ISyncCheckRes = await lge_eloqua.bulk.checkSync(arr.uri);
                    logger.warn(checkResult);   

                    if(lastResult.status == 'active'){
                        while(lastResult.status == 'active'){
                            await utils.delay(1000);
                            logger.info('bulk insert 진행중..')
                            lastResult = await lge_eloqua.bulk.checkSync(arr.uri);
                            if(lastResult.status !== 'active') break;
                        }
                        if(lastResult.status !== 'success'){
                            const logResult = await lge_eloqua.bulk.checkSync(arr.uri+'/logs');
                            logger.err(logResult);
                        }
                    }

                    logger.warn('bulk insert 종료');
                    logger.warn(lastResult);
                }
            }
            //배열 초기화
            insertArr = [];

        }
            // //DUID 중복이 있는지 확인
            // const uniqueDUIDMap = new Map<string, IAccountBulkCDO>();
            // const duplicateDUID: IAccountBulkCDO[] = [];
            // insertArr.forEach((item) => {
            //     uniqueDUIDMap.set(item.Account_UID1, item);
            //     if(uniqueDUIDMap.has(item.Account_UID1)) {
            //         duplicateDUID.push(item);
            //         logger.warn(item);
            //     }
            // });

            // //중복이 제거된 결과를 새로운 배열에 저장
            // const uniqueInsertArr = Array.from(uniqueDUIDMap.values());

    } catch (error) {
        logger.err({
            "error" : "bulkInsert_CDO service ERROR",
            "response_msg" : error.message
        });
        throw error.stack
    }
};

const checkSyncs = async (uri: string): Promise<void> => {

    const lastResult:ISyncCheckRes = await lge_eloqua.bulk.checkSync(uri);
    logger.warn(lastResult);

}

const integrationAccount = async (AccountData: ICo): Promise<any> => {

    try {
        //500건씩 처리
        const batchSize = 500;  

        const AccountArr:CustomObjectData[] = AccountData.elements;

        for(let i = 0; i < AccountArr.length; i += batchSize){  

            let resultarr = [];
            //1000건씩 처리되는 배열 500건씩 자르기
            let batchData = AccountArr.slice(i, i + batchSize);
            console.log(i);
            console.log(i + batchSize);
            
            for (const account of batchData){
                    //1. Eloqua Account Table 유무 확인 

                    async function accountLogic (account:any) {
                        let s_options = { search: `M_Account_UID1=${utils.matchFieldValues(account, "3780")}`, depth: "minimal" };
                        let searchResult = await lge_eloqua.accounts.getAll(s_options);
                        
                        if( Buffer.byteLength(utils.matchFieldValues(account, "3796")) > 100 ) {
                            return;
                        }else{
                            //2. Eloqua Account Create or Update
                            if(searchResult.total == 0){
                                const c_data = new IEloquaAccount(account);
                                lge_eloqua.accounts.create(c_data).then((result:any) => {/*console.log(result);*/
                                }).catch((error:any) => {logger.err(error)});
                                logger.info(`${account.name} 생성 완료`)
                            }else{
                                let id = searchResult.elements[0].id
                                const u_data = new IEloquaAccount(account, id);
                                lge_eloqua.accounts.update(id, u_data).then((result:any) => {/*console.log(result);*/
                                }).catch((error:any) => {logger.err(error)});
                                logger.info(`${account.name} 업데이트 완료`)
                            }
                        }
                    } 

                    resultarr.push(accountLogic(account));   
                }

                await Promise.allSettled(resultarr);
            }

            /** 
            // 로그에 reject 된 Promise 결과 기록
            resData.forEach((result, index) => {
                if (result.status == 'rejected') {
                    logger.err(`${i}~${i+batchSize} err`); 
                    logger.err(`Promise_allSettled at ${index} rejected with reason: ${JSON.stringify(result, null, 2)}`);
                }
            });
            **/
        
    } catch (error) {
        logger.err({
            "error" : "integrationAccount service Error",
            "response_msg" : error.message
        });
        logger.err(error.stack);
    }
};

const insert_COD = async (IntgrationDB_AccountData: IAccountRes): Promise<any> => {

    try {
        let resultAr = [];
        const batchSize = 500;

        const AccountArr: Account[] = IntgrationDB_AccountData.result.Account;
        const CO_Id = 462;

        for(let i = 0; i < AccountArr.length; i += batchSize){
            
            let batchData:Account[] = AccountArr.slice(i, i + batchSize);
            
            for (const account of batchData){
                
              let data = new IAccountCOD(account);
                
              const promiseFunc = lge_eloqua.contacts.cod_Create(CO_Id, data).then((result:any) => {
                    //console.log(result);
                    }).catch((error:any) => {
                        logger.err(JSON.stringify(data));
                        logger.err({error: error, "errorMsg": error.message, "errorStack": error.stack});
                    });

                resultAr.push(promiseFunc);
            }

            await Promise.allSettled(resultAr);
            logger.info(`500건 처리 완료`);

        }

    } catch (error) {
        logger.err({
            "error" : "insert_CO service ERROR",
            "response_msg" : error.message
        });
        throw error.stack
    }
};


const get_AccountCOD = async (type:string, count?:boolean, page?:number) => {

    //통합DB_Account_History Custom Object
    const id:number = 462;
    let queryString:{search:string, depth:string, page?:number} = {search: "null", depth:"complete"};
    
    if(type == 'insert_get'){
        if(count) queryString.depth = "minimal"
        queryString.search = `createdAt>='${utils.getYesterday()} 00:00:00'`
        //queryString.search = `Company_Name1='Weifang Zexu Trading Co., Ltd.'`
        queryString.page = page == undefined ? 1 : page;
    }

    // // ____11 : 전송완료여부 필드
    // queryString.search = `createdAt>='${utils.getToday()} 23:59:59'`
    //queryString.search = '____11=""'

    logger.info(`queryString: ${JSON.stringify(queryString)}`);
    return await lge_eloqua.contacts.cod_Get(id, queryString).then((result: ICo) => {
        if(count) return result.total;
        return result;
    }).catch((error: any) => {
        logger.err({
            "error" : 'Get_COD service ERROR',
            "response_msg" : error.message
        });
        throw error.stack
    });

}

const delete_COD = async (): Promise<any> => {

}

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
    bulkInsert_CDO,
    integrationAccount,
    insert_COD,
    delete_COD,
    get_AccountCOD
}



