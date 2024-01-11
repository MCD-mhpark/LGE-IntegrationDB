import EloquaClient from './client';
import Stream from './stream';
export default class List {
    client: EloquaClient;
    constructor(client: EloquaClient);
    createExport(objectName: string, exportName: string, fields: any, filter: string): Promise<any>;
    def_CO_Imports(id: number, data:any): Promise<any>;
    co_Imports(syncsUrl: string, data:any): Promise<any>;
    createSync(exportUri: string): Promise<any>;
    checkSync(syncUri: string): Promise<any>;
    pollSync(syncUri: string): Promise<any>;
    getSyncData(syncUri: string, limit?: number, offset?: number): Promise<any>;
    completeExport(objectName: string, exportName: string, fields: any, filter: string): Promise<{
        syncUri: any;
        status: any;
    }>;
    runExport(objectName: string, exportName: string, fields: any, filter: string): Promise<any>;
    getExportStream(objectName: string, exportName: string, fields: any, filter: string): Promise<Stream>;
}
