import { lge_eloqua, lgeSdk_eloqua } from '@src/routes/Auth';

// interface Account {
//     type: string;
//     id: string;
//     createdAt: string;
//     depth: string;
//     description: string;
//     name: string;
//     updatedAt: string;
//     fieldValues: any[];
// }

// interface AccountResponse {
//     elements: Account[];
//     page: number;
//     pageSize: number;
//     total: number;
// }

//Account Search
const integrationAccount = async (accountUID:string): Promise<any> => {

    try {
        const id = await searchAccount(accountUID);

        if(!id){
            console.log('없으니 create');
            
        }else{
            console.log('이미 있으니 update');

        }

    } catch (error) {
        console.error('에러가 발생');
        console.error(error);
        throw error;
    }
};

//Account Search
const searchAccount = async (accountUID:string): Promise<any> => {
   
    try {
        const options = {
            search: `M_Account_UID1='${accountUID}'`, //`name='3M'`
            depth: "Minimal" // id만 확인하면 되어서 최소 정보만 확인하면 됨
        };

        const sResult = await lge_eloqua.accounts.getAll(options);
        /*{
            elements: [
              {
                type: 'Account',
                id: '11',
                createdAt: '1643348137',
                depth: 'minimal',
                description: '',
                name: '3M',
                updatedAt: '1692751526',
                fieldValues: [Array]
              }
            ],
            page: 1,
            pageSize: 1000,
            total: 1
          }*/
        console.log(sResult.elements);
        return sResult.elements[0].id

    } catch (error) {
        console.error('에러가 발생');
        console.error(error);
        throw error;
    }
};

//Account CREATE
const createAccount = async(): Promise<any> => {
    try{
        let data = {
            "name": "TES2",
            "address1": "test",
            "address2": "test",
            "address3": "test",
            "businessPhone": "01000000000",
            "city": "seoul",
            "country": "korea",
            "postalCode": "postalCode",
            "province": "province"
        }
    
        const cResult = await lge_eloqua.accounts.create(data)
        return cResult;
    }catch(error){
        console.error('에러가 발생1');
        console.error(error);
        throw error;
    }    
}

//Account UPDATE
const updateAccount = async(): Promise<any> => {

    let data = {
        "name": "TES1",
        "address1": "test",
        "address2": "test",
        "address3": "test",
        "businessPhone": "01000000000",
        "city": "seoul",
        "country": "",
        "fieldValues": [
            {
                "type": "FieldValue",
                "id": "100170",
                "value": "100170 update"
            },
            {
                "type": "FieldValue",
                "id": "100181",
                "value": "100181"
            },
            {
                "type": "FieldValue",
                "id": "100182",
                "value": "100182"
            }
        ],
        "postalCode": "postalCode",
        "province": "province"
    }

    await lge_eloqua.accounts.update(data).then((result: any) => {
        console.log(result);
        return result.elements
    }).catch((err: any) => {
        return err
    });
    
}


export default {
    searchAccount,
    createAccount,
    updateAccount,
}



