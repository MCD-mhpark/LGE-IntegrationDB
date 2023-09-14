import axios, { AxiosError, AxiosResponse } from "axios";
import {convertCountry} from "@src/api/interface/interfaceApi"

axios.defaults.headers.common["x-apikey"] = "QM2iPGpFee0pWSCVT4xOphwdjf4YbFgj";
axios.defaults.headers.common["Content-Type"] = "application/json";

//국내기업 검색
export const searchKoreaCompany = (type:string, value:any) => {
      switch (type) {
        case "COMPANY_NAME":
          var url = "https://eapi-dev.singlex.com/mdm/tbwapi/group/common/get/kr/list/company?affil_code=Z110";
          return api_searchCompany("POST", url, { compName: value });
        case "BIZ_NO":
          var url = `https://eapi-dev.singlex.com/mdm/tbwapi/group/common/get/kr/company/${value}?affil_code=Z110`;
          return api_searchCompany("GET", url);
      }
    };
    
//해외기업 검색
export const searchCompany = (type:string, value:any, countryCode:string) => {
  switch (type) {
    case "COMPANY_NAME":
      var url = "https://eapi-dev.singlex.com/mdm/tbwapi/group/common/get/list/company?affil_code=Z110";
      return api_searchCompany("POST", url, { compName: value, countryCode });
    case "TAX_ID":
      var url = "https://eapi-dev.singlex.com/mdm/tbwapi/group/common/get/company/taxid?affil_code=Z110";
      return api_searchCompany("POST", url, { taxID: value, countryCode });
    case "DUNSz_NO":
      var url = `https://eapi-dev.singlex.com/mdm/tbwapi/group/common/get/company/${countryCode}/${value}?affil_code=Z110`;
      return api_searchCompany("GET", url);
  }
};

//회사조회 api
const api_searchCompany = async (type:string, url:any, postData?:any) => {
  if (type === "GET") {
    return await axios
      .get(url)
      .then(function (response) {
        console.log("데이터:", response.data);
        return response.data;
        // return ({
        //     code: "success",
        //     data:  response.data
        // })
      })
      .catch(function (error) {
        console.error("에러:", error);
        return ({
            code: "fail",
            data: error.response ? JSON.stringify(error.response.data) : error
        })
      });
  } else {
    return await axios
      .post(url, postData)
      .then(function (response) {
        console.log("데이터:", response.data);
        return ({
            code: "success",
            data:  response.data
        })
      })
      .catch(function (error) {
        console.error("에러:", error);
        return ({
            code: "fail",
            data: error.response ? JSON.stringify(error.response.data) : error
        })
      });
  }
};