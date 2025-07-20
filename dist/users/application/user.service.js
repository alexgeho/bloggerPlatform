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
exports.userService = void 0;
const user_repository_1 = require("../repositories/user.repository");
exports.userService = {
    findMany(queryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return user_repository_1.userRepository.findMany(queryDto);
        });
    },
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = {
                login: dto.login,
                password: dto.password,
                email: dto.email,
                createdAt: new Date().toISOString()
            };
            const id = yield user_repository_1.userRepository.create(newUser);
            return { id, login: newUser.login, email: newUser.email, createdAt: newUser.createdAt };
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_repository_1.userRepository.delete(id);
            return;
        });
    },
};
