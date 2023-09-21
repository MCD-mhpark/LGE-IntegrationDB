"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("debug");
const stream_1 = require("stream");
const debug = (0, debug_1.default)('eloqua:client');
class BulkStream extends stream_1.Readable {
    constructor(client, syncUri) {
        super({ objectMode: true });
        this.client = client;
        this.syncUri = syncUri;
        this.limit = 10000;
        this.offset = 0;
        this.count = 0;
        this.ended = false;
        this.connecting = false;
    }
    async fetchPage() {
        this.connecting = true; // set to connecting = true to prevent the stream to call _read multiple times
        debug('fetch', this.limit, this.offset);
        try {
            const results = await this.client.bulk.getSyncData(this.syncUri, this.limit, this.offset);
            const { hasMore, count, totalResults } = results;
            this.count = this.count + count;
            debug('results', count, this.count, totalResults, hasMore);
            if (hasMore) {
                this.offset = this.offset + this.limit;
            }
            else {
                this.ended = true;
            }
            this.connecting = false; // from there, we can fetch again
            results.items &&
                results.items.forEach((item) => {
                    this.push(item);
                });
            if (this.ended) {
                this.push(null);
            }
        }
        catch (err) {
            this.emit('error', err);
        }
    }
    // tslint:disable-next-line:function-name
    _read() {
        if (this.ended || this.connecting) {
            return;
        }
        this.fetchPage();
    }
}
exports.default = BulkStream;
//# sourceMappingURL=stream.js.map