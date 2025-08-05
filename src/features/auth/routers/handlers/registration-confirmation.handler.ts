import {Request, Response} from 'express';
import {usersQwRepository} from "../../../users/repositories/usersQwRepository";
import {User} from "../../domain/user";
import {userRepository} from "../../../users/repositories/user.repository";
import {authService} from "../../application/auth.service";


export async function emailConfirmationHandler(

    req: Request,
    res: Response): Promise <void> {

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
        res.status(400).json({ message: "Code is already confirmed or invalid" });
        return;
    }


    userExist.emailConfirmation.isConfirmed = true;

    await authService.update(userExist);

    res.sendStatus(204);

}