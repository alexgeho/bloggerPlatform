import bcrypt from "bcrypt";
import { userRepository } from "../../users/repositories/user.repository";
import { ResultStatus } from "../common/result/resultCode";
import { jwtService } from "../adapters/jwt.service";

export const authService = {
    async loginUser(loginOrEmail: string, password: string) {
        const user = await userRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) return { status: ResultStatus.Unauthorized, extensions: [{ field: "loginOrEmail", message: "User not found" }] };

        const isValid = await bcrypt.compare(password, user.accountData.passwordHash);
        if (!isValid) return { status: ResultStatus.Unauthorized, extensions: [{ field: "password", message: "Invalid password" }] };

        const accessToken = await jwtService.createToken(user._id.toString(), user.accountData.login);
        const refreshToken = await jwtService.createRefreshToken(user._id.toString(), user.accountData.login);

        return { status: ResultStatus.Success, data: { accessToken, refreshToken } };
    },

    async refreshByToken(refreshToken: string) {
        const payload = await jwtService.verifyRefreshToken(refreshToken);
        if (!payload) return { status: ResultStatus.Unauthorized, extensions: [{ field: "refreshToken", message: "Invalid or expired" }] };

        const accessToken = await jwtService.createToken(payload.userId, payload.userLogin);
        const newRefreshToken = await jwtService.createRefreshToken(payload.userId, payload.userLogin);

        return { status: ResultStatus.Success, data: { accessToken, refreshToken: newRefreshToken } };
    },
};
