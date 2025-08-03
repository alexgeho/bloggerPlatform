import { Request, Response } from 'express';
import { RegistrationDto } from "../../types/registration.dto";
import {authService} from "../../application/auth.service";

export const registrationHandler = async (req: Request, res: Response) => {

try {

   const dto: RegistrationDto = req.body;

   const userCreated = await authService.create(dto)

    res.status(204).json({
        message: "Input data is accepted. Email with confirmation code will be send to passed email address." +
            " Confirmation code should be inside link as query param, for example:" +
            " https://some-front.com/confirm-registration?code=youtcodehere"});

} catch (error) {
    res.status(400).json({message: "Please try again later"});

}

};