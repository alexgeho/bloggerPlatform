import bcrypt from "bcrypt";
import { userRepository } from "../../users/repositories/user.repository";
import { ResultStatus } from "../common/result/resultCode";
import { jwtService } from "../adapters/jwt.service";
import { User } from "../domain/user";
import { add } from "date-fns";
import { emailManager } from "../adapters/email.manager";
import { v4 as uuidv4 } from 'uuid';
import { RegistrationDto } from "../types/registration.dto";
import { UserEntity } from "../domain/user.entity";
import { authRepository } from "../repositories/auth.repository";

// 🆕 устройства
import { DevicesService } from "./devicesService";
import { createRefreshTokenWithDevice, verifyRefreshTokenWithDevice } from "../adapters/jwt.service";
import {ENV} from "../../../core/config/env";
import {HttpStatus} from "../../../core/types/http-statuses";
import {RateLimiterService} from "./rateLimiter.service";

export const authService = {




    _devices: undefined as DevicesService | undefined,
    setDevices(service: DevicesService) { this._devices = service; },

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
        const hash = await bcrypt.hash(password, salt);
        return hash;
    },

    async update(user: User): Promise<void> {
        await userRepository.updateConfirmation(user);
    },

    rateLimiter: new RateLimiterService(),

    async loginUser(loginOrEmail: string, password: string, ip: string, userAgent: string) {

        if (this.rateLimiter.isBlocked(ip)) {
            return {
                status: ResultStatus.TooManyRequests,
                extensions: [{ field: 'ip', message: 'Too many login attempts. Try again later.' }],
            };
        }

// 2. Register current attempt
        this.rateLimiter.addAttempt(ip);

        const user = await userRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) return { status: ResultStatus.Unauthorized, extensions: [{ field: "loginOrEmail", message: "User not found" }] };

        const isValid = await bcrypt.compare(password, user.accountData.passwordHash);
        if (!isValid) return { status: ResultStatus.Unauthorized, extensions: [{ field: "password", message: "Invalid password" }] };

        const userId = user._id.toString();
        const userLogin = user.accountData.login;

        const accessToken = await jwtService.createToken(userId, userLogin);

     // REFRESH TOKEN
        let refreshToken: string;

        if (this._devices) {
            // Получаем текущую дату в формате iat/exp (время создания и истечения токена)
            const iat = Math.floor(Date.now() / 1000); // текущий timestamp в секундах
            const exp = iat + ENV.JWT_REFRESH_EXP_SEC; // прибавляем TTL токена


            // Создаём запись в БД устройства и получаем его id
            const deviceId = await this._devices.createOnLogin({
                userId,
                ip,
                userAgent,
                iat,
                exp,
            });

            // Генерируем refresh токен с deviceId
            refreshToken = await createRefreshTokenWithDevice(userId, userLogin, deviceId);
        } else {
            // Режим без отслеживания устройств (fallback)
            refreshToken = await jwtService.createRefreshToken(userId, userLogin);
        }

        return { status: ResultStatus.Success, data: { accessToken, refreshToken } };
        },

        // ✅ публичный контракт не менялся
    async refreshByToken(refreshToken: string): Promise<{ status: ResultStatus; data?: any; extensions?: any }> {
        const isBlacklisted = await authRepository.isTokenBlackListed(refreshToken);
        if (isBlacklisted) {
            return { status: ResultStatus.Unauthorized, extensions: [{ field: 'refreshToken', message: 'Token is blacklisted' }] };
        }

        // 🆕 сначала пытаемся device‑aware верификацию
        const devP = await verifyRefreshTokenWithDevice(refreshToken);
        if (devP && this._devices) {
            const { userId, userLogin, deviceId } = devP;
            const sessions = await this._devices.list(userId);
            const own = sessions.find(s => s.deviceId === deviceId);
            if (!own) {
                return { status: ResultStatus.Unauthorized, extensions: [{ field: 'refreshToken', message: 'Session not found' }] };
            }

            const newRefresh = await createRefreshTokenWithDevice(userId, userLogin, deviceId);
            const np = await verifyRefreshTokenWithDevice(newRefresh);
            if (!np) return { status: ResultStatus.Unauthorized, extensions: [{ field: 'refreshToken', message: 'Unable to refresh token' }] };

            await this._devices.updateOnRefresh(userId, deviceId, np.iat, np.exp);

            const newAccess = await jwtService.createToken(userId, userLogin);
            await authRepository.blacklistToken(refreshToken); // why: защита от повторного использования
            return { status: ResultStatus.Success, data: { accessToken: newAccess, refreshToken: newRefresh } };
        }

        // ♻️ legacy путь (старые токены без deviceId)
        const payload = await jwtService.verifyRefreshToken(refreshToken);
        if (!payload) {
            return { status: ResultStatus.Unauthorized, extensions: [{ field: 'refreshToken', message: 'Invalid or expired token' }] };
        }

        const accessToken = await jwtService.createToken(payload.userId, payload.userLogin);
        const newRefreshToken = await jwtService.createRefreshToken(payload.userId, payload.userLogin);

        await authRepository.blacklistToken(refreshToken);
        return { status: ResultStatus.Success, data: { accessToken, refreshToken: newRefreshToken } };
    },

    // ♻️ расширено: удаляем сессию устройства при логауте (если токен новый)
    async blacklistToken(token: string): Promise<void> {
        await authRepository.blacklistToken(token);
        if (this._devices) {
            const p = await verifyRefreshTokenWithDevice(token);
            if (p) {
                try { await this._devices.deleteCurrent(p.userId, p.deviceId); } catch { /* ignore */ }
            }
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