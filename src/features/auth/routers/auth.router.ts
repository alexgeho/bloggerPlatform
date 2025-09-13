import {Router} from "express";
import {authInputDtoValidation} from "../validation/auth.input-dto.validation-middlewares";
import {accessTokenGuard} from "./guards/access.token.guard";
import {inputValidationResultMiddleware} from "../../../core/middlewares/validation/input-validtion-result.middleware";
import {userInputDtoValidation} from "../validation/user.input-dto.validation-middlewares";
import {codeInputDtoValidation} from "../validation/registration.confirmation.input-dto.validation-middlewares";
import {refreshHandler} from "./handlers/authHandlers/refresh.handler";
import {logoutHandler} from "./handlers/authHandlers/logout.handler";
import {refreshTokenGuard} from "./guards/refresh.token.guard";
import {requestLimitMiddleware} from "../middlewares/rateLimeterUpd";
import {
    emailConfirmationHandler,
    emailResendHandler, getMeHandler,
    loginHandler, passwordRecoveryHandler,
    registrationHandler
} from "../../../composition-root"; // 👈 импортируем готовый экземпляр

export const authRouter = Router();

authRouter.post("/password-recovery",
    requestLimitMiddleware,
    authInputDtoValidation,
    inputValidationResultMiddleware,
    passwordRecoveryHandler.execute.bind(passwordRecoveryHandler))

authRouter.post("/login",
    requestLimitMiddleware,
    authInputDtoValidation,
    inputValidationResultMiddleware,
    loginHandler.execute.bind(loginHandler)
);

authRouter.post("/refresh-token",
    refreshTokenGuard,
    refreshHandler);

authRouter.post("/logout",
    refreshTokenGuard,
    logoutHandler);

authRouter.post("/registration-confirmation",
    requestLimitMiddleware,
    codeInputDtoValidation,
    inputValidationResultMiddleware,
    emailConfirmationHandler.execute.bind(emailConfirmationHandler));

authRouter.post("/registration",
    requestLimitMiddleware,
    userInputDtoValidation,
    inputValidationResultMiddleware,
    registrationHandler.execute.bind(registrationHandler));

authRouter.post("/registration-email-resending",
    requestLimitMiddleware,
    emailResendHandler.execute.bind(emailResendHandler));

authRouter.get("/me",
    accessTokenGuard,
    getMeHandler.execute.bind(getMeHandler))


