import {Request, Response} from 'express';
import {User} from "../../../domain/user";
import {AuthService} from "../../../application/auth.service";
import {UserRepository} from "../../../../users/repositories/user.repository";

export class EmailConfirmationHandler {

    constructor(private authService: AuthService, private usersRepository: UserRepository) {}

    async execute (req: Request, res: Response): Promise<void> {

        const code: string = req.body.code;

        let userExist: User | null = await this.usersRepository.findByCode(code);

        if (!userExist) {
            res.status(400).json({
                errorsMessages: [{ message: "User not found", field: "code" }],

            });
            return;
        }
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

        await this.authService.update(userExist);

        res.sendStatus(204);

    }

}