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
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mongo_db_1.postCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
        });
    },
    //
    //     async findByIdOrFail(id: string): Promise<WithId<Blog>> {
    //         const res = await blogCollection.findOne({ _id: new ObjectId(id) });
    //
    //         if (!res) {
    //             throw new RepositoryNotFoundError('Driver not exist');
    //         }
    //         return res;
    //     },
    //
    //
    //     async update(id: string, dto: BlogInputDto): Promise<void> {
    //         const updateResult = await blogCollection.updateOne(
    //             {
    //                 _id: new ObjectId(id),
    //             },
    //             {
    //                 $set: {
    //                     name: dto.name,
    //                     description: dto.description,
    //                     websiteUrl: dto.websiteUrl
    //                 },
    //             },
    //         );
    //
    //         if (updateResult.matchedCount < 1) {
    //             throw new RepositoryNotFoundError('Blog not exist');
    //         }
    //
    //         return;
    //     },
    //
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
