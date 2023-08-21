import { lge_eloqua, lgeSdk_eloqua } from '@src/routes/Auth';
import { IReqContact } from "@src/models/ContactDTO";

const modified_Contact = async(queryString: IReqContact): Promise<any> => {

    await lge_eloqua.contacts.getAll(queryString).then((result: any) => {
        console.log(result.elements);
        return result.elements
    }).catch((err: any) => {
        return err
    });
    
}

export default {
    modified_Contact
}

