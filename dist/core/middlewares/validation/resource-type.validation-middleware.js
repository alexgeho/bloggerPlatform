"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourceTypeValidation = resourceTypeValidation;
var express_validator_1 = require("express-validator");
function resourceTypeValidation(resourceType) {
    return (0, express_validator_1.body)('data.type')
        .isString()
        .equals(resourceType)
        .withMessage("Resource type must be ".concat(resourceType));
}
//# sourceMappingURL=resource-type.validation-middleware.js.map