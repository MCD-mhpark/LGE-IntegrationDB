import axios, { AxiosError, AxiosResponse } from "axios";
import {ILgToken, ICompanyData, IAccountReq, IAccountRes,IAccountRegister, convertCountry} from "@src/api/interface/interfaceApi"

const LgToken: ILgToken = {
    grant_type: 'password',
    username: 'interface@lgemat.com.dev',
    password: 'test123456',
    client_id: '3MVG9z6NAroNkeMnIc4ShFN4fN3WrW1CpNX.nE5IrXk1xc4n0yVatppi3ahKF3CerWe6uBAmvqibB1.T5BukF',
    client_secret: '388241CFD5BF07137A8C2AD86B06C3287B6832CEC19FE4A81115885D01F7860A'
}

async function GetToken():Promise<any> {

        return await axios({
            method: "POST", 
            url: "https://lgcorp--dev.sandbox.my.salesforce.com/services/oauth2/token", // 개발 
            //url: "https://lgcorp--sandbox.sandbox.my.salesforce.com/services/oauth2/token", // 품질
            //url: "https://lgcorp.my.salesforce.com/services/oauth2/token", //운영
            headers: {'content-type': 'application/x-www-form-urlencoded'},
            data: LgToken, 
            validateStatus: function (status) {
                return status >= 200 && status <= 400; 
              }
        })
        .then(function (response):AxiosResponse<any> {
            //console.log(response.data);
            // {
            //     access_token: '00D6D0000008hqc!ARoAQO0WWJebHDhH2eCN3umGi.Bm6BOW7Yn2Z_QwaHp0h6GZv.E83sX8sLdVjuZDQWAkNXQ1GMNS3PVEYWOYCUwQWvZjtxSs',
            //     instance_url: 'https://lgcorp--dev.sandbox.my.salesforce.com',
            //     id: 'https://test.salesforce.com/id/00D6D0000008hqcUAA/0056D000006cAgCQAU',
            //     token_type: 'Bearer',
            //     issued_at: '1692600292754',
            //     signature: 'jnUetKmDT4xrVxwUDncvA6u+n/GUsrNlUQd8bOV/V6w='
            // }
            if(response.data.access_token){
                return response.data.access_token
            }else{
                throw new Error (JSON.stringify(response.data, null, 2))
            }
        })
        .catch(function (error):AxiosError<any> {            
            console.log({
                "error" : "LG_API 토큰 값을 받아오지 못하였습니다.",
                "response_msg" : [error]
            });
            throw error
        })
}    


export const AccountSingleResult = async (data: ICompanyData):Promise<any> => {    
    
    //1. 국가 코드 변환token 값 
    console.log(data.countryCode);
    if(convertCountry(data.countryCode) === 'undefined error'){
        // 이렇게 반환되면 AccountSingleResult 사용하는 곳에서 이메일 로그 남겨야 함
        return 'undefined Country'
    }else{
    //2. token 값 생성
    const TOKEN = await GetToken();

    //3. Api 통신
    const Companydata: ICompanyData = {
        countryCode : convertCountry(data.countryCode), 
        bizRegNo : data.bizRegNo, 
        dunsNo : data.dunsNo, 
        taxId : data.taxId
    }
        return await axios({
            method: "POST", 
            url: "https://lgcorp--dev.sandbox.my.salesforce.com/services/apexrest/CD/AccountSingle/resultset", // 개발
            //url: "https://lgcorp--sandbox.sandbox.my.salesforce.com/services/apexrest/CD/AccountSingle/resultset" // 품질
            //url: "https://lgcorp.my.salesforce.com/services/apexrest/CD/AccountSingle/resultset" // 운영
            headers: {
                Authorization: `Bearer ${TOKEN}`
              },
            data: Companydata, 
            validateStatus: function (status) {
                return status >= 200 && status <= 400; 
              }
        })
        .then(function (response):AxiosResponse<any> {
            //console.log(JSON.parse(response.data.result));
            let data = JSON.parse(response.data.result)
                return data;
                // UID 조회가 안될경우
                // {
                //     "Account": []
                // }
        })
        .catch(function (error):AxiosError<any> {
            throw error;
        })
    }

}    

//Account 생성 및 변경 목록 전송 API
export const AccountProvide = async (data: IAccountReq):Promise<any> => {

    //Access Token Value
    const TOKEN = await GetToken();

    return await axios({
        method: "POST", 
        url: "https://lgcorp--dev.sandbox.my.salesforce.com/services/apexrest/CD/AccountProvide/resultset", // 개발 
        //url: "https://lgcorp--sandbox.sandbox.my.salesforce.com/services/apexrest/CD/AccountProvide/resultset", // 품질
        //url: "https://lgcorp.my.salesforce.com/services/apexrest/CD/AccountProvide/resultset", //운영
        headers: {
            Authorization: `Bearer ${TOKEN}`
          },
        data, 
        validateStatus: function (status) {
            return status >= 200 && status <= 400; 
          }
    })
    .then(function (response):AxiosResponse<any> {
        console.log(response.data);
        const R = response.data;
        if(R.hasOwnProperty('result') == false && R.nowPage == null) throw new Error (R.message);
        return R
    })
    .catch (function (error):AxiosError<any> {                        
        console.log({
            "error" : "Account 생성 및 변경 목록 전송 API 오류가 발생하였습니다.",
            "response_msg" : [error.response ? JSON.stringify(error.response.data) : error]
        });
        throw error
    })

}    

//Account UID 발급 요청 API
export const AccountRegister = async (data:IAccountRegister):Promise<any> => {

    //Access Token Value
    const TOKEN = await GetToken();

    return await axios({
        method: "POST", 
        url: "https://lgcorp--dev.sandbox.my.salesforce.com/services/apexrest/CD/Account/Register", // 개발 
        //url: "https://lgcorp--sandbox.sandbox.my.salesforce.com/services/apexrest/CD/Account/Register", // 품질
        //url: "https://lgcorp--dev.sandbox.my.salesforce.com/services/apexrest/CD/Account/Register", //운영
        headers: {
            Authorization: `Bearer ${TOKEN}`
          },
        data, 
        validateStatus: function (status) {
            return status >= 200 && status <= 400; 
          }
    })
    .then(function (response):AxiosResponse<any> {
        console.log(response.data);
        return response.data;
    })
    .catch (function (error):AxiosError<any> {                        
        console.log({
            "error" : "UID 발급 요청 API 오류가 발생하였습니다.",
            "response_msg" : [error.response ? JSON.stringify(error.response.data) : error]
        });
        throw error
    })

}    

