import { userService } from "../../users/application/user.service";

export const authService = {
    async checkCredentials(loginOrEmail: string, password: string): Promise<boolean> {
        // Просто проксируешь в userService
        return userService.checkCredentials(loginOrEmail, password);
    },
    // Можно будет добавить что-то своё позже
};
