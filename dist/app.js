"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// src/app.ts
const express_1 = __importDefault(require("express"));
const setup_app_1 = require("./setup-app");
const app = (0, express_1.default)();
exports.app = app;
(0, setup_app_1.setupApp)(app);
