"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var QueryType;
(function (QueryType) {
    QueryType["TRUNCATE"] = "TRUNCATE";
    QueryType["SELECT"] = "SELECT";
    QueryType["COUNT"] = "COUNT";
    QueryType["INSERT"] = "INSERT";
    QueryType["UPDATE"] = "UPDATE";
    QueryType["DELETE"] = "DELETE";
})(QueryType = exports.QueryType || (exports.QueryType = {}));
var QueryFlag;
(function (QueryFlag) {
    QueryFlag["DISTINCT"] = "DISTINCT";
})(QueryFlag = exports.QueryFlag || (exports.QueryFlag = {}));
var QueryOrder;
(function (QueryOrder) {
    QueryOrder["ASC"] = "ASC";
    QueryOrder["DESC"] = "DESC";
    QueryOrder["asc"] = "asc";
    QueryOrder["desc"] = "desc";
})(QueryOrder = exports.QueryOrder || (exports.QueryOrder = {}));
var QueryOrderNumeric;
(function (QueryOrderNumeric) {
    QueryOrderNumeric[QueryOrderNumeric["ASC"] = 1] = "ASC";
    QueryOrderNumeric[QueryOrderNumeric["DESC"] = -1] = "DESC";
})(QueryOrderNumeric = exports.QueryOrderNumeric || (exports.QueryOrderNumeric = {}));
