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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
var mongo_db_1 = require("../../db/mongo.db");
var mongodb_1 = require("mongodb");
var repository_not_found_error_1 = require("../../core/errors/repository-not-found.error");
exports.userRepository = {
    findMany: function (queryDto) {
        return __awaiter(this, void 0, void 0, function () {
            var pageNumber, pageSize, sortBy, sortDirection, login, email, skip, filter, items, totalCount;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        pageNumber = queryDto.pageNumber, pageSize = queryDto.pageSize, sortBy = queryDto.sortBy, sortDirection = queryDto.sortDirection, login = queryDto.login, email = queryDto.email;
                        skip = (pageNumber - 1) * pageSize;
                        filter = {};
                        if (login) {
                            filter.login = { $regex: login, $options: 'i' };
                        }
                        if (email) {
                            filter.email = { $regex: email, $options: 'i' };
                        }
                        return [4 /*yield*/, mongo_db_1.userCollection
                                .find(filter)
                                .sort((_a = {}, _a[sortBy] = sortDirection, _a))
                                .skip(skip)
                                .limit(pageSize)
                                .toArray()];
                    case 1:
                        items = _b.sent();
                        return [4 /*yield*/, mongo_db_1.userCollection.countDocuments(filter)];
                    case 2:
                        totalCount = _b.sent();
                        return [2 /*return*/, { items: items, totalCount: totalCount }];
                }
            });
        });
    },
    create: function (newUser) {
        return __awaiter(this, void 0, void 0, function () {
            var insertResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mongo_db_1.userCollection.insertOne(newUser)];
                    case 1:
                        insertResult = _a.sent();
                        return [2 /*return*/, insertResult.insertedId.toString()];
                }
            });
        });
    },
    delete: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var deleteResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mongo_db_1.userCollection.deleteOne({
                            _id: new mongodb_1.ObjectId(id),
                        })];
                    case 1:
                        deleteResult = _a.sent();
                        if (deleteResult.deletedCount < 1) {
                            throw new repository_not_found_error_1.RepositoryNotFoundError('User not exist');
                        }
                        return [2 /*return*/];
                }
            });
        });
    },
    findOne: function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var filter;
            var login = _b.login, email = _b.email;
            return __generator(this, function (_c) {
                filter = {};
                if (login && email) {
                    filter.$or = [{ login: login }, { email: email }];
                }
                else if (login) {
                    filter.login = login;
                }
                else if (email) {
                    filter.email = email;
                }
                else {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/, mongo_db_1.userCollection.findOne(filter)];
            });
        });
    },
    findByLoginOrEmail: function (loginOrEmail) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mongo_db_1.userCollection.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] })];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user];
                }
            });
        });
    }
};
//# sourceMappingURL=user.repository.js.map