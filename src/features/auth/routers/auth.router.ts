import {Request, Response, Router} from "express";
import {LoginHandler} from "./handlers/authHandlers/login.handler";
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
import {RateLimiterService} from "../application/rateLimiter.service";
import {refreshTokenGuard} from "./guards/refresh.token.guard";
import {rateLimiter} from "../middlewares/rateLimiter";
import {requestLimitMiddleware} from "../middlewares/rateLimeterUpd";
import {AuthService} from "../application/auth.service";
import {userRepository, UserRepository} from "../../users/repositories/user.repository";
import { bcryptService } from "../adapters/bcrypt.service";



const authService = new AuthService(userRepository, bcryptService);

const loginHandler = new LoginHandler(authService);

export const authRouter = Router();


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
    emailConfirmationHandler);

authRouter.post("/registration",
    requestLimitMiddleware,
    userInputDtoValidation,
    inputValidationResultMiddleware,
    registrationHandler);

authRouter.post("/registration-email-resending",
    requestLimitMiddleware,
    emailResendHandler);

authRouter.get("/me",
    accessTokenGuard,
    getMeHandler)


