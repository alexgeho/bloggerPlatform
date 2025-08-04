import { Request, Response } from 'express';
import { RegistrationDto } from "../../types/registration.dto";
import {authService} from "../../application/auth.service";

export const registrationHandler = async (req: Request, res: Response) => {
    console.log("🔥 registration HIT:", req.method, req.url, req.body);



try {

   const dto: RegistrationDto = req.body;

   const userCreated = await authService.create(dto)

    res.sendStatus(204);

} catch (error) {
    res.status(400).json({message: "Please try again later"});

}

};