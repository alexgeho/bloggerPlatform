import {AuthService} from "../../../application/auth.service";


export class NewPasswordHandler {

    constructor(private authService: AuthService) {}

    async execute(req: any, res: any): Promise<void> {
        try {
            const { newPassword, recoveryCode } = req.body;
            console.log("req.body :", newPassword, recoveryCode);

            await this.authService.newPassword(newPassword, recoveryCode);

            res.sendStatus(204);
        } catch (e: any) {
            return res.status(400).send({
                errorsMessages: [
                    { message: e.message || "Invalid recovery code", field: "recoveryCode" }
                ]
            });
        }
    }}