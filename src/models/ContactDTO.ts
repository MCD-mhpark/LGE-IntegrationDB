export interface IReqContact {
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