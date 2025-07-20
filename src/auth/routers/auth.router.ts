import {Router, Request, Response} from "express";


export const authRouter = Router({});
console.log("=== TEST blogsRouter LOADED ===");
authRouter

    .post("/login",
        async (req: Request, res: Response) => {
        const newAuth = await authService.createAuth(req.body.login, req.body.email, req.body.password);
        res.status(201).send(newAuth);
        }
        )





// idValidation, // или blogIdValidation
//postInputDtoValidation,
// inputValidationResultMiddleware,