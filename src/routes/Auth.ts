//import EloquaApi from 'eloqua';
import EloquaApi from '../public/modules/eloqua/dist/client';
import EloquaSDkApi from '../public/modules/eloqua-sdk/dist/Eloqua';
import * as process from "process";

// @ts-ignore
export const lge_eloqua = new EloquaApi({
    siteName: process.env.LGE_SITE_NAME,
    userName: process.env.LGE_USER_NAME,
    password:  process.env.LGE_PASSWORD
  });
 
  
const eloqua_config = {
    siteName: process.env.LGE_SITE_NAME,
    userName: process.env.LGE_USER_NAME,
    password:  process.env.LGE_PASSWORD
  }
  
export const lgeSdk_eloqua = new EloquaSDkApi(eloqua_config);

