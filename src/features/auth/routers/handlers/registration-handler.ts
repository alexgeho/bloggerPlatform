import { Request, Response } from 'express';
import { RegistrationDto } from "../../types/registration.dto";
import {authService} from "../../application/auth.service";
import {usersQwRepository} from "../../../users/repositories/usersQwRepository";

export const registrationHandler = async (req: Request, res: Response) => {

try {

   const dto: RegistrationDto = req.body;

   const userExist = await usersQwRepository.findByLoginOrEmail(dto.login, dto.email);

   if (userExist) {
       res.sendStatus(400);
       return;
   }

   await authService.create(dto)

    res.sendStatus(204);

} catch (error) {
    res.status(400).json({message: "Please try again later"});

}

};