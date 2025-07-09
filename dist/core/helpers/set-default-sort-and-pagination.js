"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultSortAndPaginationIfNotExist = setDefaultSortAndPaginationIfNotExist;
const query_pagination_sorting_validation_middleware_1 = require("../middlewares/validation/query-pagination-sorting.validation-middleware");
function setDefaultSortAndPaginationIfNotExist(query) {
    var _a;
    return Object.assign(Object.assign(Object.assign({}, query_pagination_sorting_validation_middleware_1.paginationAndSortingDefault), query), { sortBy: ((_a = query.sortBy) !== null && _a !== void 0 ? _a : query_pagination_sorting_validation_middleware_1.paginationAndSortingDefault.sortBy) });
}
