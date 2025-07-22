import {Router, Request, Response} from "express";
import {userService} from "../../users/application/user.service";
import {authService} from "../application/auth.service";
import {postAuthHandler} from "./handlers/post-auth.handler";
import {authInputDtoValidation} from "../validation/auth.input-dto.validation-middlewares";


export const authRouter = Router();

authRouter.post("/login",
    authInputDtoValidation,
    postAuthHandler)

