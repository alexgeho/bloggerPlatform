import {Router} from "express";
import {putCommentsHandler} from "./handlers/put-comments.handler";
import {getCommentHandler} from "./handlers/get-comment.handler";
import {getCommentsHandler} from "./handlers/get-comments.handler";
import {idValidation} from "../../../core/middlewares/validation/params-id.validation-middleware";
import {accessTokenGuard} from "../../auth/routers/guards/access.token.guard";
import {contentInputDtoValidation} from "../comment.input-dto.validation-middlewares";
import {deleteCommentsHandler} from "./handlers/delete-comments.handler";
import {inputValidationResultMiddleware} from "../../../core/middlewares/validation/input-validtion-result.middleware";
import {likesToCommentsHandler} from "../../likes/likes-to-comments.handler";
import {likeStatusValidation} from "../like.input-dto.validation-middlewares";
import {accessTokenLikes} from "../../auth/routers/guards/access.token.likes";


export const commentsRouter = Router();

commentsRouter.get("/",
    getCommentsHandler);

commentsRouter.put("/:id",
    accessTokenGuard,
    idValidation,
    contentInputDtoValidation,
    inputValidationResultMiddleware,
    putCommentsHandler)

commentsRouter.put("/:id/like-status",
    accessTokenGuard,
    likeStatusValidation,
    idValidation,
    inputValidationResultMiddleware,
    likesToCommentsHandler)



commentsRouter.get("/:id",
    idValidation,
    accessTokenLikes,
    getCommentHandler)

commentsRouter.delete("/:id",
    accessTokenGuard,
    deleteCommentsHandler)
