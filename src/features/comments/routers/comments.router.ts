import {Router} from "express";
import {putCommentsHandler} from "./handlers/put-comments.handler";


export const commentsRouter = Router();


commentsRouter.put("/:id",
    putCommentsHandler)

commentsRouter.get("/:id",
    getCommentsHandler)

// commentsRouter.delete("/:id",
//     deleteCommentsHandler)
