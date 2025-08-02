import { Request, Response } from 'express';
import { RegistrationDto } from "../../types/registration.dto";

export const registrationHandler = async (req: Request, res: Response) => {
    try {
        const dto: RegistrationDto = req.body;

        const user = await authService.createUser (dto)

        res.status(201).send(); // или вернуть ошибку, если неуспешно
    } catch (error) {
        res.status(500).send({ message: 'Server error' });
    }
};
