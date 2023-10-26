export interface ILgToken {
    grant_type: string,
    username: string,
    password: string,
    client_id: string,
    client_secret: string
}

export interface ICompanyData {
    countryCode: string, 
    bizRegNo? : string, 
    dunsNo? : string, 
    taxId? : string
}


export interface IresAccountRegister {
    timestamp: string;
    result: string;
    path: string;
    message: string;
}

export interface IreqAccountRegister {
    Account: {
      Country: string;
      AccountName?: string;
      LGCompanyDivision: string;
      SourceSystemKey1: string;
      SourceSystemDivision: string;
      CompanyRegistrationNumber?: string;
      TaxId?: string;
      DunsNumber?: string;
    }[];
} 

export function convertRegion(region: string): string {
    const RegionMap: { [key: string]: string } = {
        "Asia": "AS",
        "CIS": "AS",
        "Europe": "EU",
        "India": "AS",
        "Latin America and the Caribbean": "SA",
        "Middle East & Africa": "AF",
        "North America": "NA",
        "N/A": ""
    }
    const mappedRegion = RegionMap[region];    
    if (mappedRegion === undefined) {
        return "";
    }
    return mappedRegion;

}

export function convertCountry(country: string): string {
    const countryMap: { [key: string]: string } = {
        "Afghanistan": "AF",
        "Albania": "AL",
        "Algeria": "DZ",
        "Angola": "AO",
        "Anguilla": "AI",
        "Antigua and Barbuda": "AG",
        "Antigua": "AG",
        "Argentina": "AR",
        "Armenia": "AM",
        "Aruba": "AW",
        "Australia": "AU",
        "Austria": "AT",
        "Azerbaijan": "AZ",
        "Bahamas": "BS",
        "Bahrain": "BH",
        "Bangladesh": "BD",
        "Barbados": "BB",
        "Belarus": "BY",
        "Belgium": "BE",
        "Belize": "BZ",
        "Benin": "BJ",
        "Bermuda": "BM",
        "Bolivia": "BO",
        "Bosnia and Herzegovina": "BA",
        "Botswana": "BW",
        "Brazil": "BR",
        "British Virgin Islands": "VG",
        "Brunei": "BN",
        "Bulgaria": "BG",
        "Burkina Faso": "BF",
        "Cambodia": "KH",
        "Cameroon": "CM",
        "Canada": "CA",
        "Cayman Islands": "KY",
        "Central African Republic": "CF",
        "Chile": "CL",
        "China": "CN",
        "Colombia": "CO",
        "Congo": "CG",
        "Costa Rica": "CR",
        "Cote d'Ivoire": "CI",
        "Croatia": "HR",
        "Cuba": "CU",
        "Curaçao": "CW",
        "Cyprus": "CY",
        "Czech": "CZ",
        "Democratic Republic of the Congo": "CD",
        "Denmark": "DK",
        "Djibouti": "DJ",
        "Dominican Republic": "DO",
        "Ecuador": "EC",
        "Egypt": "EG",
        "El Salvador": "SV",
        "Equatorial Guinea": "GQ",
        "Eritrea": "ER",
        "Estonia": "EE",
        "Ethiopia": "ET",
        "Fiji": "FJ",
        "Finland": "FI",
        "France": "FR",
        "Gabon": "GA",
        "Gambia": "GM",
        "Georgia": "GE",
        "Germany": "DE",
        "Ghana": "GH",
        "Greece": "GR",
        "Grenada": "GD",
        "Guatemala": "GT",
        "Guinea": "GN",
        "Guyana": "GY",
        "Haiti": "HT",
        "Honduras": "HN",
        "Hong Kong": "HK",
        "Hungary": "HU",
        "Iceland": "IS",
        "India": "IN",
        "Indonesia": "ID",
        "Iran": "IR",
        "Iraq": "IQ",
        "Ireland": "IE",
        "Isle of Man": "IM",
        "Israel": "IL",
        "Italy": "IT",
        "Ivory Coast": "CI",
        "Jamaica": "JM",
        "Japan": "JP",
        "Jordan": "JO",
        "Kazakhstan": "KZ",
        "Kenya": "KE",
        "Kosovo": "MK",
        "Kuwait": "KW",
        "Laos": "LA",
        "Latvia": "LV",
        "Lebanon": "LB",
        "Liberia": "LR",
        "Libya": "LY",
        "Lithuania": "LT",
        "Luxembourg": "LU",
        "Macedonia": "MK",
        "Malawi": "MW",
        "Malaysia": "MY",
        "Maldives": "MV",
        "Mali": "ML",
        "Malta": "MT",
        "Mauritania": "MR",
        "Mauritius": "MU",
        "Mexico": "MX",
        "Mongolia": "MN",
        "Montenegro": "ME",
        "Morocco": "MA",
        "Mozambique": "MZ",
        "Myanmar": "MM",
        "Namibia": "NA",
        "Nepal": "NP",
        "Netherlands Antilles": "AN",
        "Netherlands": "NL",
        "New Zealand": "NZ",
        "Nicaragua": "NI",
        "Nigeria": "NG",
        "Norway": "NO",
        "Oman": "OM",
        "Pakistan": "PK",
        "Palestine": "PS",
        "Panama": "PA",
        "Papua New Guinea": "PG",
        "Paraguay": "PY",
        "Peru": "PE",
        "Philippines": "PH",
        "Poland": "PL",
        "Portugal": "PT",
        "Puerto Rico": "PR",
        "Qatar": "QA",
        "Romania": "RO",
        "Russia": "RU",
        "Rwanda": "RW",
        "Saint Kitts and Nevis": "KN",
        "Saint Lucia": "LC",
        "Sao Tome and Principe": "ST",
        "Saudi Arabia": "SA",
        "Senegal": "SN",
        "Serbia": "RS",
        "Seychelles": "SC",
        "Sierra Leone": "SL",
        "Singapore": "SG",
        "Slovakia": "SK",
        "Slovenia": "SI",
        "Somalia": "SO",
        "South Africa": "ZA",
        "South Korea": "KR",
        "Spain": "ES",
        "Sri Lanka": "LK",
        "St Kitts": "KN",
        "St Maarten": "MF",
        "St Vincent": "VC",
        "Sudan": "SD",
        "Suriname": "SR",
        "Swaziland": "SZ",
        "Sweden": "SE",
        "Switzerland": "CH",
        "Syria": "SY",
        "Taiwan": "TW",
        "Thailand": "TH",
        "Togo": "TG",
        "Trinidad and Tobago": "TT",
        "Tunisia": "TN",
        "Türkiye": "TR",
        "Turkmenistan": "TM",
        "Turks and Caicos Islands": "TC",
        "U.A.E": "AE",
        "Uganda": "UG",
        "Ukraine": "UA",
        "United Kingdom": "GB",
        "United Republic of Tanzania": "TZ",
        "United States": "US",
        "Uruguay": "UY",
        "US Virgin Islands": "VI",
        "Uzbekistan": "UZ",
        "Venezuela": "VE",
        "Vietnam": "VN",
        "Yemen": "YE",
        "Zambia": "ZM",
        "Zimbabwe": "ZW"
    };

    const mappedCountry = countryMap[country];    
    if (mappedCountry === undefined) {
        return "";
    }
    return mappedCountry;
}

export interface IAccountReq {
    LGCompanyDivision: string;
    SourceSystemDivision: string;
    perCount: number;
    nowPage: number;
    baseDate: string;
}

export interface IAccountRes {
    totalPage: number | null;
    totalCount: number | null;
    resultCount: number | null;
    result: {
        Account: any;
    };
    perCount: number | null;
    nowPage: number | null;
    message: string;
}
