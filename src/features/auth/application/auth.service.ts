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


export const authService = {

    async create(dto: RegistrationDto): Promise<User | null> {

        const userExist = await userRepository.findOne(dto)

        if (userExist) return null;

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(dto.password, passwordSalt);

        const userNew: User = new UserEntity (dto.login, dto.email, passwordHash, passwordSalt)

        await userRepository.create(userNew)

        await emailManager
            .sendConfirmationEmail(userNew.accountData.email, userNew.emailConfirmation.confirmationCode);
        return userNew;
    },

    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash;
    },

    async update(user: User): Promise<void> {
        await userRepository.updateConfirmation(user)
    },

    async loginUser(loginOrEmail: string, password: string) {

        const user = await userRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) return { status: ResultStatus.Unauthorized, extensions: [{ field: "loginOrEmail", message: "User not found" }] };

        const isValid = await bcrypt.compare(password, user.accountData.passwordHash);
        if (!isValid) return { status: ResultStatus.Unauthorized, extensions: [{ field: "password", message: "Invalid password" }] };

        const accessToken = await jwtService.createToken(user._id.toString(), user.accountData.login);
        const refreshToken = await jwtService.createRefreshToken(user._id.toString(), user.accountData.login);

        return { status: ResultStatus.Success, data: { accessToken, refreshToken } };
    },

    async refreshByToken(refreshToken: string): Promise<{ status: ResultStatus; data?: any; extensions?: any }> {
        const isBlacklisted = await authRepository.isTokenBlacklisted(refreshToken);
        if (isBlacklisted) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{ field: 'refreshToken', message: 'Token is blacklisted' }]
            };
        }


        const payload = await jwtService.verifyRefreshToken(refreshToken);
        if (!payload) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{ field: 'refreshToken', message: 'Invalid or expired token' }]
            };
        }

        const accessToken = await jwtService.createToken(payload.userId, payload.userLogin);
        const newRefreshToken = await jwtService.createRefreshToken(payload.userId, payload.userLogin);

        await authRepository.blacklistToken(refreshToken); // заносим старый токен в черный список

        return {
            status: ResultStatus.Success,
            data: { accessToken, refreshToken: newRefreshToken }
        };
    },

    async blacklistToken(token: string): Promise<void> {
        await authRepository.blacklistToken(token);
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
