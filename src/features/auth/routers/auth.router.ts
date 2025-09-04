import {Router} from "express";
import {loginHandler} from "./handlers/authHandlers/login.handler";
import {authInputDtoValidation} from "../validation/auth.input-dto.validation-middlewares";
import {accessTokenGuard} from "./guards/access.token.guard";
import {getMeHandler} from "./handlers/authHandlers/get-me.handler";
import {registrationHandler} from "./handlers/authHandlers/registration-handler";
import {emailConfirmationHandler} from "./handlers/authHandlers/registration-confirmation.handler";
import {inputValidationResultMiddleware} from "../../../core/middlewares/validation/input-validtion-result.middleware";
import {emailResendHandler} from "./handlers/authHandlers/email-resend.handler";
import {userInputDtoValidation} from "../validation/user.input-dto.validation-middlewares";
import {codeInputDtoValidation} from "../validation/registration.confirmation.input-dto.validation-middlewares";
import {refreshHandler} from "./handlers/authHandlers/refresh.handler";
import {logoutHandler} from "./handlers/authHandlers/logout.handler";
import {refreshTokenGuard} from "./guards/refresh.token.guard";


export const authRouter = Router();


authRouter.post("/login",
    authInputDtoValidation,
    inputValidationResultMiddleware,
    loginHandler);

authRouter.post("/refresh-token",
    refreshTokenGuard,
    refreshHandler);

authRouter.post("/logout",
    logoutHandler);

authRouter.post("/registration-confirmation",
    codeInputDtoValidation,
    inputValidationResultMiddleware,
    emailConfirmationHandler);

authRouter.post("/registration",
    userInputDtoValidation,
    inputValidationResultMiddleware,
    registrationHandler);

authRouter.post("/registration-email-resending",
    emailResendHandler);

authRouter.get("/me",
    accessTokenGuard,
    getMeHandler)


