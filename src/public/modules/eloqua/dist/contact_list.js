"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class List {
    constructor(client) {
        this.client = client;
    }
    getAll(options) {
        return this.client._request({
            method: 'GET',
            url: '/api/REST/1.0/assets/contact/lists',
            params: options,
        });
    }
    get(id, options) {
        return this.client._request({
            method: 'GET',
            url: `/api/REST/1.0/assets/contact/list/${id}`,
            params: options,
        });
    }
    create(data) {
        return this.client._request({
            data,
            method: 'POST',
            url: '/api/REST/1.0/assets/contact/list',
        });
    }
    update(id, data) {
        return this.client._request({
            data,
            method: 'PUT',
            url: `/api/REST/1.0/assets/contact/list/${id}`,
        });
    }
    delete(id) {
        return this.client._request({
            method: 'DELETE',
            url: `/api/REST/1.0/assets/contact/list/${id}`,
        });
    }
}
exports.default = List;
//# sourceMappingURL=contact_list.js.map