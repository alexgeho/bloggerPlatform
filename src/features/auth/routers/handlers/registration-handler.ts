import { Request, Response } from 'express';
import { RegistrationDto } from "../../types/registration.dto";
import {authService} from "../../application/auth.service";
import {usersQwRepository} from "../../../users/repositories/usersQwRepository";

export const registrationHandler = async (req: Request, res: Response) => {

try {

   const dto: RegistrationDto = req.body;

   const userExist = await usersQwRepository.findByLoginOrEmail(dto.login, dto.email);

    if (userExist) {
        if (userExist.accountData.email === dto.email) {
            return res.status(400).json({
                errorsMessages: [{ message: "email is already exist", field: "email" }],
            });
        }

        if (userExist.accountData.login === dto.login) {
            return res.status(400).json({
                errorsMessages: [{ message: "login is already exist", field: "login" }],
            });
        }
    }



   await authService.create(dto)

    res.sendStatus(204);

} catch (error) {
    return res.status(400).json({
        errorsMessages: [
            {
                message: "User with this email or login already exists",
                field: "email", // или "login" — в зависимости от того, что совпало
            },
        ],
    });


}

};