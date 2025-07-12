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
exports.postsRepository = void 0;
const mongo_db_1 = require("../../db/mongo.db");
const mongodb_1 = require("mongodb");
const repository_not_found_error_1 = require("../../core/errors/repository-not-found.error");
exports.postsRepository = {
    findMany(queryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pageNumber, pageSize, sortBy, sortDirection, searchPostNameTerm } = queryDto;
            const skip = (pageNumber - 1) * pageSize;
            const filter = {};
            if (searchPostNameTerm) {
                filter.name = { $regex: searchPostNameTerm, $options: 'i' };
            }
            const items = yield mongo_db_1.postCollection
                .find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSize)
                .toArray();
            const totalCount = yield mongo_db_1.postCollection.countDocuments(filter);
            return { items, totalCount };
        });
    },
    create(newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertResult = yield mongo_db_1.postCollection.insertOne(newPost);
            return insertResult.insertedId.toString();
        });
    },
    findByIdOrFail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mongo_db_1.postCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
        });
    },
    findByBlogIdWithPagination(blogId, pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { blogId: blogId }; // ! blogId должен быть string
            const sort = { [sortBy]: sortDirection === 'asc' ? 1 : -1 }; // для MongoDB
            // 1. Подсчёт общего количества постов
            const totalCount = yield mongo_db_1.postCollection.countDocuments(filter);
            // 2. Получение нужной страницы постов
            const items = yield mongo_db_1.postCollection
                .find(filter)
                .sort(sort) // <-- вот так
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray();
            return { items, totalCount };
        });
    },
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateResult = yield mongo_db_1.postCollection.updateOne({
                _id: new mongodb_1.ObjectId(id),
            }, {
                $set: {
                    title: dto.title,
                    shortDescription: dto.shortDescription,
                    content: dto.content,
                    blogId: dto.blogId
                },
            });
            if (updateResult.matchedCount < 1) {
                throw new repository_not_found_error_1.RepositoryNotFoundError('Post not exist');
            }
            return;
        });
    },
    //     async delete(id: string): Promise<void> {
    //         const deleteResult = await blogCollection.deleteOne({
    //             _id: new ObjectId(id),
    //         });
    //
    //         if (deleteResult.deletedCount < 1) {
    //             throw new RepositoryNotFoundError('Blog not exist');
    //         }
    //
    //         return;
    //     },
};
