import {Router} from "express";
import {getUserListHandler} from "./handlers/get-user-list.handler";
import {inputValidationResultMiddleware} from "../../../core/middlewares/validation/input-validtion-result.middleware";
import {superAdminGuardMiddleware} from "../../auth/middlewares/super-admin.guard-middleware";
import {
    paginationAndSortingValidation
} from "../../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import {UserSortField} from "./input/user-sort-field";
import {UserInputDtoValidation} from "../validation/user.input-dto.validation-middlewares";
import {deleteUserHandler, postUserHandler} from "../../../composition-root";


export const usersRouter = Router({});
usersRouter

    .get("/",
        paginationAndSortingValidation(UserSortField),
        inputValidationResultMiddleware,
        getUserListHandler)

    .post("/",
        superAdminGuardMiddleware,
       UserInputDtoValidation,
       inputValidationResultMiddleware,
        postUserHandler.execute.bind(postUserHandler))

    .delete('/:id',
        superAdminGuardMiddleware,
        deleteUserHandler.execute.bind(deleteUserHandler))


