import {Request, Response} from 'express';
import {AuthService} from "../../../application/auth.service";
import {UserRepository} from "../../../../users/repositories/user.repository"; // если используешь date-fns

export class EmailResendHandler  {

    constructor(private authService: AuthService, private usersRepository: UserRepository) {}

async execute (req: Request, res: Response): Promise<void> {

    const email = req.body.email;
    const ip: string = req.ip ?? "unknown";

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
        res.status(400).json({
            errorsMessages: [{ message: "User not found", field: "email" }]
        });
        return;
    }

    if (user.emailConfirmation.isConfirmed) {
        res.status(400).json({
            errorsMessages: [{ message: "Email already confirmed", field: "email" }]
        })
    }

    try {
        this.authService.resendEmail(user, ip);
         res.sendStatus(204);
        return
    } catch (e: any) {
        if (e.message === "Too many requests") {
             res.sendStatus(429);
            return
        }
         res.sendStatus(500);
        return
    }

}



}