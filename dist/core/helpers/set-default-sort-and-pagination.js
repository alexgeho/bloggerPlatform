"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultSortAndPaginationIfNotExist = setDefaultSortAndPaginationIfNotExist;
const query_pagination_sorting_validation_middleware_1 = require("../middlewares/validation/query-pagination-sorting.validation-middleware");
function setDefaultSortAndPaginationIfNotExist(query) {
    var _a, _b, _c;
    return Object.assign(Object.assign(Object.assign({}, query_pagination_sorting_validation_middleware_1.paginationAndSortingDefault), query), { pageNumber: Number((_a = query.pageNumber) !== null && _a !== void 0 ? _a : query_pagination_sorting_validation_middleware_1.paginationAndSortingDefault.pageNumber), pageSize: Number((_b = query.pageSize) !== null && _b !== void 0 ? _b : query_pagination_sorting_validation_middleware_1.paginationAndSortingDefault.pageSize), sortBy: ((_c = query.sortBy) !== null && _c !== void 0 ? _c : query_pagination_sorting_validation_middleware_1.paginationAndSortingDefault.sortBy) });
}
