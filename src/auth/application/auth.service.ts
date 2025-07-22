import {userService} from "../../users/application/user.service";

export const authService = {

    async checkCredentials(loginOrEmail: string, password: string) {

        return userService.checkCredentials(loginOrEmail, password)

    }

};
