"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultSortAndPaginationIfNotExist = setDefaultSortAndPaginationIfNotExist;
var query_pagination_sorting_validation_middleware_1 = require("../middlewares/validation/query-pagination-sorting.validation-middleware");
function setDefaultSortAndPaginationIfNotExist(query) {
    var _a, _b, _c;
    return __assign(__assign(__assign({}, query_pagination_sorting_validation_middleware_1.paginationAndSortingDefault), query), { pageNumber: Number((_a = query.pageNumber) !== null && _a !== void 0 ? _a : query_pagination_sorting_validation_middleware_1.paginationAndSortingDefault.pageNumber), pageSize: Number((_b = query.pageSize) !== null && _b !== void 0 ? _b : query_pagination_sorting_validation_middleware_1.paginationAndSortingDefault.pageSize), sortBy: ((_c = query.sortBy) !== null && _c !== void 0 ? _c : query_pagination_sorting_validation_middleware_1.paginationAndSortingDefault.sortBy) });
}
//# sourceMappingURL=set-default-sort-and-pagination.js.map