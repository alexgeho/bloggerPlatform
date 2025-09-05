import {Request, Response} from 'express';
import {usersQwRepository} from "../../../../users/repositories/usersQwRepository";
import {authService} from "../../../application/auth.service"; // если используешь date-fns

export async function emailResendHandler(
    req: any,
    res: any) {



    const email = req.body.email;
    const ip: string = req.ip ?? "unknown";

    const user = await usersQwRepository.findByEmail(email);

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
        await authService.resendEmail(user, ip);
        return res.sendStatus(204);
    } catch (e: any) {
        if (e.message === "Too many requests") {
            return res.sendStatus(429);
        }
        return res.sendStatus(500);
    }

}