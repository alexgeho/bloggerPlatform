import {Router, Request, Response} from "express";
import {userService} from "../../users/application/user.service";
import {authService} from "../application/auth.service";


export const authRouter = Router();

authRouter.post("/login", async (req: Request, res: Response) => {
    const { loginOrEmail, password } = req.body;

    const result = await authService.checkCredentials(loginOrEmail, password);

    if (result === true) {
        return res.sendStatus(204);
    } else {
        // result — это объект с errorsMessages
        return res.status(401).json(result);
    }
});

