import { AxiosError } from 'axios';
export default class EloquaError extends Error {
    status: any;
    data: any;
    constructor(err: AxiosError);
}
