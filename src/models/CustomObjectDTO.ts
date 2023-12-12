import { Account } from './AccountDTO';

export interface ICo {
    elements: CustomObjectData[];
    page: number;
    pageSize: number;
    total: number;
}

export interface CustomObjectData {
    type: string;
    id: string;
    createdAt: string;
    depth: string;
    name: string;
    updatedAt: string;
    customObjectRecordStatus: string;
    fieldValues: {
        type: string;
        id: string;
        value: string;
    }[];
    isMapped: string;
    uniqueCode: string;
}


/** 
*class
**/
export class IAccountCOD {
    type: string;
    fieldValues: {
        id: string;
        value: string | number;
    }[];

    constructor(account: Account) {
        this.type = "CustomObjectData";
        this.fieldValues = [
            { id: "3780", value: account.DUID },
            { id: "3781", value: account.CountryCode },
            { id: "3782", value: account.TaxId },
            { id: "3786", value: account.DUNSNo },
            { id: "3787", value: account.BizNo },
            { id: "3788", value: account.CompName },
            { id: "3789", value: account.CompNameEng },
            { id: "3790", value: account.CorpNo },
            { id: "3791", value: account.Zip },
            { id: "3792", value: account.DetailAddr },
            { id: "3793", value: account.CEOName },
            { id: "3794", value: account.CEONameEng },
            { id: "3795", value: account.BizCondName},
            { id: "3796", value: account.BizTypeName },
            { id: "3797", value: account.CompScale },
            { id: "3798", value: account.CompTypeEn },
            { id: "3799", value: account.CompType },
            { id: "3800", value: account.CreditDiv },
            { id: "3801", value: account.CreditRank },
            { id: "3802", value: account.CriCompScale },
            { id: "3803", value: account.CriGrade },
            { id: "3804", value: account.EmpCount },
            { id: "3805", value: this.getCurrentUnixTime().toString()}
        ];
    }

    private getCurrentUnixTime(): number {
        const currentDate = new Date();
        return Math.floor(currentDate.getTime() / 1000);
      }
}