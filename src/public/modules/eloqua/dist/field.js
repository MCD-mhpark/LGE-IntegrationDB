"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Properties {
    constructor(client, objectName) {
        this.client = client;
        this.objectName = objectName;
    }
    getAll(options) {
        return this.client._request({
            method: 'GET',
            url: `/api/REST/1.0/assets/${this.objectName}/fields`,
            params: options,
        });
    }
    get(id, options) {
        return this.client._request({
            method: 'GET',
            url: `/api/REST/1.0/assets/${this.objectName}/field/${id}`,
            params: options,
        });
    }
    create(data) {
        return this.client._request({
            data,
            method: 'POST',
            url: `/api/REST/1.0/assets/${this.objectName}/field`,
        });
    }
    update(id, data) {
        return this.client._request({
            data,
            method: 'PUT',
            url: `/api/REST/1.0/assets/${this.objectName}/field/${id}`,
        });
    }
    delete(id) {
        return this.client._request({
            method: 'DELETE',
            url: `/api/REST/1.0/assets/${this.objectName}/field/${id}`,
        });
    }
}
exports.default = Properties;
//# sourceMappingURL=field.js.map