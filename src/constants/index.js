"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
var isProduction = process.env.NODE_ENV === 'production';
exports.isProduction = isProduction;
__export(require("./testrpc"));
