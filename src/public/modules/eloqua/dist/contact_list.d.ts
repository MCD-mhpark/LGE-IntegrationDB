import EloquaClient from './client';
export default class List {
    client: EloquaClient;
    constructor(client: EloquaClient);
    getAll(options?: any): Promise<any>;
    get(id: number, options?: any): Promise<any>;
    create(data: any): Promise<any>;
    update(id: number, data: any): Promise<any>;
    delete(id: number): Promise<any>;
}
