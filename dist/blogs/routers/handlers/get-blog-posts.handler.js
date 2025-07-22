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
exports.getBlogPostsHandler = getBlogPostsHandler;
var blogs_service_1 = require("../../application/blogs.service");
var posts_service_1 = require("../../../posts/application/posts.service");
function getBlogPostsHandler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var blogId, pageNumber, pageSize, sortBy, sortDirection, postsPage, result, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    blogId = req.params.blogId;
                    // Проверка, что блог существует
                    return [4 /*yield*/, blogs_service_1.blogsService.findByIdOrFail(blogId)];
                case 1:
                    // Проверка, что блог существует
                    _a.sent();
                    pageNumber = +(req.query.pageNumber || 1);
                    pageSize = +(req.query.pageSize || 10);
                    sortBy = typeof req.query.sortBy === "string" ? req.query.sortBy : "createdAt";
                    sortDirection = req.query.sortDirection === "asc" ? "asc" : "desc";
                    return [4 /*yield*/, posts_service_1.postsService.findAllByBlogId(blogId, pageNumber, pageSize, sortBy, sortDirection)];
                case 2:
                    postsPage = _a.sent();
                    result = {
                        pagesCount: Math.ceil(postsPage.totalCount / pageSize),
                        page: pageNumber,
                        pageSize: pageSize,
                        totalCount: postsPage.totalCount,
                        items: postsPage.items.map(function (p) { return ({
                            id: p._id ? p._id.toString() : p._id,
                            title: p.title,
                            shortDescription: p.shortDescription,
                            content: p.content,
                            blogId: p.blogId,
                            blogName: p.blogName,
                            createdAt: p.createdAt,
                        }); })
                    };
                    return [2 /*return*/, res.status(200).json(result)];
                case 3:
                    e_1 = _a.sent();
                    if (e_1.message === 'Blog not exist')
                        return [2 /*return*/, res.sendStatus(404)];
                    return [2 /*return*/, res.sendStatus(500)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=get-blog-posts.handler.js.map