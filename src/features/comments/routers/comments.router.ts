import {Router} from "express";
import {putCommentsHandler} from "./handlers/put-comments.handler";


export const commentsRouter = Router();


commentsRouter.put("/:commentId",
    putCommentsHandler)

commentsRouter.get("/:commentId",
    getCommentsHandler)

commentsRouter.delete("/:id",
    deleteCommentsHandler)
