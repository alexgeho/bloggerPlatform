import {Router} from "express";
import {postAuthHandler} from "./handlers/post-auth.handler";
import {authInputDtoValidation} from "../validation/auth.input-dto.validation-middlewares";
import {accessTokenGuard} from "./guards/access.token.guard";
import {getMeHandler} from "./handlers/get-me.handler";
import {registrationHandler} from "./handlers/registration-handler";
import {emailConfirmationHandler} from "./handlers/registration-confirmation.handler";
import {inputValidationResultMiddleware} from "../../../core/middlewares/validation/input-validtion-result.middleware";
import {emailResendHandler} from "./handlers/email-resend.handler";


export const authRouter = Router();


authRouter.post("/registration-email-resending",
    emailResendHandler);


authRouter.post("/registration-confirmation",
    emailConfirmationHandler);


authRouter.post("/registration",
    registrationHandler);

authRouter.post("/login",
    authInputDtoValidation,
    inputValidationResultMiddleware,
    postAuthHandler)

authRouter.get("/me",
    accessTokenGuard,
    getMeHandler)


// authRouter.get("/confirm-email",
//     emailConfirmationHandler);