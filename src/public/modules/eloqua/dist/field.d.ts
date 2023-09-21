import EloquaClient from './client';
export default class Properties {
    client: EloquaClient;
    objectName: string;
    constructor(client: EloquaClient, objectName: string);
    getAll(options?: any): Promise<any>;
    get(id: number, options?: any): Promise<any>;
    create(data: any): Promise<any>;
    update(id: number, data: any): Promise<any>;
    delete(id: number): Promise<any>;
}
