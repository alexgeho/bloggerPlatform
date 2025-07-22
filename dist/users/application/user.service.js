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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var mongodb_1 = require("mongodb");
var user_repository_1 = require("../repositories/user.repository");
exports.userService = {
    findMany: function (queryDto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, user_repository_1.userRepository.findMany(queryDto)];
            });
        });
    },
    create: function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUser, passwordSalt, passwordHash, newUser, id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_repository_1.userRepository.findOne({ login: dto.login, email: dto.email })];
                    case 1:
                        existingUser = _a.sent();
                        if (existingUser) {
                            // Проверяем, что именно совпало
                            if (existingUser.email === dto.email) {
                                return [2 /*return*/, {
                                        errorsMessages: [{ field: 'email', message: 'email should be unique' }]
                                    }];
                            }
                            if (existingUser.login === dto.login) {
                                return [2 /*return*/, {
                                        errorsMessages: [{ field: 'login', message: 'login should be unique' }]
                                    }];
                            }
                        }
                        return [4 /*yield*/, bcryptjs_1.default.genSalt(10)];
                    case 2:
                        passwordSalt = _a.sent();
                        return [4 /*yield*/, this._generateHash(dto.password, passwordSalt)];
                    case 3:
                        passwordHash = _a.sent();
                        newUser = {
                            _id: new mongodb_1.ObjectId(),
                            login: dto.login,
                            email: dto.email,
                            passwordHash: passwordHash,
                            passwordSalt: passwordSalt,
                            createdAt: new Date(),
                        };
                        return [4 /*yield*/, user_repository_1.userRepository.create(newUser)];
                    case 4:
                        id = _a.sent();
                        return [2 /*return*/, { id: id, login: newUser.login, email: newUser.email, createdAt: new Date().toISOString() }];
                }
            });
        });
    },
    _generateHash: function (password, salt) {
        return __awaiter(this, void 0, void 0, function () {
            var hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bcryptjs_1.default.hash(password, salt)];
                    case 1:
                        hash = _a.sent();
                        return [2 /*return*/, hash];
                }
            });
        });
    },
    delete: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_repository_1.userRepository.delete(id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    checkCredentials: function (loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user, passwordHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_repository_1.userRepository.findByLoginOrEmail(loginOrEmail)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, this._generateHash(password, user.passwordSalt)];
                    case 2:
                        passwordHash = _a.sent();
                        if (user.passwordHash !== passwordHash) {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    },
};
//# sourceMappingURL=user.service.js.map