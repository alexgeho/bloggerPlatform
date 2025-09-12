import {Request, Response} from 'express';
import {RegistrationDto} from "../../../types/registration.dto";
import {AuthService} from "../../../application/auth.service";

export class RegistrationHandler {

    constructor(private authService: AuthService, private usersRepository: any) {
    }

    async execute(req: Request, res: Response): Promise<void> {

        try {

            const dto: RegistrationDto = req.body;

            const userExist = await this.usersRepository.findByLoginOrEmail(dto.login, dto.email);

            if (userExist) {
                if (userExist.accountData.email === dto.email) {
                    res.status(400).json({
                        errorsMessages: [{message: "email is already exist", field: "email"}],

                    });
                    return
                }

                if (userExist.accountData.login === dto.login) {
                    res.status(400).json({
                        errorsMessages: [{message: "login is already exist", field: "login"}],
                    });
                    return
                }
            }

            await this.authService.create(dto)

            res.sendStatus(204);

        } catch (error) {
            res.status(400).json({
                errorsMessages: [
                    {
                        message: "User with this email or login already exists",
                        field: "email",
                    },
                ],
            });


        }


    }


}