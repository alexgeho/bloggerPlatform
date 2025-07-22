"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = asyncHandler;
/**
 * Оборачивает async-функцию в совместимую с Express сигнатуру
 */
function asyncHandler(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
}
//# sourceMappingURL=express-async-handler.js.map