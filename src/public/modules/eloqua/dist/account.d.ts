import EloquaClient from './client';
export default class Contact {
    client: EloquaClient;
    fields: any;
    lists: any;
    constructor(client: EloquaClient);
    get(id: number, options?: any): Promise<any>;
    getAll(options?: any): Promise<any>;
    update(id: number, data: any): Promise<any>;
}
