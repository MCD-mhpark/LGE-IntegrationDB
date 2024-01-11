/// <reference types="node" />
import { Readable } from 'stream';
export default class BulkStream extends Readable {
    client: any;
    syncUri: string;
    ended: boolean;
    connecting: boolean;
    limit: number;
    offset: number;
    count: 0;
    constructor(client: any, syncUri: string);
    fetchPage(): Promise<void>;
    _read(): void;
}
