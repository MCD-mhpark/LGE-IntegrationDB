export interface EloquaAccount {
    type: string;
    id: string;
    createdAt: string;
    depth: string;
    description: string;
    name: string;
    updatedAt: string;
    address1: string | undefined;
    address2: string | undefined;
    address3: string | undefined;
    businessPhone: string | undefined;
    city: string | undefined;
    country: string | undefined;
    postalCode: string | undefined;
    province: string | undefined;
    fieldValues: {
        type: string;
        id: string;
        value?: string | undefined;
    }[];
}

export interface SearchAccount {
    uID: string | undefined;
    companyName: string | undefined;
    result: string | undefined;
}

export interface Account {
    UID: string; // UID
    CountryCode: string; // 국가
    BizNo: string | null; // 사업자 등록 번호
    TaxId: string | null; // TaxID
    DUNSNo: string | null; // Duns Number
    CompName: string | null; // Account 이름
    CompNameEng: string | null; // Account 영문이름
    CorpNo: string | null; // 법인등록번호
    Zip: string | null; // 우편번호
    DetailAddr: string | null // 상세주소
    CEOName: string | null // 대표자명
    CEONameEng: string | null // 대표자명(영문)
    BizCondName: string | null // 업종
    BizTypeName: string | null // 사업유형
    CompScale: string | null  // 중소기업
    CompTypeEn: string | null // 회사유형(영어)
    CompType: string | null // 회사유형
    CreditDiv: string | null //기업 신용등급 관련
    CreditRank: string | null //기업 신용등급 관련
    CriCompScale: string | null // 기업규모
    CriGrade: string | null // 기업등급
    EmpCount: number | null // 직원수
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
            new FormFieldValue("FieldValue", "159229", "TaxID", account.TaxId),
            new FormFieldValue("FieldValue", "159230", "DUNSNo", account.DUNSNo),
            new FormFieldValue("FieldValue", "159228", "BizNo", account.BizNo),
            new FormFieldValue("FieldValue", "159231", "CompName", account.CompName),
            new FormFieldValue("FieldValue", "159232", "CompNameEng", account.CompNameEng),
            new FormFieldValue("FieldValue", "159233", "Zip", account.Zip),
            new FormFieldValue("FieldValue", "159234", "CorpNo", account.CorpNo),
            new FormFieldValue("FieldValue", "159235", "DetailAddr", account.DetailAddr),
            new FormFieldValue("FieldValue", "162601", "Representative Name", account.CEOName),
            new FormFieldValue("FieldValue", "162602", "Representative Name (Eng)", account.CEONameEng),
            new FormFieldValue("FieldValue", "162603", "Business Sector", account.BizCondName),
            new FormFieldValue("FieldValue", "162604", "Business Type", account.BizTypeName),
            new FormFieldValue("FieldValue", "162605", "Company Scale", account.CompScale),
            new FormFieldValue("FieldValue", "162606", "Company Type (Eng)", account.CompTypeEn),
            new FormFieldValue("FieldValue", "162607", "Company Type", account.CompType),
            new FormFieldValue("FieldValue", "162608", "Credit Div", account.CreditDiv),
            new FormFieldValue("FieldValue", "162609", "Credit Rank", account.CreditRank),
            new FormFieldValue("FieldValue", "162610", "Business Scale", account.CriCompScale),
            new FormFieldValue("FieldValue", "162611", "Business Grade", account.CriGrade),
            new FormFieldValue("FieldValue", "162612", "Employees", account.EmpCount),
        ];
    }
}
