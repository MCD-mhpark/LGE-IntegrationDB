export interface Account {
    UID: string; // UID
    CountryCode: string; // 국가
    BizNo: string | null; // 사업자 등록 번호
    TaxId: string | null; // TaxID
    DUNSNo: string | null; // Duns Number
    CompName: string | null; // Account 이름
    CompNameEng: string | null; // Account 영문이름
    Zip: string | null; // 우편번호
    CorpNo: string | null; // 법인등록번호
    DetailAddr: string | null // 상세주소
}

class FormFieldValue {
    constructor(public type: string, public id: string, public name: string, public value: any) {}
}

export class AccountForm {
    type: string;
    fieldValues: FormFieldValue[];

    constructor(account: Account) {
        this.type = "FormData";
        this.fieldValues = [
            new FormFieldValue("FieldValue", "159226", "Account UID", account.UID),
            new FormFieldValue("FieldValue", "159227", "CountryCode", account.CountryCode),
            new FormFieldValue("FieldValue", "159228", "BizNo", account.BizNo),
            new FormFieldValue("FieldValue", "159229", "TaxID", account.TaxId),
            new FormFieldValue("FieldValue", "159230", "DUNSNo", account.DUNSNo),
            new FormFieldValue("FieldValue", "159231", "CompName", account.CompName),
            new FormFieldValue("FieldValue", "159232", "CompNameEng", account.CompNameEng),
            new FormFieldValue("FieldValue", "159233", "Zip", account.Zip),
            new FormFieldValue("FieldValue", "159234", "CorpNo", account.CorpNo),
            new FormFieldValue("FieldValue", "159235", "DetailAddr", account.DetailAddr),
        ];
    }
}
