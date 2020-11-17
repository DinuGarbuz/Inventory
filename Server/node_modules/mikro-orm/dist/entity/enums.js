"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReferenceType;
(function (ReferenceType) {
    ReferenceType["SCALAR"] = "scalar";
    ReferenceType["ONE_TO_ONE"] = "1:1";
    ReferenceType["ONE_TO_MANY"] = "1:m";
    ReferenceType["MANY_TO_ONE"] = "m:1";
    ReferenceType["MANY_TO_MANY"] = "m:n";
})(ReferenceType = exports.ReferenceType || (exports.ReferenceType = {}));
var Cascade;
(function (Cascade) {
    Cascade["PERSIST"] = "persist";
    Cascade["MERGE"] = "merge";
    Cascade["REMOVE"] = "remove";
    Cascade["ALL"] = "all";
})(Cascade = exports.Cascade || (exports.Cascade = {}));
