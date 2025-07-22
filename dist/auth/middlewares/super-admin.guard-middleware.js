"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.superAdminGuardMiddleware = exports.ADMIN_PASSWORD = exports.ADMIN_USERNAME = void 0;
var http_statuses_1 = require("../../core/types/http-statuses");
exports.ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
exports.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qwerty';
var superAdminGuardMiddleware = function (req, res, next) {
    console.log('=== TEST superAdminGuardMiddleware ===');
    var auth = req.headers['authorization']; // 'Basic xxxx'
    if (!auth) {
        res.sendStatus(http_statuses_1.HttpStatus.Unauthorized);
        return;
    }
    var _a = auth.split(' '), authType = _a[0], token = _a[1]; //admin:qwerty
    if (authType !== 'Basic') {
        res.sendStatus(http_statuses_1.HttpStatus.Unauthorized);
        return;
    }
    var credentials = Buffer.from(token, 'base64').toString('utf-8');
    var _b = credentials.split(':'), username = _b[0], password = _b[1];
    if (username !== exports.ADMIN_USERNAME || password !== exports.ADMIN_PASSWORD) {
        res.sendStatus(http_statuses_1.HttpStatus.Unauthorized);
        return;
    }
    next(); // Успешная авторизация, продолжаем
};
exports.superAdminGuardMiddleware = superAdminGuardMiddleware;
//# sourceMappingURL=super-admin.guard-middleware.js.map