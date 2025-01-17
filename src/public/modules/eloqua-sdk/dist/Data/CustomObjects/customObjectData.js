'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = void 0;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

class CustomObjectData {
	constructor(options) {
		Object.defineProperty(this, _parent, {
			writable: true,
			value: void 0
		});
		_classPrivateFieldLooseBase(this, _parent)[_parent] = options;
	}


	get(parentId, querystring, cb) {
		let qs = {};

		if (querystring) {
			qs = _classPrivateFieldLooseBase(this, _parent)[_parent]._validate(['count', 'depth', 'lastUpdatedAt', 'orderBy', 'page', 'search', '?search'], querystring);
		}

		return _classPrivateFieldLooseBase(this, _parent)[_parent]._request({
			api: 'REST',
			uri: `/data/customObject/${parentId}/instances`,
			qs: qs
		}, cb);
	}

	getOne(parentId, id, querystring, cb) {
		let qs = {};

		if (querystring) {
			qs = _classPrivateFieldLooseBase(this, _parent)[_parent]._validate(['depth'], querystring);
		}

		return _classPrivateFieldLooseBase(this, _parent)[_parent]._request({
			api: 'REST',
			uri: `/data/customObject/${parentId}/instance/${id}`,
			qs: qs
		}, cb);
	}

	create(parentId, customObjectData, cb) {
		// const data = _classPrivateFieldLooseBase(this, _parent)[_parent]._validate(['contactId', 'createdAt', 'createdBy', 'currentStatus', 'customObjectRecordStatus', 'depth', 'description', 'fieldValues', 'folderId', 'id', 'name', 'permissions', 'scheduledFor', 'sourceTemplateId', 'type', 'uniqueCode', 'updatedAt', 'updatedBy'], customObjectData);
		const data = _classPrivateFieldLooseBase(this, _parent)[_parent]._validate(['accessedAt', 'accountId', 'contactId', 'createdAt', 'createdBy', 'currentStatus', 'customObjectRecordStatus', 'depth', 'description', 'fieldValues', 'folderId', 'id', 'name', 'permissions', 'scheduledFor', 'sourceTemplateId', 'type', 'uniqueCode', 'updatedAt', 'updatedBy'], customObjectData);
	
		return _classPrivateFieldLooseBase(this, _parent)[_parent]._request({
			api: 'REST',
			uri: `/data/customObject/${parentId}/instance`,
			method: 'post',
			data: data
		}, cb);
	}

	update(parentId, id, customObjectData, cb) {
		
		// const data = _classPrivateFieldLooseBase(this, _parent)[_parent]._validate(['contactId', 'createdAt', 'createdBy', 'currentStatus', 'customObjectRecordStatus', 'depth', 'description', 'fieldValues', 'folderId', 'id', 'name', 'permissions', 'scheduledFor', 'sourceTemplateId', 'type', 'uniqueCode', 'updatedAt', 'updatedBy'], customObjectData);
		const data = _classPrivateFieldLooseBase(this, _parent)[_parent]._validate(['accessedAt', 'accountId', 'contactId', 'createdAt', 'createdBy', 'currentStatus', 'customObjectRecordStatus', 'depth', 'description', 'fieldValues', 'folderId', 'id', 'name', 'permissions', 'scheduledFor', 'sourceTemplateId', 'type', 'uniqueCode', 'updatedAt', 'updatedBy'], customObjectData);

		return _classPrivateFieldLooseBase(this, _parent)[_parent]._request({
			api: 'REST',
			uri: `/data/customObject/${parentId}/instance/${id}`,
			method: 'put',
			data: data
		}, cb);
	}

	delete(parentId, id, cb) {
		return _classPrivateFieldLooseBase(this, _parent)[_parent]._request({
			api: 'REST',
			uri: `/data/customObject/${parentId}/instance/${id}`,
			method: 'delete'
		}, cb);
	}

}

exports.default = CustomObjectData;

var _parent = _classPrivateFieldLooseKey("parent");

module.exports = exports.default;
//# sourceMappingURL=customObjectData.js.map
