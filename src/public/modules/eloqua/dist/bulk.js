"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("debug");
const stream_1 = require("./stream");
const debug = (0, debug_1.default)('eloqua:client');
class List {
    constructor(client) {
        this.client = client;
    }
    createExport(objectName, exportName, fields, filter) {
        return this.client._request({
            method: 'POST',
            url: `/api/bulk/2.0/${objectName}/exports`,
            data: {
                fields,
                filter,
                name: exportName,
                areSystemTimestampsInUTC: true,
            },
        });
    }
    createSync(exportUri) {
        return this.client._request({
            method: 'POST',
            url: '/api/bulk/2.0/syncs',
            data: { syncedInstanceUri: exportUri },
        });
    }
    checkSync(syncUri) {
        return this.client._request({
            method: 'GET',
            url: `/api/bulk/2.0${syncUri}`,
        });
    }
    async pollSync(syncUri) {
        const results = await this.checkSync(syncUri);
        const { status } = results;
        debug(status);
        if (['active', 'pending'].includes(status)) {
            await new Promise((resolve) => setTimeout(resolve, 10000));
            return this.pollSync(syncUri);
        }
        return results;
    }
    getSyncData(syncUri, limit = 1000, offset = 0) {
        return this.client._request({
            method: 'GET',
            url: `/api/bulk/2.0${syncUri}/data`,
            params: { limit, offset },
        });
    }
    async completeExport(objectName, exportName, fields, filter) {
        const bulkExport = await this.createExport(objectName, exportName, fields, filter);
        const sync = await this.createSync(bulkExport.uri);
        const syncUri = sync.uri;
        const results = await this.pollSync(syncUri);
        const { status } = results;
        return { syncUri, status };
    }
    async runExport(objectName, exportName, fields, filter) {
        const { status, syncUri } = await this.completeExport(objectName, exportName, fields, filter);
        if (status === 'success') {
            return this.getSyncData(syncUri);
        }
        return;
    }
    async getExportStream(objectName, exportName, fields, filter) {
        const { status, syncUri } = await this.completeExport(objectName, exportName, fields, filter);
        if (status === 'success') {
            return new stream_1.default(this.client, syncUri);
        }
        return;
    }
}
exports.default = List;
//# sourceMappingURL=bulk.js.map