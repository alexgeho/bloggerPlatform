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
exports.userRepository = void 0;
const mongo_db_1 = require("../../db/mongo.db");
const mongodb_1 = require("mongodb");
const repository_not_found_error_1 = require("../../core/errors/repository-not-found.error");
exports.userRepository = {
    findMany(queryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('[findMany] queryDto:', queryDto);
            const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } = queryDto;
            const skip = (pageNumber - 1) * pageSize;
            const filter = {};
            if (searchNameTerm) {
                filter.name = { $regex: searchNameTerm, $options: 'i' };
            }
            const items = yield mongo_db_1.blogCollection
                .find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSize)
                .toArray();
            const totalCount = yield mongo_db_1.blogCollection.countDocuments(filter);
            return { items, totalCount };
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return mongo_db_1.blogCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
        });
    },
    findByIdOrFail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield mongo_db_1.blogCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!res) {
                throw new repository_not_found_error_1.RepositoryNotFoundError('Blog not exist');
            }
            return res;
        });
    },
    findByIds(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectIds = ids.map(id => new mongodb_1.ObjectId(id));
            return mongo_db_1.blogCollection.find({ _id: { $in: objectIds } }).toArray();
        });
    },
    create(newBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertResult = yield mongo_db_1.blogCollection.insertOne(newBlog);
            return insertResult.insertedId.toString();
        });
    },
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateResult = yield mongo_db_1.blogCollection.updateOne({
                _id: new mongodb_1.ObjectId(id),
            }, {
                $set: {
                    name: dto.name,
                    description: dto.description,
                    websiteUrl: dto.websiteUrl
                },
            });
            if (updateResult.matchedCount < 1) {
                throw new repository_not_found_error_1.RepositoryNotFoundError('Blog not exist');
            }
            return;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield mongo_db_1.blogCollection.deleteOne({
                _id: new mongodb_1.ObjectId(id),
            });
            if (deleteResult.deletedCount < 1) {
                throw new repository_not_found_error_1.RepositoryNotFoundError('Blog not exist');
            }
            return;
        });
    },
};
