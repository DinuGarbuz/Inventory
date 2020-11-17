"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractNamingStrategy {
    getClassName(file, separator = '-') {
        const name = file.split('.')[0];
        const ret = name.replace(new RegExp(`${separator}+(\\w)`, 'g'), m => m[1].toUpperCase());
        return ret.charAt(0).toUpperCase() + ret.slice(1);
    }
}
exports.AbstractNamingStrategy = AbstractNamingStrategy;
