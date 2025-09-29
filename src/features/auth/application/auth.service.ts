import bcrypt from "bcrypt";
import {UserRepository} from "../../users/repositories/user.repository";
import {ResultStatus} from "../common/result/resultCode";
import {jwtService} from "../adapters/jwt.service";
import {User} from "../domain/user";
import {add} from "date-fns";
import {EmailManager} from "../adapters/email.manager";
import {v4 as uuidv4} from 'uuid';
import {RegistrationDto} from "../types/registration.dto";
import {UserClassEntity} from "../domain/user-class.entity";
import {devicesService} from "./devicesService";
import {LoginUserDto} from "../domain/login-DTO";
import {BcryptService} from "../adapters/bcrypt.service";
import {UserDocument, UserModel} from "../domain/user-mangoose.entity";


export class AuthService {

    constructor(protected userRepository: UserRepository, protected bcrypt: BcryptService, protected emailManager: EmailManager) {
    }



    async create(dto: RegistrationDto): Promise<User | null> {
try {

   const result = await UserModel.findOne({email: dto.email}, {login: dto.login}).exec();

   console.log('result:', result);

   if (result) {
       return null;
   }

    // const userExist = await this.userRepository.findOne(dto);

    // if (userExist) return null;

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(dto.password, passwordSalt);

    const userNew = new UserClassEntity(dto.login, dto.email, passwordHash, passwordSalt);

    const userNewDoc = new UserModel(userNew);

    // todo take away "await"
    await this.emailManager.sendConfirmationEmail(userNewDoc.accountData.email, userNewDoc.emailConfirmation.confirmationCode);

    console.log('userNewDoc before save: ', userNewDoc);

    await userNewDoc.save();

    console.log('userNewDoc after save: ', userNewDoc);

    return userNewDoc;
}

catch (e) {
    console.log('catch e: ', e);
    return null;
}


    }

    // return UserModel.create(userNew);
    //const createdUser = new UserModel(userNew);
    //await createdUser.save();

    // async createUser(dto: CreateUserDto) {
    //
    //     const user: UserDocument = new UserModel({
    //         user.accountData.login = dto.login,
    //         user.accountData.password = dto.password,
    //         user.accountData.email = dto.email,
    //     })
    //     await user.save()
    // }


    async newPassword(newPassword: string, recoveryCode: string) {

        console.log("RecoveryCode:", recoveryCode);

        const user: User | null = await this.userRepository.findByRecoveryCode(recoveryCode)

        console.log("User:", user);

        if (!user || user.emailConfirmation.expirationDate < new Date() ||
            user.emailRecovery.recoveryCode !== recoveryCode) {

            throw new Error("Invalid recovery code");


        }


        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(newPassword, passwordSalt);

        await this.userRepository.updateUserWithNewPassword(user, passwordHash, passwordSalt);


    }

    async passRecoveryEmail(email: string): Promise<{ success: boolean; error?: string }> {

        const isUserExist = await this.userRepository.findByEmail(email);

        if (!isUserExist) {
            return {success: false, error: "User with this email not found"};
        }


        const recoveryCode: string = uuidv4();
        const expirationDate: Date = add(new Date(), {hours: 1, minutes: 30});

        await this.userRepository.updatePasswordRecovery(email, recoveryCode, expirationDate);
        await this.emailManager.sendRecoveryCode(email, recoveryCode);


        return {success: true}
    }

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt);
    }

    async update(user: User): Promise<void> {
        await this.userRepository.updateConfirmation(user);
    }

    async loginUser({loginOrEmail, password, ip, userAgent}: LoginUserDto) {


        // taking user from db
        const user = await this.userRepository.findByLoginOrEmail(loginOrEmail);
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

    }

    async refreshTokens(refreshToken: string) {

        const payload = await jwtService.verifyRefreshToken(refreshToken)

        const session = await devicesService.findSessionByDeviceId(payload.deviceId)


        if (!session) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{field: 'refreshToken', message: 'Device session not found1'}]
            };
        }


        if (payload?.deviceId !== session._id.toString()) {

            return {
                status: ResultStatus.Unauthorized,
                extensions: [{field: 'refreshToken', message: 'Access denied 2'}]
            };
        }

        if (!session.expireAt || new Date(payload.exp * 1000).toISOString() !== session.expireAt.toISOString()) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{field: 'refreshToken', message: 'Access denied 3'}]
            };
        }


        const {userId, deviceId} = payload;

        const tokens = await jwtService.createAuthTokens(userId, deviceId);

        const accessToken = tokens.accessToken;
        const refreshTokenNew = tokens.refreshToken;

        const lastActiveDate = tokens.lastActiveDate
            ? new Date(tokens.lastActiveDate)
            : new Date();

        const expireAt = tokens.expireAt
            ? new Date(tokens.expireAt)
            : new Date();

        await devicesService.updateSessionWithData(userId, deviceId, lastActiveDate, expireAt);

        return {status: ResultStatus.Success, data: {accessToken, refreshTokenNew}};


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
    }

    async resendEmail(user: User, ip: string): Promise<void> {

        const newCode: string = uuidv4();
        const newExpirationDate: Date = add(new Date(), {hours: 1, minutes: 30});

        user.emailConfirmation.confirmationCode = newCode;
        user.emailConfirmation.expirationDate = newExpirationDate;

        await this.userRepository.uptateCodeAndDate(user);
        await this.emailManager.sendConfirmationEmail(user.accountData.email, newCode);
    }

    async terminateSession(userId: string, deviceId: string, userAgent: string, lastActiveDate: Number, expireAt: Number): Promise<boolean> {

        const session = await devicesService.findSessionByDeviceId(deviceId);

        if (!session || !session.lastActiveDate || !session.expireAt) {
            return false;
        }

        if (session.lastActiveDate.getTime() !== lastActiveDate) {
            return false;
        }

        if (session.expireAt.getTime() !== expireAt) {
            return false;
        }


        await devicesService.deleteDevice(userId, deviceId);

        return true;


    }

};
