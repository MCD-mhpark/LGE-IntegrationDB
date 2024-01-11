import { AccountProvideInfo } from '@src/api/interface/interfaceApi';
import * as utils from "@src/util/etc_function";
import {Account} from "@src/models/AccountDTO"

export interface ImportDefinitionRes {
  id: number;
  parentId: number;
  mapDataCardsCaseSensitiveMatch: boolean;
  name: string;
  fields: {}[];
  identifierFieldName: string;
  isSyncTriggeredOnImport: boolean;
  dataRetentionDuration: string;
  isUpdatingMultipleMatchedRecords: boolean;
  uri: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface ISyncRes {
  syncedInstanceUri: string;
  status: string;
  createdAt: string;
  createdBy: string;
  uri: string;
}

export interface ISyncCheckRes {
  syncedInstanceUri: string;
  syncStartedAt: string;
  syncEndedAt: string;
  status: string;
  createdAt: string;
  createdBy: string;
  uri: string;
}


/*
* class
*/
export class ImportDefCDO {
  name: string;
  fields: Record<string, string>;
  identifierFieldName: string;
  isSyncTriggeredOnImport: boolean;
  dataRetentionDuration: string;

  constructor() {
    this.name = "통합DB_Account_History CDO Import";
    this.fields = {
      ID: "{{CustomObject[462].ExternalId}}",
      Account_UID1: "{{CustomObject[462].Field[3780]}}",
      Company_Country_Code1: "{{CustomObject[462].Field[3781]}}",
      Tax_ID1: "{{CustomObject[462].Field[3782]}}",
      DUNS_Number1: "{{CustomObject[462].Field[3786]}}",
      Business_Registration_Number1: "{{CustomObject[462].Field[3787]}}",
      Company_Name1: "{{CustomObject[462].Field[3788]}}",
      Company_Name__Eng_1: "{{CustomObject[462].Field[3789]}}",
      Corporation_Registration_Number1: "{{CustomObject[462].Field[3790]}}",
      Zip_or_Postal_Code1: "{{CustomObject[462].Field[3791]}}",
      Address1: "{{CustomObject[462].Field[3792]}}",
      Representative_Name1: "{{CustomObject[462].Field[3793]}}",
      Representative_Name__Eng_1: "{{CustomObject[462].Field[3794]}}",
      Business_Sector1: "{{CustomObject[462].Field[3795]}}",
      Business_Type1: "{{CustomObject[462].Field[3796]}}",
      Company_Scale1: "{{CustomObject[462].Field[3797]}}",
      Company_Type__Eng_1: "{{CustomObject[462].Field[3798]}}",
      Company_Type1: "{{CustomObject[462].Field[3799]}}",
      Credit_Div1: "{{CustomObject[462].Field[3800]}}",
      Credit_Rank1: "{{CustomObject[462].Field[3801]}}",
      Business_Scale1: "{{CustomObject[462].Field[3802]}}",
      Business_Grade1: "{{CustomObject[462].Field[3803]}}",
      Employees1: "{{CustomObject[462].Field[3804]}}",
      _____1: "{{CustomObject[462].Field[3805]}}"
    };
    this.identifierFieldName = "ID";
    this.isSyncTriggeredOnImport = true;
    this.dataRetentionDuration = "PT1H";
  }
}

export class IAccountBulkCDO {
  ID: string;
  Account_UID1: string;
  Company_Country_Code1: string;
  Tax_ID1: string;
  DUNS_Number1: string;
  Business_Registration_Number1: string;
  Company_Name1: string;
  Company_Name__Eng_1: string;
  Corporation_Registration_Number1: string;
  Zip_or_Postal_Code1: string;
  Address1: string;
  Representative_Name1: string;
  Representative_Name__Eng_1: string;
  Business_Sector1: string; //BizCondName
  Business_Type1: string;
  Company_Scale1: string;
  Company_Type__Eng_1: string;
  Company_Type1: string;
  Credit_Div1: string;
  Credit_Rank1: string;
  Business_Scale1: string; //CriCompScale
  Business_Grade1: string; //CriGrade
  Employees1: string;
  _____1: string;

  constructor(data: AccountProvideInfo) {
    this.ID = "";
    this.Account_UID1 = data.DUID;
    this.Company_Country_Code1 = data.CountryCode;
    this.Tax_ID1 = data.TaxId;
    this.DUNS_Number1 = data.DUNSNo;
    this.Business_Registration_Number1 = data.BizNo;
    this.Company_Name1 = data.CompName;
    this.Company_Name__Eng_1 = data.CompNameEng;
    this.Corporation_Registration_Number1 = data.CorpNo;
    this.Zip_or_Postal_Code1 = data.Zip;
    this.Address1 = data.DetailAddr;
    this.Representative_Name1 = data.CEOName;
    this.Representative_Name__Eng_1 = data.CEONameEng;
    this.Business_Sector1 = data.BizCondName;
    this.Business_Type1 = data.BizTypeName;
    this.Company_Scale1 = data.CompScale;
    this.Company_Type1 = data.CompType;
    this.Company_Type__Eng_1 = data.CompTypeEn;
    this.Credit_Div1 = data.CreditDiv;
    this.Credit_Rank1 = data.CreditRank;
    this.Business_Scale1 = data.CriCompScale;
    this.Business_Grade1 = data.CriGrade;
    this.Employees1 = data.EmpCount;
    this._____1 = utils.getTodayWithTime();
  }

  // private getCurrentUnixTime(): number {
  //   const currentDate = new Date();
  //   return Math.floor(currentDate.getTime() / 1000);
  // }
}