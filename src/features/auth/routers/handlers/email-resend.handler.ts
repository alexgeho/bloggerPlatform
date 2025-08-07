import {Request, Response} from 'express';
import {usersQwRepository} from "../../../users/repositories/usersQwRepository";
import {emailManager} from "../../adapters/email.manager";
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import {userRepository} from "../../../users/repositories/user.repository";
import {authService} from "../../application/auth.service"; // если используешь date-fns

export async function emailResendHandler(
    req: Request,
    res: Response) {

    const email = req.body.email;

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


    await authService.resendEmail(user)


    res.sendStatus(204);


}