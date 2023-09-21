"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const field_1 = require("./field");
class Contact {
    constructor(client) {
        this.client = client;
        this.fields = new field_1.default(this.client, 'account');
    }

    create(data) {
        return this.client._request({
            method: 'POST',
            url: '/api/REST/1.0/data/account',
            data,
        });
    }

    get(id, options) {
        return this.client._request({
            method: 'GET',
            url: `/api/REST/1.0/data/account/${id}`,
            params: options,
        });
    }
    getAll(options) {
        return this.client._request({
            method: 'GET',
            url: '/api/REST/1.0/data/accounts',
            params: options,
        });
    }
    update(id, data) {
        return this.client._request({
            data,
            method: 'PUT',
            url: `/api/REST/1.0/data/account/${id}`,
        });
    }
}
exports.default = Contact;
//# sourceMappingURL=account.js.map