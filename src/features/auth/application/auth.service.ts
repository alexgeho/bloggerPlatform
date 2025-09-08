import bcrypt from "bcrypt";
import {userRepository} from "../../users/repositories/user.repository";
import {ResultStatus} from "../common/result/resultCode";
import {jwtService} from "../adapters/jwt.service";
import {User} from "../domain/user";
import {add} from "date-fns";
import {emailManager} from "../adapters/email.manager";
import {v4 as uuidv4} from 'uuid';
import {RegistrationDto} from "../types/registration.dto";
import {UserEntity} from "../domain/user.entity";
import {authRepository} from "../repositories/auth.repository";
import {devicesService} from "./devicesService";
import {ENV} from "../../../core/config/env";
import {RateLimiterService} from "./rateLimiter.service";
import {response} from "express";
import jwt from "jsonwebtoken";
import {DeviceSession} from "../domain/device-session.entity";

type LoginUserDto = {
    loginOrEmail: string, password: string, ip: string, userAgent: string
}

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


    async loginUser({loginOrEmail, password, ip, userAgent}: LoginUserDto) {

        // attempt counter/limiter
        if (this.rateLimiter.isBlocked(ip)) {
            return {
                status: ResultStatus.TooManyRequests,
                extensions: [{field: 'ip', message: 'Too many login attempts. Try again later.'}],
            };
        }
        this.rateLimiter.addAttempt(ip);

        // taking user from db
        const user = await userRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) return {
            status: ResultStatus.Unauthorized,
            extensions: [{field: "loginOrEmail", message: "User not found"}]
        };

        const isValid = await bcrypt.compare(password, user.accountData.passwordHash);
        if (!isValid) return {
            status: ResultStatus.Unauthorized,
            extensions: [{field: "password", message: "Invalid password"}]
        };

        const userId = user._id.toString();

        const deviceId = await devicesService.createOrUpdateOnLogin(userId, ip, userAgent);

        const tokens = await jwtService.createAuthTokens(userId, deviceId);

        const accessToken = tokens.accessToken;
        const refreshToken = tokens.refreshToken;

        const lastActiveDate = tokens.lastActiveDate
            ? new Date(tokens.lastActiveDate)
            : new Date();

        const expireAt = tokens.expireAt
            ? new Date(tokens.expireAt)
            : new Date();

        await devicesService.updateSessionWithData(userId, deviceId, lastActiveDate, expireAt);

        return {status: ResultStatus.Success, data: {accessToken, refreshToken}};

    },

    async refreshTokens(refreshToken: string) {

        const payload = await jwtService.verifyRefreshToken(refreshToken)

        console.log('Payload from refresh token:', payload);

        const session = await devicesService.findSessionByDeviceId(payload.deviceId)

        console.log('Session from DB:', session);


        if (!session) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{field: 'refreshToken', message: 'Device session not found1'}]
            };
        }

        if (payload?.deviceId !== session._id) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{field: 'refreshToken', message: 'Access denied 2'}]
            };
        }

        const {userId, userLogin, userAgent, deviceId} = payload;

        const result = await jwtService.createAuthTokens(userId, deviceId);

        const newPayload: any = jwt.verify(result.refreshToken, ENV.RT_SECRET);


        await devicesService.updateSessionWithData(
            userId,
            deviceId,
            newPayload.lastActiveDate,
            newPayload.expireAt
        )


        return {
            status: ResultStatus.Success,
            data: {accessToken: result.accessToken, refreshToken: result.refreshToken}
        };


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

    async resendEmail(user: User, ip: string): Promise<void> {
        if (this.rateLimiter.isBlocked(ip)) {
            throw new Error("Too many requests"); // или res.sendStatus(429)
        }
        this.rateLimiter.addAttempt(ip);

        const newCode: string = uuidv4();
        const newExpirationDate: Date = add(new Date(), {hours: 1, minutes: 30});

        user.emailConfirmation.confirmationCode = newCode;
        user.emailConfirmation.expirationDate = newExpirationDate;

        await userRepository.uptateCodeAndDate(user);
        await emailManager.sendConfirmationEmail(user.accountData.email, newCode);
    }


};
