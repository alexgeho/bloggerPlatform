import {Request, Response} from 'express';
import {usersQwRepository} from "../../../users/repositories/usersQwRepository";
import {User} from "../../domain/user";
import {userRepository} from "../../../users/repositories/user.repository";


export async function emailConfirmationHandler(
    req: Request,
    res: Response) {

    const code: string = req.body.code;

    let userExist: User | null = await usersQwRepository.findByCode(code);

    if (!userExist) {
        res.sendStatus(404);
        return;
    }

    if (
        userExist.emailConfirmation.confirmationCode !== code ||
        userExist.emailConfirmation.isConfirmed ||
        userExist.emailConfirmation.expirationDate < new Date()
    ) {
        return res.sendStatus(400);
        }

     userExist.emailConfirmation.isConfirmed = true;

    await userRepository.update(userExist);

    res.sendStatus(204);

}