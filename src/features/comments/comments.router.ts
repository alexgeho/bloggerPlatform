import {Router} from "express";
import {postAuthHandler} from "../auth/routers/handlers/post-auth.handler";
import {authInputDtoValidation} from "../auth/validation/auth.input-dto.validation-middlewares";
import {accessTokenGuard} from "../auth/routers/guards/access.token.guard";
import {getMeHandler} from "../auth/routers/handlers/get-me.handler";


export const commentsRouter = Router();


commentsRouter.post("/login",
    authInputDtoValidation,
    postAuthHandler)

commentsRouter.get("/me",
    accessTokenGuard,
    getMeHandler
);