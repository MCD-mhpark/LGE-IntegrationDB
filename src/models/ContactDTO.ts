import * as utils from "@src/util/etc_function";
import {convertCountry, convertRegion} from "@src/api/interface/interfaceApi"

export interface IReqEloqua {
    search: string;
    depth?: string;
    page?: number;
  }

export interface IUpdateContact {
  company: string | undefined;
  uID: string | undefined;
}

export class updateContact {
  uID: string;
  company: string;

  constructor(uID: string, company: string) {
    this.uID = uID;
    this.company = company;
  }
}


// export default {
//   IReqContact
// } as const;

// interface FieldValue {
//   type: string;
//   id: string;
//   value?: any;
// }

// export interface IContact {
//   type: string;
//   currentStatus: string;
//   id: string;
//   createdAt: string;
//   depth: string;
//   name: string;
//   updatedAt: string;
//   accountName: string;
//   address1: string;
//   address2: string;
//   businessPhone: string;
//   city: string;
//   country: string;
//   emailAddress: string;
//   emailFormatPreference: string;
//   fieldValues: FieldValue[];
//   firstName: string;
//   isBounceback: string;
//   isSubscribed: string;
//   lastName: string;
//   mobilePhone: string;
//   postalCode: string;
//   subscriptionDate: string;
// }

class FieldValue {
  constructor(public type: string, public id: string, public value?: any) {}
}

export class Contact {
  type: string;
  id: string;
  createdAt: string;
  name: string;
  updatedAt: string;
  accountName: string;
  businessPhone: string;
  city: string;
  country: string;
  emailAddress: string;
  fieldValues: FieldValue[];
  firstName: string;
  lastName: string;
  mobilePhone: string;
  postalCode: string;


  constructor(data: any) {
      this.type = data.type;
      this.id = data.id;
      this.createdAt = data.createdAt;
      this.name = data.name;
      this.updatedAt = data.updatedAt;
      this.accountName = data.accountName;
      this.businessPhone = data.businessPhone;
      this.city = data.city;
      this.country = data.country;
      this.emailAddress = data.emailAddress;
      this.fieldValues = data.fieldValues.map((fv: any) => new FieldValue(fv.type, fv.id, fv.value));
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.mobilePhone = data.mobilePhone;
      this.postalCode = data.postalCode;
  }
}


class FormFieldValue {
  constructor(public type: string, public id: string, public name: string, public value: any) {}
}

export class ContactForm {
  type: string;
  fieldValues: FormFieldValue[];

  constructor(contact: Contact, updateContact:IUpdateContact) {
      this.type = "FormData";
      this.fieldValues = [
          new FormFieldValue("FieldValue", "164848", "Eloqua Contact ID", contact.id),
          new FormFieldValue("FieldValue", "163925", "Last Name", contact.lastName),
          new FormFieldValue("FieldValue", "163926", "First Name", contact.firstName),
          new FormFieldValue("FieldValue", "163994", "Business Phone", contact.businessPhone),
          new FormFieldValue("FieldValue", "163995", "Mobile Phone", contact.mobilePhone),
          new FormFieldValue("FieldValue", "158358", "Email Address", contact.emailAddress),
          new FormFieldValue("FieldValue", "163933", "Company Name", updateContact.company ?? contact.accountName),
          new FormFieldValue("FieldValue", "163934", "City", contact.city),
          new FormFieldValue("FieldValue", "165096", "Contact UID", this.getFieldValueById(contact, "100460")),
          new FormFieldValue("FieldValue", "165214", "Region", convertRegion(this.getFieldValueById(contact, "100069"))),
          new FormFieldValue("FieldValue", "163935", "CountryCode", convertCountry(contact.country)),
          new FormFieldValue("FieldValue", "163927", "First Name and Last Name", this.getFieldValueById(contact, "100172")),
          new FormFieldValue("FieldValue", "163928", "BU별 Seniority", this.getFieldValueBusinessType(contact, 'Seniority')),
          new FormFieldValue("FieldValue", "163929", "Department", this.getFieldValueById(contact, "100238")),
          new FormFieldValue("FieldValue", "163930", "Date Created", this.formatUnixTimestamp(contact.createdAt)),
          new FormFieldValue("FieldValue", "163931", "Date Modified", this.formatUnixTimestamp(contact.updatedAt)),
          new FormFieldValue("FieldValue", "163936", "BU별 Job Function", this.getFieldValueBusinessType(contact, 'JobFunction')),
          new FormFieldValue("FieldValue", "163937", "Job Title", this.getFieldValueById(contact, "100292")),
          new FormFieldValue("FieldValue", "163932", "Marketing Event", this.getFieldValueById(contact, "100203")),
          new FormFieldValue("FieldValue", "158363", "Account UID", updateContact.uID),
          new FormFieldValue("FieldValue", "163941", "Zip or Postal Code", this.getFieldValueById(contact, "100011")),
          
          // 각 동의 항목별 KR, Global따라 매핑 되어야 하는 필드가 다름.
          //개인정보동의여부
          new FormFieldValue("FieldValue", "163939", "PrivacyPolicyAgreement", this.subsidiaryAgreeLogic(contact, this.getFieldValueById(contact , "100196"), "PP_Agreement")),
          new FormFieldValue("FieldValue", "165191", "PrivacyPolicyAgreementLastDate", this.subsidiaryAgreeLogic(contact, this.getFieldValueById(contact , "100196"), "PP_AgreementDate")),
          //제3자이용자동의여부
          new FormFieldValue("FieldValue", "165192", "ThirdPartyAgreement", this.subsidiaryAgreeLogic(contact, this.getFieldValueById(contact, "100196"), "TP_Agreement")),
          new FormFieldValue("FieldValue", "165193", "ThirdPartyAgreementLastDate", this.subsidiaryAgreeLogic(contact, this.getFieldValueById(contact , "100196"), "TP_AgreementDate")),
          //제3국이전동의여부
          new FormFieldValue("FieldValue", "163940", "TransferThirdCountriesAgreement", this.subsidiaryAgreeLogic(contact, this.getFieldValueById(contact, "100196"), "TTC_Agreement")),
          new FormFieldValue("FieldValue", "165194", "TransferThirdCountriesAgreementLastDate", this.subsidiaryAgreeLogic(contact, this.getFieldValueById(contact , "100196"), "TTC_AgreementDate")),
          //마케팅동의여부
          new FormFieldValue("FieldValue", "163938", "MarketingAgreement", this.subsidiaryAgreeLogic(contact, this.getFieldValueById(contact, "100196"), "M_Agreement")),
          new FormFieldValue("FieldValue", "165190", "MarketingAgreementLastDate", this.subsidiaryAgreeLogic(contact, this.getFieldValueById(contact , "100196"), "M_AgreementDate")),

          new FormFieldValue("FieldValue", "165117", "통합DB 전송 날짜", utils.getToday()),
      ];
  }
  
  private getFieldValueById(contact: Contact, id: string): string {
    const fieldValue = contact.fieldValues.find((fv) => fv.id === id);
    return fieldValue ? fieldValue.value : "";
  }

  private formatUnixTimestamp(unixTimestamp:any): string {
    if (!unixTimestamp) return "";
    const date = new Date(parseInt(unixTimestamp) * 1000);
    return date.toISOString().slice(0, 10); // yyyy-mm-dd 형식으로 변환
  }

  //Subsidiary: 100196
  private subsidiaryAgreeLogic(contact: Contact, subsidiary: string, value: string): string {

  // *Subsidiary가 KR인 경우 (조건 추후 추가 예정)
  // 1. 개인정보활용동의: KR_Privacy Policy_Collection and Usage => Privacy Policy Agreement
  // 2. 마케팅정보수신동의: KR_Privacy Policy_Optin => Marketing Agreement
  // 3. 마케팅활용동의: KR_Privacy Policy_Optin_Usage (X)
  // 4. 국외이전동의: KR_Privacy Policy_Transfer PI Aborad =>TransferThirdCountriesAgreement
  // 5. 제3자동의: KR_Privacy Policy_Consignment of PI => ThirdPartyAgreement

  //*글로벌조건 Subsidiary가 KR이 아닌 경우 (조건 추후 변경 예정)
  // 1. 개인정보활용동의 - Privacy Policy => Privacy Policy Agreement
  // 2. 마케팅정보수신동의 - DirectMarketing_EM_TXT_SNS =>  Marketing Agreement
  // 3. 마케팅활용동의 - DirectMarketing_TargetedAd  (X)
  // 4. 국외이전동의 - TransferOutsideCountry =>TransferThirdCountriesAgreement


  ///////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////
  //리팩토링 필요 함
  ///////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////
  
  // if (subsidiary === "KR") {
  //   const krMappings: Record<string, string> = {
  //     PP_Agreement: "100315",
  //     PP_AgreementDate: "100320",
  //     TP_Agreement: "100316",
  //     TTC_Agreement: "100317",
  //     M_Agreement: "100318",
  //     M_AgreementDate: "100319",
  //   };

  //   return this.getFieldValueById(contact, krMappings[value]) || "";

  // } else if (subsidiary !== "N/A" && subsidiary !== "undefined") {
  //   const globalMappings: Record<string, string> = {
  //     PP_Agreement: "100213",
  //     PP_AgreementDate: "100199",
  //     TP_Agreement: "N/A",
  //     TP_AgreementDate: "",
  //     TTC_Agreement: "100210",
  //     TTC_AgreementDate: "100208",
  //     M_Agreement: "100211",
  //     M_AgreementDate: "100200",
  //   };

  //   return globalMappings[value] || "N/A";

  // } else {
  //   return "N/A";
  // }

    let result:string = "";

      if(subsidiary == "KR"){

        if(value == "PP_Agreement"){
          //KR_Privacy Policy_Collection and Usage
          result = this.mapAgressValue(this.getFieldValueById(contact, "100315"));
        }
        if(value == "PP_AgreementDate"){
          //KR_Privacy Policy_Collection and Usage_AgreedDate
          result = this.formatUnixTimestamp(this.getFieldValueById(contact, "100320"));
        }

        if(value == "TP_Agreement"){
          //KR_Privacy Policy_Consignment of PI
          result = this.mapAgressValue(this.getFieldValueById(contact, "100316"));
        }
        if(value == "TP_AgreementDate"){
          //필드가 존재하지 않음
          result = "";
        }

        if(value == "TTC_Agreement"){
          //KR_Privacy Policy_Transfer PI Aborad
          result = this.mapAgressValue(this.getFieldValueById(contact, "100317"));
        }
        if(value == "TTC_AgreementDate"){
          // 필드가 존재하지 않음
          result = "";
        }

        if(value == "M_Agreement"){
          //KR_Privacy Policy_Optin
          result = this.mapAgressValue(this.getFieldValueById(contact, "100318"));
        }
        if(value == "M_AgreementDate"){
          //KR_Privacy Policy_Optin_Date
          result = this.formatUnixTimestamp(this.getFieldValueById(contact, "100319"));
        }

      }else if (subsidiary != "KR" && subsidiary != "N/A"){

        if(value == "PP_Agreement"){
          //Privacy Policy_Agreed
          result = this.mapAgressValue(this.getFieldValueById(contact, "100213"));
        }
        if(value == "PP_AgreementDate"){
          //Privacy Policy_AgreedDate
          result = this.formatUnixTimestamp(this.getFieldValueById(contact, "100199"));
        }

        if(value == "TP_Agreement"){
          result = "N/A"
        }
        if(value == "TP_AgreementDate"){
          result = ""
        }

        if(value == "TTC_Agreement"){
          //TransferOutsideCountry
          result = this.mapAgressValue(this.getFieldValueById(contact, "100210"));
        }
        if(value == "TTC_AgreementDate"){
          //TransferOutsideCountry_AgreedDate
          result = this.formatUnixTimestamp(this.getFieldValueById(contact, "100208"));
        }

        if(value == "M_Agreement"){
          //DirectMarketing_EM_TXT_SNS
          result = this.mapAgressValue(this.getFieldValueById(contact, "100211"));
        }  
        if(value == "M_AgreementDate"){
          //DirectMarketing_EM_TXT_SNS_AgreedDate
          result = this.formatUnixTimestamp(this.getFieldValueById(contact, "100200"));
        }

      }else{
        //N/A 이거나 undefined
          result = "N/A"
      }

    return result;

  }

  private mapAgressValue(value: string): string {
    if (value === "Yes") {
        return "Y";
    } else if (value === "No") {
        return "N";
    } else {
        return "N/A";
    }
}

  //Business Unit
  private getFieldValueBusinessType( contact:Contact, field:string ): string | undefined {
    let businessUnit:string = this.getFieldValueById(contact, '100229');
    if(businessUnit != ''){
      const BU_FieldValues:any = {
        "AS": {
          //AS_Authority1(Seniority)
          Seniority: "100219",
          //AS_Authority2(Job Function)
          JobFunction: "100323",
        },
        "IT": {
          //IT_Authority1(Seniority)
          Seniority: "100269",
          //IT_Authority2(Job Function)
          JobFunction: "100214",
        },
        "ID": {
          //ID_Authority1(Seniority)
          Seniority: "100262",
          //ID_Authority2(Job Function)
          JobFunction: "100322",
        },
        "CM": {
          //CM_Authority1(Seniority)
          Seniority: "100288",
          //CM_Authority2(Job Function)
          JobFunction: "100325",
        },
        "CLS": {
          //CLS_Authority1(Seniority)
          Seniority: "100289",
          //CLS_Authority2(Job Function)
          JobFunction: "100327",
        },
        "Solution": {
          //Solution_Authority1(Seniority)
          Seniority: "100228",
          //Solution_Authority2(Job Function)
          JobFunction: "100321",
        },
        "Kitchen Solution": {
          //Kitchen Solution_Authority1(Seniority)
          Seniority: "100407",
          //Kitchen Solution_Authority2(Job Function)
          JobFunction: "100408",
        }
      };
      //businessUnit과 field에 대한 매핑 가져오기
      const BU = BU_FieldValues[businessUnit];
      if (BU && BU[field]) {
        return this.getFieldValueById(contact, BU[field]);
      } else {
        return "";
      }
    }else{
      return "";
    }

    // switch (businessUnit) {
    //   case "AS":
    //     switch (field){
    //       case "Seniority":
    //         return this.getFieldValueById(contact, "100035"); // AS
    //       case "Job Function":
    //         return this.getFieldValueById(contact, "100035"); // AS
    //     }
    //     break;
    //   case "IT":
    //     switch (field){
    //       case "Seniority":
    //         return this.getFieldValueById(contact, "100035"); // AS
    //       case "Job Function":
    //         return this.getFieldValueById(contact, "100035"); // AS
    //     }
    //     break;
    //   case "ID":
    //     switch (field){
    //       case "Seniority":
    //         return this.getFieldValueById(contact, "100035"); // AS
    //       case "Job Function":
    //         return this.getFieldValueById(contact, "100035"); // AS
    //     }
    //     break;
    //   case "CM":
    //     switch (field){
    //       case "Seniority":
    //         return this.getFieldValueById(contact, "100035"); // AS
    //       case "Job Function":
    //         return this.getFieldValueById(contact, "100035"); // AS
    //     }
    //     break;
    //   case "CLS":
    //     switch (field){
    //       case "Seniority":
    //         return this.getFieldValueById(contact, "100035"); // AS
    //       case "Job Function":
    //         return this.getFieldValueById(contact, "100035"); // AS
    //     }
    //     break;
    //   case "Solution":
    //     switch (field){
    //       case "Seniority":
    //         return this.getFieldValueById(contact, "100035"); // AS
    //       case "Job Function":
    //         return this.getFieldValueById(contact, "100035"); // AS
    //     }
    //     break;
    //   case "Kitchen Solution":
    //     switch (field){
    //       case "Seniority":
    //         return this.getFieldValueById(contact, "100035"); // AS
    //       case "Job Function":
    //         return this.getFieldValueById(contact, "100035"); // AS
    //     }
    //     break;
    //   default:
    //     return "";
    // }
  }
}

export interface CustomObjectData {
  type: string;
  id: string;
  createdAt: string;
  depth: string;
  name: string;
  updatedAt: string;
  contactId: string;
  customObjectRecordStatus: string;
  fieldValues: {
    type: string;
    id: string;
    value?: any;
  }[];
  isMapped: string;
  uniqueCode: string;
}

export class SendContactData {
  LGCompanyDivision: string;
  SourceSystemDivision: string;
  SourceSystemKey1: string;
  UID: string;
  Email: string;
  LastName: string;
  FirstName: string;
  PhoneNumber: string;
  MobilePhone: string;
  Region: string;
  Zip: string;
  Title: string;
  JobRole: string;
  JobTitle: string;
  Department: string;
  AccountName: string;
  AccountUID: string;
  CountryCode: string;
  Attribute1: string;
  Attribute2: string;
  Attribute3: string;
  Attribute4: string;
  Attribute5: string;
  PrivacyPolicyAgreement: string;
  PrivacyPolicyAgreementLastDate: string;
  ThirdPartyAgreement: string;
  ThirdPartyAgreementLastDate: string;
  TransferThirdCountriesAgreement: string;
  TransferThirdCountriesAgreementLastDate: string;
  MarketingAgreement: string;
  MarketingAgreementLastDate : string;
  SrcModifyDate: string;
  SrcModifierId: string;
  SrcModifierName: string;
  SrcCreationDate: string;
  SrcCreatorId: string;
  SrcCreatorName: string;

  constructor(customObjectData: CustomObjectData) {
      this.LGCompanyDivision = "EKHQ";
      this.SourceSystemDivision = "Eloqua";
      this.SourceSystemKey1 = customObjectData.contactId+'-'+customObjectData.id;
      this.Email = customObjectData.name;
      this.UID =  this.getFieldValueById(customObjectData, "3280"); //Contact UID
      this.LastName = this.getFieldValueById(customObjectData, "2943"); //Last Name
      this.FirstName = this.getFieldValueById(customObjectData, "2942"); //First Name
      this.PhoneNumber = this.getFieldValueById(customObjectData, "3149"); //Mobile Phone
      this.MobilePhone = this.getFieldValueById(customObjectData, "3148"); //Business Phone
      this.Region = this.getFieldValueById(customObjectData, "3286"); //Region
      this.Zip = this.getFieldValueById(customObjectData, "3161"); //Zip or Postal Code
      this.Title = this.getFieldValueById(customObjectData, "3150"); //BU별 Seniority
      this.JobRole = this.getFieldValueById(customObjectData, "3156"); //BU별 Job Function
      this.JobTitle = this.getFieldValueById(customObjectData, "3157"); //Job Title
      this.Department = this.getFieldValueById(customObjectData, "3151"); //Department
      this.AccountName = this.getFieldValueById(customObjectData, "2944"); //Company
      this.AccountUID = this.getFieldValueById(customObjectData, "2937"); //Account UID
      this.CountryCode = this.getFieldValueById(customObjectData, "2939"); //국가코드
      this.Attribute1 = this.getFieldValueById(customObjectData, "3147"); //First Name and Last Name => 고객 Full Name
      this.Attribute2 = this.getFieldValueById(customObjectData, "3155"); //City => 고객이 거주하는 도시
      this.Attribute3 = this.getFieldValueById(customObjectData, "3154"); //Marketing Event=> 고객이 가장 최근에 진행한 Eloqua 캠페인 활동
      this.Attribute4 = this.formatUnixTimestamp(this.getFieldValueById(customObjectData, "3167"));  //Date Created => Eloqua 데이터 생성일자
      this.Attribute5 = this.formatUnixTimestamp(this.getFieldValueById(customObjectData, "3166")); //Date Modified => Eloqua 데이터 수정일자
      //개인정보동의여부
      this.PrivacyPolicyAgreement = this.getFieldValueById(customObjectData, "3159"); //PrivacyPolicyAgreement
      this.PrivacyPolicyAgreementLastDate = this.formatUnixTimestamp(this.getFieldValueById(customObjectData, "3282")); //PrivacyPolicyAgreementLastDat
      //제3자이용동의여부
      this.ThirdPartyAgreement = this.getFieldValueById(customObjectData, "3281"); //ThirdPartyAgreement
      this.ThirdPartyAgreementLastDate = this.formatUnixTimestamp(this.getFieldValueById(customObjectData, "3283")); //ThirdPartyAgreementLastDate
      //제3국이전동의여부
      this.TransferThirdCountriesAgreement = this.getFieldValueById(customObjectData, "3160"); //TransferThirdCountriesAgreement
      this.TransferThirdCountriesAgreementLastDate = this.formatUnixTimestamp(this.getFieldValueById(customObjectData, "3284")); //TransferThirdCountriesAgreementLastDate
      //마케팅동의여부
      this.MarketingAgreement = this.getFieldValueById(customObjectData, "3158"); //MarketingAgreement
      this.MarketingAgreementLastDate = this.formatUnixTimestamp(this.getFieldValueById(customObjectData, "3285")); //MarketingAgreementLastDate

      this.SrcModifyDate = utils.getTodayWithTime();
      this.SrcModifierId = "ELOQUA"
      this.SrcModifierName = "Eloqua to 통합DB 데이터 연동";
      this.SrcCreationDate = utils.getTodayWithTime();
      this.SrcCreatorId = "ELOQUA"
      this.SrcCreatorName = "Eloqua to 통합DB 데이터 연동";
  }

  private getFieldValueById(customObjectData: CustomObjectData, id: string): string {
    const fieldValue = customObjectData.fieldValues.find((fv) => fv.id === id);
    return fieldValue ? fieldValue.value : "";
  }

  private formatUnixTimestamp(unixTimestamp:any): string {
    if (!unixTimestamp) return "";
    const date = new Date(parseInt(unixTimestamp) * 1000);
    return date.toISOString().slice(0, 10); // yyyy-mm-dd 형식으로 변환
  }

}

// interface SendContactData {
//   LGCompanyDivision: string;
//   SourceSystemDivision: string;
//   SourceSystemKey1: string;
//   Email: string;
//   LastName: string;
//   FirstName: string;
//   PhoneNumber: string;
//   MobilePhone: string;
//   Zip: string;
//   JobRole: string;
//   JobTitle: string;
//   Department: string;
//   AccountName: string;
//   AccountUID: string;
//   CountryCode: string;
//   Attribute1: string; //First Name and Last Name => 고객 Full Name
//   Attribute2: string; //City => 고객이 거주하는 도시
//   Attribute3: string; //Marketing Event=> 고객이 가장 최근에 진행한 Eloqua 캠페인 활동
//   Attribute4: string; //Date Created => Eloqua 데이터 생성일자
//   Attribute5: string; //Date Modified => Eloqua 데이터 수정일자
//   PrivacyPolicyAgreement: string;
//   ThirdPartyAgreement: string;
//   TransferThirdCountriesAgreement: string;
//   MarketingAgreement: string;
//   SrcModifyDate: string;
//   SrcModifierId: string;
//   SrcModifierName: string;
//   SrcCreationDate: string;
//   SrcCreatorId: string;
//   SrcCreatorName: string;
// }

// export interface SendContactDataWrapper {
//   Contact: SendContactData[];
// } 