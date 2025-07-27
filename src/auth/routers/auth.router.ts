import {Router} from "express";
import {postAuthHandler} from "./handlers/post-auth.handler";
import {authInputDtoValidation} from "../validation/auth.input-dto.validation-middlewares";
import {accessTokenGuard} from "./guards/access.token.guard";
import {getMeHandler} from "./handlers/get-me.handler";


export const authRouter = Router();


authRouter.post("/login",
    authInputDtoValidation,
    postAuthHandler)

authRouter.get("/me",
    accessTokenGuard,
    getMeHandler
);