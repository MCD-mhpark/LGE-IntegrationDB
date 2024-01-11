"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EloquaError extends Error {
    constructor(err) {
        const { response } = err;
        const { status, statusText, data } = response || {};
        const message = statusText || err.message;
        super(message);
        this.status = status;
        this.data = data;
    }
}
exports.default = EloquaError;
//# sourceMappingURL=errors.js.map