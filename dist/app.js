"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doSomething = exports.app = void 0;
// src/app.ts
var express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
var doSomething = function () { console.log('something'); };
exports.doSomething = doSomething;
//# sourceMappingURL=app.js.map