import {AuthService} from "../../../application/auth.service";


export class NewPasswordHandler {

    constructor(private readonly authService: AuthService) {}

    async execute (req: any, res: any) {

        try {
            const { newPassword, confirmationCode } = req.body;



            await this.authService.newPassword (newPassword, confirmationCode);

            res.sendStatus(204);

        } catch (e: any) {

            res.status(400).send({error: "Something went wrong"});
        }


    }

}