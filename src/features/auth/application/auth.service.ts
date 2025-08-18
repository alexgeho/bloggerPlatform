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

export const authService = {
    // 🆕 DI-слой для устройств
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

    // ✅ публичный контракт не менялся
    async loginUser(loginOrEmail: string, password: string) {
        const user = await userRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) return { status: ResultStatus.Unauthorized, extensions: [{ field: "loginOrEmail", message: "User not found" }] };

        const isValid = await bcrypt.compare(password, user.accountData.passwordHash);
        if (!isValid) return { status: ResultStatus.Unauthorized, extensions: [{ field: "password", message: "Invalid password" }] };

        const userId = user._id.toString();
        const userLogin = user.accountData.login;

        const accessToken = await jwtService.createToken(userId, userLogin);

        // 🆕 если сервис устройств подключён — выпускаем refresh с deviceId и регистрируем сессию
        let refreshToken: string;
        if (this._devices) {
            // why: нужен iat/exp для lastActiveDate — используем временный токен
            const tmp = await createRefreshTokenWithDevice(userId, userLogin, 'tmp');
            const tmpP = await verifyRefreshTokenWithDevice(tmp);
            if (!tmpP) {
                // fallback на старую логику (редкий случай повреждения)
                refreshToken = await jwtService.createRefreshToken(userId, userLogin);
            } else {
                const deviceId = await this._devices.createOnLogin({
                    userId,
                    ip: 'unknown',          // можно прокинуть реальный ip/ua позже, контракт метода не меняется
                    userAgent: 'Unknown device',
                    iat: tmpP.iat,
                    exp: tmpP.exp,
                });
                refreshToken = await createRefreshTokenWithDevice(userId, userLogin, deviceId);
            }
        } else {
            // legacy режим без устройств
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