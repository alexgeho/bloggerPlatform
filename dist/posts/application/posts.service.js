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
const repository_not_found_error_1 = require("../../core/errors/repository-not-found.error");
exports.postsService = {
    findMany(queryDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { items, totalCount } = yield posts_repository_1.postsRepository.findMany(queryDto);
            const blogIds = [...new Set(items.map(post => post.blogId))];
            const blogs = yield blogs_repository_1.blogsRepository.findByIds(blogIds);
            if (!blogs || blogs.length === 0)
                throw new Error('Blog not found');
            const blogsMap = Object.fromEntries(blogs.map((bLog) => [bLog._id.toString(), bLog.name]));
            const enrichedPosts = items.map(post => (Object.assign(Object.assign({}, post), { blogName: blogsMap[post.blogId] || null })));
            return { items: enrichedPosts, totalCount };
        });
    },
    findAllByBlogId(blogId, pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Репозиторий возвращает массив постов и totalCount
            return yield posts_repository_1.postsRepository.findByBlogIdWithPagination(blogId, pageNumber, pageSize, sortBy, sortDirection);
        });
    },
    findByIdOrFail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield posts_repository_1.postsRepository.findByIdOrFail(id);
            if (!post) {
                throw new repository_not_found_error_1.RepositoryNotFoundError('Post not exist'); // ← вернёт 404!
            }
            return post; // тут post точно не null, TS доволен
        });
    },
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
            const createdPost = yield posts_repository_1.postsRepository.findByIdOrFail(createdId); // возвращает PostDb | null
            if (!createdPost)
                throw new Error('Post not found after creation');
            return {
                id: createdPost._id.toString(),
                title: createdPost.title,
                shortDescription: createdPost.shortDescription,
                content: createdPost.content,
                blogId: createdPost.blogId,
                blogName: createdPost.blogName,
                createdAt: createdPost.createdAt,
            };
        });
    },
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('SERVICE UPDATE — до repo.update', id, dto); // Лог до
            yield posts_repository_1.postsRepository.update(id, dto);
            console.log('SERVICE UPDATE — после repo.update'); // Лог после
            return;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield posts_repository_1.postsRepository.delete(id);
            return;
        });
    },
};
