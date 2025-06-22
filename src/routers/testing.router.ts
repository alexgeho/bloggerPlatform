import {Router} from "express";
import {superAdminGuardMiddleware} from "../auth/middlewares/super-admin.guard-middleware";
import {deleteAllBlogHandler} from "./handlers/testingHandler/delete-all-blogs.handler";


export const testingRouter = Router({});

testingRouter

    .delete('/all-data',
        superAdminGuardMiddleware,
        deleteAllBlogHandler
    )
