'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _formData = _interopRequireDefault(require("./formData"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

class Forms {
  constructor(options) {
    Object.defineProperty(this, _parent, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldLooseBase(this, _parent)[_parent] = options;
    this.data = new _formData.default(_classPrivateFieldLooseBase(this, _parent)[_parent]);
  }

}

exports.default = Forms;

var _parent = _classPrivateFieldLooseKey("parent");

module.exports = exports.default;
//# sourceMappingURL=forms.js.map