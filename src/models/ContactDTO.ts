import * as utils from "@src/util/etc_function";
import {convertCountry} from "@src/api/interface/interfaceApi"

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
          
          // 각 동의 항목별 KR, Global따라 매핑 되어야 하는 필드가 다름. //마지막 동의일자 폼필드 추가 필요
          new FormFieldValue("FieldValue", "163938", "DirectMarketing_EM_TXT_SNS", this.getFieldValueById(contact, "100211")),
          new FormFieldValue("FieldValue", "163940", "TransferOutsideCountry", this.getFieldValueById(contact, "100210")),
          new FormFieldValue("FieldValue", "163939", "Privacy Policy_Agreed", this.getFieldValueById(contact, "100213")),

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
  Email: string;
  LastName: string;
  FirstName: string;
  PhoneNumber: string;
  MobilePhone: string;
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
  //ThirdPartyAgreement: string;
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
      this.SourceSystemKey1 = customObjectData.contactId;
      this.Email = customObjectData.name;
      this.LastName = this.getFieldValueById(customObjectData, "2943"); //Last Name
      this.FirstName = this.getFieldValueById(customObjectData, "2942"); //First Name
      this.PhoneNumber = this.getFieldValueById(customObjectData, "3149"); //Mobile Phone
      this.MobilePhone = this.getFieldValueById(customObjectData, "3148"); //Business Phone
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
      this.PrivacyPolicyAgreement = this.getFieldValueById(customObjectData, "3159"); //Privacy Policy_Agreed
      this.PrivacyPolicyAgreementLastDate = "";
      //제3자이용동의여부
      //this.ThirdPartyAgreement = this.getFieldValueById(customObjectData, "");
      this.ThirdPartyAgreementLastDate = "";
      //제3국이전동의여부
      this.TransferThirdCountriesAgreement = this.getFieldValueById(customObjectData, "3160"); //TransferOutsideCountry
      this.TransferThirdCountriesAgreementLastDate = "";
      //마케팅동의여부
      this.MarketingAgreement = this.getFieldValueById(customObjectData, "3158"); //DirectMarketing_EM_TXT_SNS
      this.MarketingAgreementLastDate = "";

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