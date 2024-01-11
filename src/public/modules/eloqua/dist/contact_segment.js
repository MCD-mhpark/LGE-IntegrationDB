"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Segment {
    constructor(client) {
        this.client = client;
    }
    getAll(options) {
        return this.client._request({
            method: 'GET',
            url: '/api/REST/2.0/assets/contact/segments',
            params: options,
        });
    }
    get(id, options) {
        return this.client._request({
            method: 'GET',
            url: `/api/REST/2.0/assets/contact/segment/${id}`,
            params: options,
        });
    }
    create(data) {
        return this.client._request({
            data,
            method: 'POST',
            url: '/api/REST/2.0/assets/contact/segment',
        });
    }
    update(id, data) {
        return this.client._request({
            data,
            method: 'PUT',
            url: `/api/REST/2.0/assets/contact/segment/${id}`,
        });
    }
    delete(id) {
        return this.client._request({
            method: 'DELETE',
            url: `/api/REST/2.0/assets/contact/segment/${id}`,
        });
    }
}
exports.default = Segment;
//# sourceMappingURL=contact_segment.js.map