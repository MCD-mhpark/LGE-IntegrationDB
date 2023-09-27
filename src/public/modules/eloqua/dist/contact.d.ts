import EloquaClient from './client';
export default class Contact {
    client: EloquaClient;
    fields: any;
    lists: any;
    segments: any;
    constructor(client: EloquaClient);
    get(id: number, options?: any): Promise<any>;
    getAll(options?: any): Promise<any>;
    getSegment(segmentId: number, options?: any): Promise<any>;
    update(id: number, data: any): Promise<any>;
    delete(id: number): Promise<any>;
    form_Create(id: number, data: any): Promise<any>;
    cod_Get(id: number, options?: any): Promise<any>;
    cod_Update(parentid: number, id: number, data: any): Promise<any>;
}
