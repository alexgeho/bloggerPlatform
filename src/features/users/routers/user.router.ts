import {Router} from "express";
import {postUserHandler} from "./handlers/post-user.handler";
import {getUserListHandler} from "./handlers/get-user-list.handler";
import {inputValidationResultMiddleware} from "../../../core/middlewares/validation/input-validtion-result.middleware";
import {deleteUserHandler} from "./handlers/delete-user.handler";
import {superAdminGuardMiddleware} from "../../auth/middlewares/super-admin.guard-middleware";
import {
    paginationAndSortingValidation
} from "../../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import {UserSortField} from "./input/user-sort-field";
import {UserInputDtoValidation} from "../validation/user.input-dto.validation-middlewares";
import {accessTokenGuard} from "../../auth/routers/guards/access.token.guard";


export const usersRouter = Router({});
usersRouter

    .get("/",
        paginationAndSortingValidation(UserSortField),
        inputValidationResultMiddleware,
        getUserListHandler)

    .post("/",
        accessTokenGuard,
       UserInputDtoValidation,
       inputValidationResultMiddleware,
        postUserHandler)

    .delete('/:id',
        accessTokenGuard,
        deleteUserHandler)


