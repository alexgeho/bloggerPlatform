import {Request, Response} from 'express';
import {usersQwRepository} from "../../../users/repositories/usersQwRepository";
import {User} from "../../domain/user";
import {userRepository} from "../../../users/repositories/user.repository";
import {authService} from "../../application/auth.service";


export async function emailConfirmationHandler(

    req: Request,
    res: Response): Promise <void> {

    const code: string = req.body.code;
    console.log(code, ' code')

    let userExist: User | null = await usersQwRepository.findByCode(code);
    console.log(userExist, ' userExist перед 29 строчкой')


    if (!userExist) {
         res.status(400).json({
            errorsMessages: [{ message: "User not found", field: "code" }],

        });
        return;
    }
console.log(userExist, ' userExist')
    if (userExist.emailConfirmation.isConfirmed) {
         res.status(400).json({
            errorsMessages: [{ message: "Email already confirmed", field: "code" }],
        });
        return;
    }

    if (userExist.emailConfirmation.confirmationCode !== code) {
         res.status(400).json({
            errorsMessages: [{ message: "Invalid confirmation code", field: "code" }],
        });
        return;
    }

    if (userExist.emailConfirmation.expirationDate < new Date()) {
         res.status(400).json({
            errorsMessages: [{ message: "Confirmation code expired", field: "code" }],
        });
        return;
    }



    userExist.emailConfirmation.isConfirmed = true;

    await authService.update(userExist);

    res.sendStatus(204);

}