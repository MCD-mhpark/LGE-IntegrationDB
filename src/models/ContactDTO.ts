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

  constructor(contact: any, updateContact:IUpdateContact) {
      this.type = "FormData";
      this.fieldValues = [
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
          new FormFieldValue("FieldValue", "163932", "Marketing Event", this.getFieldValueById(contact, "100203")),
          new FormFieldValue("FieldValue", "163936", "BU별 Job Function", this.getFieldValueBusinessType(contact, 'JobFunction')),
          new FormFieldValue("FieldValue", "163937", "Job Title", this.getFieldValueById(contact, "100292")),
          new FormFieldValue("FieldValue", "163938", "DirectMarketing_EM_TXT_SNS", this.getFieldValueById(contact, "100211")),
          new FormFieldValue("FieldValue", "163940", "TransferOutsideCountry", this.getFieldValueById(contact, "100210")),
          new FormFieldValue("FieldValue", "163939", "Privacy Policy_Agreed", this.getFieldValueById(contact, "100213")),
          new FormFieldValue("FieldValue", "158363", "Account UID", updateContact.uID),
          new FormFieldValue("FieldValue", "163941", "Zip or Postal Code", this.getFieldValueById(contact, "100011")),
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