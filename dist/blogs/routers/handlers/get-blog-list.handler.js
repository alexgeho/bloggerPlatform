"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogListHandler = getBlogListHandler;
const blogs_service_1 = require("../../application/blogs.service");
const errors_handler_1 = require("../../../core/errors/errors.handler");
const map_to_driver_list_paginated_output_util_1 = require("../mappers/map-to-driver-list-paginated-output.util");
const set_default_sort_and_pagination_1 = require("../../../core/helpers/set-default-sort-and-pagination");
function getBlogListHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const queryInput = (0, set_default_sort_and_pagination_1.setDefaultSortAndPaginationIfNotExist)(req.query);
            const { items, totalCount } = yield blogs_service_1.blogsService.findMany(queryInput);
            const blogsListOutput = (0, map_to_driver_list_paginated_output_util_1.mapToBlogListPaginatedOutput)(items, {
                pageNumber: queryInput.pageNumber,
                pageSize: queryInput.pageSize,
                totalCount,
            });
            res.send(blogsListOutput);
        }
        catch (e) {
            (0, errors_handler_1.errorsHandler)(e, res);
        }
    });
}
