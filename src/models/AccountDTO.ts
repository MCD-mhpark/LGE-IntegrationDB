
import * as utils from "@src/util/etc_function";

export interface SearchAccount {
    uID: string | undefined;
    companyName: string | undefined;
    result: string | undefined;
}

export interface Account {
    DUID: string; // UID
    CountryCode: string; // 국가
    BizNo: string; // 사업자 등록 번호
    TaxId: string; // TaxID
    DUNSNo: string; // Duns Number
    CompName: string; // Account 이름
    CompNameEng: string; // Account 영문이름
    CorpNo: string; // 법인등록번호
    Zip: string ; // 우편번호
    DetailAddr: string // 상세주소
    CEOName: string // 대표자명
    CEONameEng: string // 대표자명(영문)
    BizCondName: string // 업종 (Business sector)
    BizTypeName: string // 사업유형
    CompScale: string  // 중소기업 (company scale)
    CompTypeEn: string// 회사유형(영어)
    CompType: string  // 회사유형
    CreditDiv: string  //기업 신용등급 관련
    CreditRank: string //기업 신용등급 관련
    CriCompScale: string // 기업규모 (business scale)
    CriGrade: string // 기업등급
    EmpCount: number // 직원수
}


class FormFieldValue {
    constructor(public type: string, public id: string, public name: string, public value: any) {}
}

export class IEloquaAccount {
    id?: number;
    name: string;
    fieldValues: {
        id: string;
        value: string;
    }[];
    address1: string;
    postalCode: string;

    constructor(account: any, id?: number) {
        this.id = id;
        this.name = account.CompName;
        this.fieldValues = [
            { "id": "100424", "value": utils.matchFieldValues(account, "3780") },
            { "id": "100430", "value": utils.matchFieldValues(account, "3780") },
            { //CountryCode
                "id": "100459", "value": utils.matchFieldValues(account, "3781") },
            { //TaxId
                 "id": "100426", "value": utils.matchFieldValues(account, "3782") },
            { //BizNo 
                "id": "100428", "value": utils.matchFieldValues(account, "3787") },
            { //DUNSNo
                "id": "100438", "value":utils.matchFieldValues(account, "3786") },
            { //CorpNo
                "id": "100429", "value": utils.matchFieldValues(account, "3790") },
            { //CEOName
                "id": "100448", "value": utils.matchFieldValues(account, "3793") },
            { //CEONameEng
                "id": "100447", "value": utils.matchFieldValues(account, "3794") },
            { //CompType
                "id": "100452", "value": utils.matchFieldValues(account, "3799") },
            { //CompNameEng
                "id": "100453", "value": utils.matchFieldValues(account, "3789") },
            { //BizCondName
                "id": "100449", "value": utils.matchFieldValues(account, "3795") },
            { //BizTypeName
                "id": "100450", "value": utils.matchFieldValues(account, "3796") },
            { //CreditDiv
                "id": "100454", "value": utils.matchFieldValues(account, "3800") },
            { //CreditRank
                "id": "100455", "value": utils.matchFieldValues(account, "3801") },
            { //EmpCount
                "id": "100181", "value": utils.matchFieldValues(account, "3801") },
            { "id": "100457", "value": account.CriGrade },
            { "id": "100456", "value": account.CriCompScale },
            { "id": "100451", "value": account.CompScale }
        ];
        this.address1 = account.DetailAddr;
        this.postalCode = account.Zip;
    }
}

export class AccountForm {
    type: string;
    fieldValues: FormFieldValue[];

    constructor(account: any) {
        this.type = "FormData";
        this.fieldValues = [
            new FormFieldValue("FieldValue", "159226", "Account UID", account.DUID),
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

// export interface EloquaAccount {
//     type: string;
//     id: string;
//     createdAt: string;
//     depth: string;
//     description: string;
//     name: string;
//     updatedAt: string;
//     address1: string | undefined;
//     address2: string | undefined;
//     address3: string | undefined;
//     businessPhone: string | undefined;
//     city: string | undefined;
//     country: string | undefined;
//     postalCode: string | undefined;
//     province: string | undefined;
//     fieldValues: {
//         type: string;
//         id: string;
//         value?: string | undefined;
//     }[];
// }
