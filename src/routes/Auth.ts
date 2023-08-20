import EloquaApi from 'eloqua';
import EloquaSDkApi from '@src/public/modules/eloqua-sdk';

export const lge_eloqua = new EloquaApi({
    siteName: 'LGElectronics',
    userName: 'Lg_api.B2b_global',
    password: 'QWert1234!@'
  });

let b2bgerp_eloqua_config = {
  siteName: 'LGElectronics',
  userName: 'Lg_api.B2b_global',
  password: 'QWert1234!@'
}
export const lgeSdk_eloqua = new EloquaSDkApi(b2bgerp_eloqua_config);
  
  