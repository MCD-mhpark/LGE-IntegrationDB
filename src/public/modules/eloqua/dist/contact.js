"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const field_1 = require("./field");
const contact_list_1 = require("./contact_list");
const contact_segment_1 = require("./contact_segment");
class Contact {
    constructor(client) {
        this.client = client;
        this.fields = new field_1.default(this.client, 'contact');
        this.lists = new contact_list_1.default(this.client);
        this.segments = new contact_segment_1.default(this.client);
    }
    get(id, options) {
        return this.client._request({
            method: 'GET',
            url: `/api/REST/1.0/data/contact/${id}`,
            params: options,
        });
    }
    getAll(options) {
        return this.client._request({
            method: 'GET',
            url: '/api/REST/1.0/data/contacts',
            params: options,
        });
    }
    getSegment(segmentId, options) {
        return this.client._request({
            method: 'GET',
            url: `/api/REST/2.0/data/contacts/segment/${segmentId}`,
            // somehow, this call seems to be undocumented (https://community.oracle.com/thread/3900099)
            params: options,
        });
    }
    update(id, data) {
        return this.client._request({
            data,
            method: 'PUT',
            url: `/api/REST/1.0/data/contact/${id}`,
        });
    }
    delete(id) {
        return this.client._request({
            method: 'DELETE',
            url: `/api/REST/1.0/data/contact/${id}`,
        });
    }

    //GoldenPlanet Ver 1.0
    //form Data create
    form_Create(id, data) {
        return this.client._request({
            timeout: 0,
            method: 'POST',
            url: `/api/REST/2.0/data/form/${id}`,
            data,
        });
    }

    //CustomObject Data Search
    cod_Get(id, options) {
        return this.client._request({
            timeout: 0,
            method: 'GET',
            url: `/api/REST/2.0/data/customObject/${id}/instances`,
            params: options
        });
    }

    //CustomObject Data Search
    cod_Create(id, data) {
        return this.client._request({
            timeout: 0,
            method: 'POST',
            url: `/api/REST/2.0/data/customObject/${id}/instance`,
            data,
        });
    }

    //CustomObject Data update
    cod_Update(parentid, id, data) {
        return this.client._request({
            timeout: 0,
            method: 'PUT',
            url: `/api/REST/2.0/data/customObject/${parentid}/instance/${id}`,
            data,
        });
    }

}
exports.default = Contact;
//# sourceMappingURL=contact.js.map