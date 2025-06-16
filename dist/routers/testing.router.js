"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const http_statuses_1 = require("../core/types/http-statuses");
const in_memory_db_1 = require("../db/in-memory.db");
exports.testingRouter = (0, express_1.Router)({});
exports.testingRouter
    .delete('/testing/all-data', (req, res) => {
    console.log('DELETE /testing/all-data called');
    in_memory_db_1.db.blogs.length = 0; // очищаем все блоги
    res.sendStatus(http_statuses_1.HttpStatus.NoContent); // 204
});
