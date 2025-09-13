import {UserRepository} from "./features/users/repositories/user.repository";
import {BcryptService} from "./features/auth/adapters/bcrypt.service";
import {AuthService} from "./features/auth/application/auth.service";
import {LoginHandler} from "./features/auth/routers/handlers/authHandlers/login.handler";
import {EmailResendHandler} from "./features/auth/routers/handlers/authHandlers/email-resend.handler";
import {PostUserHandler} from "./features/users/routers/handlers/post-user.handler";
import {UserService} from "./features/users/application/user.service";
import {DeleteUserHandler} from "./features/users/routers/handlers/delete-user.handler";
import {
    EmailConfirmationHandler
} from "./features/auth/routers/handlers/authHandlers/registration-confirmation.handler";
import {RegistrationHandler} from "./features/auth/routers/handlers/authHandlers/registration-handler";
import {GetUserListHandler} from "./features/users/routers/handlers/get-user-list.handler";
import {UsersQwRepository} from "./features/users/repositories/usersQwRepository";
import {GetMeHandler} from "./features/auth/routers/handlers/authHandlers/get-me.handler";
import {PasswordRecoveryHandler} from "./features/auth/routers/handlers/authHandlers/password-recovery.handler";
import {NewPasswordHandler} from "./features/auth/routers/handlers/authHandlers/new-password.handler";



export const userRepository = new UserRepository();
export const bcryptService = new BcryptService();
export const authService = new AuthService(userRepository, bcryptService);
export const loginHandler = new LoginHandler(authService);
export const emailResendHandler = new EmailResendHandler(authService, userRepository);
export const userService = new UserService(userRepository);
export const postUserHandler = new PostUserHandler(userService);
export const deleteUserHandler = new DeleteUserHandler(userService);
export const emailConfirmationHandler = new EmailConfirmationHandler(authService, userRepository);
export const registrationHandler = new RegistrationHandler(authService, userRepository);
export const usersQwRepository = new UsersQwRepository();
export const getUserListHandler = new GetUserListHandler(usersQwRepository)
export const getMeHandler = new GetMeHandler(usersQwRepository);
export const passwordRecoveryHandler = new PasswordRecoveryHandler(authService);
export const newPasswordHandler = new NewPasswordHandler(authService);