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
exports.postsService = void 0;
const posts_repository_1 = require("../repositories/posts.repository");
const blogs_repository_1 = require("../../blogs/repositories/blogs.repository");
//import { DomainError } from '../../core/errors/domain.error';
//import { BlogQueryInput } from '../routers/input/blog-query.input';
//import {BlogInputDto} from "./dtos/blog.input-dto";
//import {BlogDataOutput} from "../routers/output/blog-data.output";
exports.postsService = {
    findMany(queryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { items, totalCount } = yield posts_repository_1.postsRepository.findMany(queryDto);
            const blogIds = [...new Set(items.map(post => post.blogId))];
            const blogs = yield blogs_repository_1.blogsRepository.findByIds(blogIds);
            const blogsMap = Object.fromEntries(blogs.map((bLog) => [bLog._id.toString(), bLog.name]));
            const enrichedPosts = items.map(post => (Object.assign(Object.assign({}, post), { blogName: blogsMap[post.blogId] || null })));
            return { items: enrichedPosts, totalCount };
        });
    },
};
//
//     async findByIdOrFail(id: string): Promise<WithId<Blog>> {
//         return postsRepository.findByIdOrFail(id);
//     },
//
//     async create(dto: BlogInputDto): Promise<BlogDataOutput> {
//         const newBlog: Blog = {
//             name: dto.name,
//             description: dto.description,
//             websiteUrl: dto.websiteUrl,
//             createdAt: new Date().toISOString(),
//             isMembership: true,
//         };
//         const id = await blogsRepository.create(newBlog);
//         return { id, ...newBlog };
//     },
//
//
//     async update(id: string, dto: BlogInputDto): Promise<void> {
//         await blogsRepository.update(id, dto);
//         return;
//     },
//
//     async delete(id: string): Promise<void> {
//
//         await blogsRepository.delete(id);
//         return;
//     },
// };
