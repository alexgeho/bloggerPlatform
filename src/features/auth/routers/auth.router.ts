import {Router} from "express";
import {loginHandler} from "./handlers/login.handler";
import {authInputDtoValidation} from "../validation/auth.input-dto.validation-middlewares";
import {accessTokenGuard} from "./guards/access.token.guard";
import {getMeHandler} from "./handlers/get-me.handler";
import {registrationHandler} from "./handlers/registration-handler";
import {emailConfirmationHandler} from "./handlers/registration-confirmation.handler";
import {inputValidationResultMiddleware} from "../../../core/middlewares/validation/input-validtion-result.middleware";
import {emailResendHandler} from "./handlers/email-resend.handler";
import {userInputDtoValidation} from "../validation/user.input-dto.validation-middlewares";
import {codeInputDtoValidation} from "../validation/registration.confirmation.input-dto.validation-middlewares";
import {refreshHandler} from "./handlers/refresh.handler";
import {logoutHandler} from "./handlers/logout.handler";


export const authRouter = Router();


authRouter.post("/login",
    authInputDtoValidation,
    inputValidationResultMiddleware,
    loginHandler);

authRouter.post("/refresh-token",
   // authInputDtoValidation,
    // inputValidationResultMiddleware,
    refreshHandler);

authRouter.post("/logout",
    //authInputDtoValidation,
    //inputValidationResultMiddleware,
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


// authRouter.get("/confirm-email",
//     emailConfirmationHandler);