import {Router} from "express";
import {postUserHandler} from "./handlers/post-user.handler";
import {getUserListHandler} from "./handlers/get-user-list.handler";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validtion-result.middleware";
import {deleteUserHandler} from "./handlers/delete-user.handler";
import {superAdminGuardMiddleware} from "../../auth/middlewares/super-admin.guard-middleware";
import {
    paginationAndSortingValidation
} from "../../core/middlewares/validation/query-pagination-sorting.validation-middleware";
import {UserSortField} from "./input/user-sort-field";
import {UserInputDtoValidation} from "../validation/user.input-dto.validation-middlewares";


export const usersRouter = Router({});
console.log("=== TEST blogsRouter LOADED ===");
usersRouter

    .get("/",
        paginationAndSortingValidation(UserSortField),
        inputValidationResultMiddleware,
        getUserListHandler)

    .post("/",
       superAdminGuardMiddleware,
       UserInputDtoValidation,
       inputValidationResultMiddleware,
        postUserHandler)

    .delete('/:id',
        superAdminGuardMiddleware,
        deleteUserHandler)


