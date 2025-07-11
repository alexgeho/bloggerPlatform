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
    //
    //     async findByIdOrFail(id: string): Promise<WithId<Blog>> {
    //         return postsRepository.findByIdOrFail(id);
    //     },
    //
    // src/posts/application/posts.service.ts
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogs_repository_1.blogsRepository.findById(dto.blogId);
            if (!blog)
                throw new Error('Blog not found');
            const newPost = {
                title: dto.title,
                shortDescription: dto.shortDescription,
                content: dto.content,
                blogId: dto.blogId,
                blogName: blog.name,
                createdAt: new Date().toISOString(),
            };
            const createdId = yield posts_repository_1.postsRepository.create(newPost); // string (id)
            const createdPost = yield posts_repository_1.postsRepository.findById(createdId); // возвращает PostDb | null
            if (!createdPost)
                throw new Error('Post not found after creation');
            return {
                id: createdPost._id ? createdPost._id.toString() : createdPost.id,
                title: createdPost.title,
                shortDescription: createdPost.shortDescription,
                content: createdPost.content,
                blogId: createdPost.blogId,
                blogName: createdPost.blogName,
                createdAt: createdPost.createdAt,
            };
        });
    }
    // ...
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
};
