import { Router, Request, Response } from "express";
import { authService } from "../application/auth.service";

export const authRouter = Router();

console.log("=== TEST authRouter LOADED ===");

// Регистрация (создание пользователя)
authRouter.post("/create", async (req: Request, res: Response) => {
        const newAuth = await authService.createAuth(req.body.login, req.body.email, req.body.password);
        res.status(201).send(newAuth);
});

// Логин
authRouter.post("/login",
    async (req: Request, res: Response) => {
    const checkResult = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (checkResult) {
            // Логин и пароль верные — код 200 или 204 (см. swagger)
            res.sendStatus(204);
        } else {
            // Логин или пароль неверные — код 401
            res.sendStatus(401);
        }
});

