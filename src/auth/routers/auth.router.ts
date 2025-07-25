import {Router} from "express";
import {postAuthHandler} from "./handlers/post-auth.handler";
import {authInputDtoValidation} from "../validation/auth.input-dto.validation-middlewares";


export const authRouter = Router();

authRouter.post("/login",
    authInputDtoValidation,
    postAuthHandler)

