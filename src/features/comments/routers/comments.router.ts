import {Router} from "express";
import {putCommentsHandler} from "./handlers/put-comments.handler";
import {getCommentHandler} from "./handlers/get-comment.handler";
import {idValidation} from "../../../core/middlewares/validation/params-id.validation-middleware";
import {accessTokenGuard} from "../../auth/routers/guards/access.token.guard";
import {contentInputDtoValidation} from "../../posts/validation/comment.input-dto.validation-middlewares";


export const commentsRouter = Router();


commentsRouter.put("/:id",
    accessTokenGuard,
    idValidation,
    contentInputDtoValidation,
    putCommentsHandler)

commentsRouter.get("/:id",
    idValidation,
    getCommentHandler)

// commentsRouter.delete("/:id",
//     deleteCommentsHandler)
