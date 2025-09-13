import {AuthService} from "../../../application/auth.service";


export class PasswordRecoveryHandler {

    constructor(protected authService: AuthService) {}

    async execute (req: any, res: any) {

        try {
            const {email} = req.body;

            await this.authService.passRecoveryEmail (email);

            res.sendStatus(204);

        } catch (e: any) {

            res.status(400).send({error: "Something went wrong"});
        }


    }

}