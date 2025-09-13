import {AuthService} from "../../../application/auth.service";


export class PasswordRecoveryHandler {

    constructor(private readonly authService: AuthService) {}

    async execute (req: Request, res: Response) {

        const email = req.body;

        async this.authService.passRecoveryEmail (email);

    }

}