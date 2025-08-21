// Новый authService без setDevices и _devices, все работает через import'нутый devicesService напрямую

import bcrypt from "bcrypt";
import { userRepository } from "../../users/repositories/user.repository";
import { ResultStatus } from "../common/result/resultCode";
import { jwtService, createRefreshTokenWithDevice, verifyRefreshTokenWithDevice } from "../adapters/jwt.service";
import { User } from "../domain/user";
import { add } from "date-fns";
import { emailManager } from "../adapters/email.manager";
import { v4 as uuidv4 } from 'uuid';
import { RegistrationDto } from "../types/registration.dto";
import { UserEntity } from "../domain/user.entity";
import { authRepository } from "../repositories/auth.repository";
import { devicesService} from "./devicesService";
import { ENV } from "../../../core/config/env";
import { RateLimiterService } from "./rateLimiter.service";

export const authService = {
    rateLimiter: new RateLimiterService(),

    async create(dto: RegistrationDto): Promise<User | null> {
        const userExist = await userRepository.findOne(dto);
        if (userExist) return null;

        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(dto.password, passwordSalt);

        const userNew: User = new UserEntity(dto.login, dto.email, passwordHash, passwordSalt);
        await userRepository.create(userNew);
        await emailManager.sendConfirmationEmail(userNew.accountData.email, userNew.emailConfirmation.confirmationCode);
        return userNew;
    },

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt);
    },

    async update(user: User): Promise<void> {
        await userRepository.updateConfirmation(user);
    },

    async loginUser(loginOrEmail: string, password: string, ip: string, userAgent: string) {

        if (this.rateLimiter.isBlocked(ip)) {
            return {
                status: ResultStatus.TooManyRequests,
                extensions: [{ field: 'ip', message: 'Too many login attempts. Try again later.' }],
            };
        }
        this.rateLimiter.addAttempt(ip);

        const user = await userRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) return { status: ResultStatus.Unauthorized, extensions: [{ field: "loginOrEmail", message: "User not found" }] };

        const isValid = await bcrypt.compare(password, user.accountData.passwordHash);
        if (!isValid) return { status: ResultStatus.Unauthorized, extensions: [{ field: "password", message: "Invalid password" }] };

        const userId = user._id.toString();
        const userLogin = user.accountData.login;
        const accessToken = await jwtService.createToken(userId, userLogin);

        const deviceId: string = await devicesService.createOnLogin(userId, ip, userAgent);

        const refreshToken = await createRefreshTokenWithDevice(userId, userLogin, userAgent, deviceId);

        return { status: ResultStatus.Success, data: { accessToken, refreshToken } };
    },

    async refreshByToken(refreshToken: string) {

    const payload = await jwtService.verifyRefreshToken(refreshToken)

        if (!payload) {
            return { status: ResultStatus.Unauthorized, extensions: [{ field: 'refreshToken', message: 'Invalid or expired token' }] };
        }



        // const isBlacklisted = await authRepository.isTokenBlackListed(refreshToken);
        // if (isBlacklisted) {
        //     return { status: ResultStatus.Unauthorized, extensions: [{ field: 'refreshToken', message: 'Token is blacklisted' }] };
        // }
        //
        // const devPayload = await verifyRefreshTokenWithDevice(refreshToken);
        // if (!devPayload) {
        //     return { status: ResultStatus.Unauthorized, extensions: [{ field: 'refreshToken', message: 'Invalid or expired token' }] };
        // }
        //
        // const { userId, userLogin, deviceId } = devPayload;
        // const sessions = await devicesService.list(userId);
        // const own = sessions.find(s => s.deviceId === deviceId);
        // if (!own) {
        //     return { status: ResultStatus.Unauthorized, extensions: [{ field: 'refreshToken', message: 'Session not found' }] };
        // }
        //
        // const newRefresh = await createRefreshTokenWithDevice(userId, userLogin, deviceId);
        // const np = await verifyRefreshTokenWithDevice(newRefresh);
        // if (!np) return { status: ResultStatus.Unauthorized, extensions: [{ field: 'refreshToken', message: 'Unable to refresh token' }] };
        //
        // await devicesService.updateOnRefresh(userId, deviceId, np.iat, np.exp);
        // const newAccess = await jwtService.createToken(userId, userLogin);
        // await authRepository.blacklistToken(refreshToken);
        //
        // return { status: ResultStatus.Success, data: { accessToken: newAccess, refreshToken: newRefresh } };
    },

    async blacklistToken(token: string): Promise<void> {
        await authRepository.blacklistToken(token);
        const p = await verifyRefreshTokenWithDevice(token);
        if (p) {
            try { await devicesService.deleteCurrent(p.userId, p.deviceId); } catch {}
        }
    },

    async isTokenBlackListed(token: string): Promise<boolean> {
        return await authRepository.isTokenBlackListed(token);
    },

    async resendEmail(user: User): Promise<void> {
        const newCode = uuidv4();
        const newExpirationDate = add(new Date(), { hours: 1, minutes: 30 });
        user.emailConfirmation.confirmationCode = newCode;
        user.emailConfirmation.expirationDate = newExpirationDate;

        await userRepository.uptateCodeAndDate(user);
        await emailManager.sendConfirmationEmail(user.accountData.email, newCode);
    }
};
