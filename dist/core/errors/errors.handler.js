"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorsHandler = errorsHandler;
const repository_not_found_error_1 = require("./repository-not-found.error");
const http_statuses_1 = require("../types/http-statuses");
const input_validtion_result_middleware_1 = require("../middlewares/validation/input-validtion-result.middleware");
const domain_error_1 = require("./domain.error");
function errorsHandler(error, res) {
    if (error instanceof repository_not_found_error_1.RepositoryNotFoundError) {
        const httpStatus = http_statuses_1.HttpStatus.NotFound;
        res.status(httpStatus).send((0, input_validtion_result_middleware_1.createErrorMessages)([
            {
                status: httpStatus,
                detail: error.message,
            },
        ]));
        return;
    }
    if (error instanceof domain_error_1.DomainError) {
        const httpStatus = http_statuses_1.HttpStatus.UnprocessableEntity;
        res.status(httpStatus).send((0, input_validtion_result_middleware_1.createErrorMessages)([
            {
                status: httpStatus,
                source: error.source,
                detail: error.message,
                code: error.code,
            },
        ]));
        return;
    }
    res.status(http_statuses_1.HttpStatus.InternalServerError);
    return;
}
