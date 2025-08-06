import {Request, Response} from 'express';
import {usersQwRepository} from "../../../users/repositories/usersQwRepository";
import {emailManager} from "../../adapters/email.manager";
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import {userRepository} from "../../../users/repositories/user.repository"; // если используешь date-fns

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

    if (
        user.emailConfirmation.isConfirmed
    ) {
        res.status(400).json({
            errorsMessages: [{ message: "Email already confirmed", field: "email" }]
        })
    }


    const newCode = uuidv4();
    const newExpirationDate = add(new Date(), { hours: 1, minutes: 30 });

    user.emailConfirmation.confirmationCode = newCode;
    user.emailConfirmation.expirationDate = newExpirationDate;

    await emailManager.sendConfirmationEmail(email, newCode);

    await userRepository.updateConfirmation(user); // обязательно обнови в базе

    res.sendStatus(204);


}