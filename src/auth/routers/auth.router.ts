import { Router, Request, Response } from "express";
import {userService} from "../../users/application/user.service";
import { authService } from "../application/auth.service";


export const authRouter = Router();

authRouter.post("/login", async (Request, Response) => {
    const isValid = await authService.checkCredentials(Request.body.loginOrEmail, Request.body.password);
    if (isValid) return Response.sendStatus(204);
    return Response.sendStatus(401);
});
