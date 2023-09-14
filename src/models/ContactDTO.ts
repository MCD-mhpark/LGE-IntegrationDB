import * as utils from "@src/util/etc_function";

export interface IReqEloqua {
    search: string;
    depth: string;
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
  currentStatus: string;
  id: string;
  createdAt: string;
  depth: string;
  name: string;
  updatedAt: string;
  accountName: string;
  address1: string;
  address2: string;
  businessPhone: string;
  city: string;
  country: string;
  emailAddress: string;
  emailFormatPreference: string;
  fieldValues: FieldValue[];
  firstName: string;
  isBounceback: string;
  isSubscribed: string;
  lastName: string;
  mobilePhone: string;
  postalCode: string;
  subscriptionDate: string;

  constructor(data: any) {
      this.type = data.type;
      this.currentStatus = data.currentStatus;
      this.id = data.id;
      this.createdAt = data.createdAt;
      this.depth = data.depth;
      this.name = data.name;
      this.updatedAt = data.updatedAt;
      this.accountName = data.accountName;
      this.address1 = data.address1;
      this.address2 = data.address2;
      this.businessPhone = data.businessPhone;
      this.city = data.city;
      this.country = data.country;
      this.emailAddress = data.emailAddress;
      this.emailFormatPreference = data.emailFormatPreference;
      this.fieldValues = data.fieldValues.map((fv: any) => new FieldValue(fv.type, fv.id, fv.value));
      this.firstName = data.firstName;
      this.isBounceback = data.isBounceback;
      this.isSubscribed = data.isSubscribed;
      this.lastName = data.lastName;
      this.mobilePhone = data.mobilePhone;
      this.postalCode = data.postalCode;
      this.subscriptionDate = data.subscriptionDate;
  }
}


class FormFieldValue {
  constructor(public type: string, public id: string, public name: string, public value: any) {}
}

export class ContactForm {
  type: string;
  fieldValues: FormFieldValue[];

  constructor(contact: Contact) {
      this.type = "FormData";
      this.fieldValues = [
          //Last Name
          new FormFieldValue("FieldValue", "159226", "Account UID", contact.lastName),
          //First Name 
          new FormFieldValue("FieldValue", "159226", "Account UID", contact.firstName),
          //Full Name
          new FormFieldValue("FieldValue", "159226", "Account UID", this.getFieldValueById(contact, "100172")),
          //Business Phone
          new FormFieldValue("FieldValue", "159226", "Account UID", contact.businessPhone),
          //Mobile Phone
          new FormFieldValue("FieldValue", "159226", "Account UID", contact.mobilePhone),
          //Email Address
          new FormFieldValue("FieldValue", "159226", "Account UID", contact.emailAddress),
          //BU별 Seniority
          new FormFieldValue("FieldValue", "159226", "Account UID", contact.lastName),
          //Department
          new FormFieldValue("FieldValue", "159226", "Account UID", this.getFieldValueById(contact, "100238")),
          //Date Created
          new FormFieldValue("FieldValue", "159226", "Account UID", this.formatUnixTimestamp(contact.createdAt)),
          //Date Modified
          new FormFieldValue("FieldValue", "159226", "Account UID", this.formatUnixTimestamp(contact.updatedAt)),
          //Marketing Event
          new FormFieldValue("FieldValue", "159226", "Account UID", this.getFieldValueById(contact, "100203")),
          //Company Name
          new FormFieldValue("FieldValue", "159226", "Account UID", contact.accountName),
          //City
          new FormFieldValue("FieldValue", "159226", "Account UID", contact.city),

          new FormFieldValue("FieldValue", "159226", "Account UID", contact.lastName)
          // new FormFieldValue("FieldValue", "159226", "Account UID", contact.lastName)
          // new FormFieldValue("FieldValue", "159226", "Account UID", contact.lastName)
          // new FormFieldValue("FieldValue", "159226", "Account UID", contact.lastName)
          // new FormFieldValue("FieldValue", "159226", "Account UID", contact.lastName)
      ];
  }
  
  private getFieldValueById(contact: Contact, id: string): string | undefined {
    const fieldValue = contact.fieldValues.find((fv) => fv.id === id);
    return fieldValue ? fieldValue.value : undefined;
  }

  private formatUnixTimestamp(unixTimestamp:any): string {
    if (!unixTimestamp) return "";
    const date = new Date(parseInt(unixTimestamp) * 1000);
    return date.toISOString().slice(0, 10); // yyyy-mm-dd 형식으로 변환
  }


  //Business Unit
  private getFieldValueByType( contact:Contact, businessUnit:string, field:string ): string | undefined {
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
        Seniority: "100335",
        //CLS_Authority2(Job Function)
        JobFunction: "100435",
      },
      "Solution": {
        Seniority: "100335",
        JobFunction: "100435",
      },
      "Kitchen Solution": {
        Seniority: "100335",
        JobFunction: "100435",
      }
    };
    //businessUnit과 field에 대한 매핑 가져오기
    const BU = BU_FieldValues[businessUnit];
    if (BU && BU[field]) {
      return this.getFieldValueById(contact, BU[field]);
    } else {
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