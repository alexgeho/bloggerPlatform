import {Router} from "express";
import {postAuthHandler} from "./handlers/post-auth.handler";
import {authInputDtoValidation} from "../validation/auth.input-dto.validation-middlewares";
import {accessTokenGuard} from "./guards/access.token.guard";
import {getMeHandler} from "./handlers/get-me.handler";
import {registrationHandler} from "./handlers/registration-handler";


export const authRouter = Router();



authRouter.get("/confirm-email",
    emailConfirmationHandler);

authRouter.post("/registration-confirmation",
    registrationConfirmationHandler);


authRouter.post("/registration",
    registrationHandler);

authRouter.post("/login",
    authInputDtoValidation,
    postAuthHandler)

authRouter.get("/me",
    accessTokenGuard,
    getMeHandler)
