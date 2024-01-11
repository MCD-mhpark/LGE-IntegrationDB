//import EloquaApi from 'eloqua';
import EloquaApi from '../public/modules/eloqua/dist/client';
import EloquaSDkApi from '../public/modules/eloqua-sdk/dist/Eloqua';

export const lge_eloqua = new EloquaApi({
    siteName: 'LGElectronics',
    userName: 'Lg_api.B2b_global',
    password: 'QWert1234!@'
  });
 
  
const eloqua_config = {
    siteName: 'LGElectronics',
    userName: 'Lg_api.B2b_global',
    password: 'QWer1234!@'
  }
  
export const lgeSdk_eloqua = new EloquaSDkApi(eloqua_config);

