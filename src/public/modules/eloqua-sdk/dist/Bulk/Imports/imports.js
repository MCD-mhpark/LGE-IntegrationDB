'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _priorities = _interopRequireDefault(require("./priorities"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

class Imports {
  constructor(options) {
    Object.defineProperty(this, _parent, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldLooseBase(this, _parent)[_parent] = options;
    this.priorities = new _priorities.default(options);
  }

  get(querystring, cb) {
    let qs = {};

    if (querystring) {
      qs = _classPrivateFieldLooseBase(this, _parent)[_parent]._validate(['limit', 'links', 'offset', 'orderBy', 'q', 'totalResults'], querystring);
    }

    return _classPrivateFieldLooseBase(this, _parent)[_parent]._request({
      api: 'Bulk',
      uri: '/imports',
      qs: qs
    }, cb);
  }

  getData(cb) {
    return _classPrivateFieldLooseBase(this, _parent)[_parent]._request({
      api: 'Bulk',
      uri: '/imports/data'
    }, cb);
  }

}

exports.default = Imports;

var _parent = _classPrivateFieldLooseKey("parent");

module.exports = exports.default;
//# sourceMappingURL=imports.js.map
