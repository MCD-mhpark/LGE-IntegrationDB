"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const debug_1 = require("debug");
const events_1 = require("events");
const _ = require("lodash");
const account_1 = require("./account");
const bulk_1 = require("./bulk");
const contact_1 = require("./contact");
const errors_1 = require("./errors");
const debug = (0, debug_1.default)('eloqua:client');
class EloquaClient extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.qs = {};
        this.auth = { username: undefined, password: undefined };
        this.setAuth(options);
        // this.setOAuth(options)
        this.loginUrl = options.loginUrl || 'https://login.eloqua.com/id';
        this.baseUrl = options.baseUrl;
        // this.apiTimeout = options.timeout || API_TIMEOUT
        this.apiCalls = 0;
        this.on('apiCall', (params) => {
            debug('apiCall', params);
            this.apiCalls += 1;
        });
        this.accounts = new account_1.default(this);
        this.contacts = new contact_1.default(this);
        this.bulk = new bulk_1.default(this);
    }
    setAuth(options) {
        if (!options.siteName) {
            throw new Error('A siteName needs to be provided');
        }
        else if (!options.userName) {
            throw new Error('A userName needs to be provided');
        }
        else if (!options.password) {
            throw new Error('A password needs to be provided');
        }
        this.auth = {
            username: `${options.siteName}\\${options.userName}`,
            password: `${options.password}`,
        };
    }
    // tslint:disable-next-line: function-name
    async _init() {
        if (this.baseUrl) {
            return this.baseUrl;
        }
        this.baseUrl = await this.getBaseUrl();
    }
    async getBaseUrl() {
        // disable certificate checks - was getting inconsistent certificate results with this call
        // const agent = new https.Agent({ rejectUnauthorized: false })
        const params = {
            url: this.loginUrl,
            auth: this.auth,
            // httpsAgent: agent,
        };
        
        const response = await (0, axios_1.default)(params);
        const { data = {} } = response;
        const { urls = {} } = data;
        if (urls.base) {
            return urls.base;
        }
        throw new Error('Error obtaining baseUrl');
    }
    // tslint:disable-next-line: function-name
    async _request(opts) {
        const params = _.cloneDeep(opts);
        if (this.auth) {
            params.auth = this.auth;
        }
        // params.json = true
        if (!this.baseUrl) {
            // if a baseUrl is provided or we're calling the login url, skip this
            await this._init();
        }
        params.baseURL = this.baseUrl;
        try {
            this.emit('apiCall', params);
            const response = await (0, axios_1.default)(params);
            const { data = {} } = response;
            return data;
        }
        catch (err) {
            throw new errors_1.default(err);
        }
    }
}
exports.default = EloquaClient;
//# sourceMappingURL=client.js.map