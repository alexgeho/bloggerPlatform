import {Router} from "express";
import {postBlogHandler} from "./handlers/post-blog.handler";
import {getBlogListHandler} from "./handlers/get-blog-list.handler";
import {putBlogHandler} from "./handlers/put-blog.handler";
import {idValidation} from "../../../core/middlewares/validation/params-id.validation-middleware";
import {inputValidationResultMiddleware} from "../../../core/middlewares/validation/input-validtion-result.middleware";
import {blogInputDtoValidation} from "../validation/blog.input-dto.validation-middlewares";
import {deleteBlogHandler} from "./handlers/delete-blog.handler";
import {superAdminGuardMiddleware} from "../../auth/middlewares/super-admin.guard-middleware";
import {getBlogHandler} from "./handlers/get-blog.handler";
import {
    paginationAndSortingValidation
} from "../../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import {BlogSortField} from "./input/blog-sort-field";
import {getBlogPostsHandler} from "./handlers/get-blog-posts.handler";
import {asyncHandler} from "../../../core/utils/express-async-handler";
import {postBlogPostHandler} from "./handlers/post-blog-post.handler";
import {blogIdValidationNested} from "../../../core/middlewares/validation/blogId-validation.nested";
import {postInputDtoForBlogValidation} from "../validation/post.blogForPostInput.validation-middlewares";
import {accessTokenGuard} from "../../auth/routers/guards/access.token.guard";


export const blogsRouter = Router({});
blogsRouter



    .get("/",
        paginationAndSortingValidation(BlogSortField),
        inputValidationResultMiddleware,
        getBlogListHandler)

    .post("/",
        superAdminGuardMiddleware,
        blogInputDtoValidation,
       inputValidationResultMiddleware,
        postBlogHandler)

    .get("/:id",
        idValidation,
        inputValidationResultMiddleware,
        getBlogHandler)

    .put('/:id',
        superAdminGuardMiddleware,
        idValidation,
        blogInputDtoValidation,
        inputValidationResultMiddleware,
        putBlogHandler)

    .delete('/:id',
        superAdminGuardMiddleware,
        deleteBlogHandler)

    .get('/:blogId/posts',
        inputValidationResultMiddleware,
    ...blogIdValidationNested('blogId'),
        inputValidationResultMiddleware,
        asyncHandler(getBlogPostsHandler)
    )

    .post(
        '/:blogId/posts',
        accessTokenGuard,
        ...postInputDtoForBlogValidation,         // <<<<< только три поля из body!
        inputValidationResultMiddleware,
        ...blogIdValidationNested('blogId'),      // <<<<< отдельно валидируй path param
        postBlogPostHandler
    )


