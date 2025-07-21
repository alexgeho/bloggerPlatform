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
    const result = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)
    res.status(200);
});

