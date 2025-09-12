import {UserRepository} from "./features/users/repositories/user.repository";
import {BcryptService} from "./features/auth/adapters/bcrypt.service";
import {AuthService} from "./features/auth/application/auth.service";
import {LoginHandler} from "./features/auth/routers/handlers/authHandlers/login.handler";
import {EmailResendHandler} from "./features/auth/routers/handlers/authHandlers/email-resend.handler";
import {PostUserHandler} from "./features/users/routers/handlers/post-user.handler";
import {UserService} from "./features/users/application/user.service";
import {DeleteUserHandler} from "./features/users/routers/handlers/delete-user.handler";



export const userRepository = new UserRepository();
export const bcryptService = new BcryptService();
export const authService = new AuthService(userRepository, bcryptService);
export const loginHandler = new LoginHandler(authService);
export const emailResendHandler = new EmailResendHandler(authService);
export const userService = new UserService(userRepository);
export const postUserHandler = new PostUserHandler(userService);
export const deleteUserHandler = new DeleteUserHandler(userService);