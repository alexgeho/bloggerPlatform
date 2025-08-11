import {ObjectId} from "mongodb";
import {userRepository} from "../../users/repositories/user.repository";
import {RegistrationDto} from "../types/registration.dto";
import bcrypt from "bcrypt";
import {randomUUID} from "node:crypto";
import {User} from "../domain/user";
import {add} from "date-fns";
import {emailManager} from "../adapters/email.manager";
import {ResultStatus} from "../common/result/resultCode";
import {jwtService} from "../adapters/jwt.service";
import {v4 as uuidv4} from "uuid";
import {UserEntity} from "../domain/user.entity";


export const authService = {


    async create(dto: RegistrationDto): Promise<User | null> {

        const userExist = await userRepository.findOne(dto)

        if (userExist) return null;

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(dto.password, passwordSalt);

        const userNew: User = new UserEntity (dto.login, dto.email,passwordHash, passwordSalt)

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

        if (!user) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{ field: "loginOrEmail", message: "User not found" }]
            };
        }

        // if (!user.emailConfirmation.isConfirmed) {
        //     return {
        //         status: ResultStatus.Unauthorized,
        //         extensions: [{ field: "email", message: "Email not confirmed" }]
        //     };
        // }

        const isValid = await bcrypt.compare(password, user.accountData.passwordHash);

        if (!isValid) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{ field: "password", message: "Invalid password" }]
            };
        }

        const accessToken = await jwtService.createToken(
            user._id.toString(),
            user.accountData.login
        );

        return {
            status: ResultStatus.Success,
            data: { accessToken }
        };
    },

    async resendEmail(user: User): Promise<void> {

        const newCode = uuidv4();
        const newExpirationDate = add(new Date(), { hours: 1, minutes: 30 });

        user.emailConfirmation.confirmationCode = newCode;
        user.emailConfirmation.expirationDate = newExpirationDate;

        await userRepository.uptateCodeAndDate(user);

        await emailManager.sendConfirmationEmail(user.accountData.email, newCode);

    }






    // async checkUserCredentials(
    //     loginOrEmail: string,
    //     password: string,
    // ): Promise<Result<WithId<IUserDB> | null>> {
    //     const user = await userRepository.findByLoginOrEmail(loginOrEmail);
    //     if (!user)
    //         return {
    //             status: ResultStatus.NotFound,
    //             data: null,
    //             errorMessage: 'Not Found',
    //             extensions: [{ field: 'loginOrEmail', message: 'Not Found' }],
    //         };
    //
    //     const isPassCorrect = await bcryptService.checkPassword(password, user.passwordHash);
    //     if (!isPassCorrect)
    //         return {
    //             status: ResultStatus.BadRequest,
    //             data: null,
    //             errorMessage: 'Bad Request',
    //             extensions: [{ field: 'password', message: 'Wrong password' }],
    //         };
    //
    //     return {
    //         status: ResultStatus.Success,
    //         data: user,
    //         extensions: [],
    //     };
    // },
    //
    // async loginUser(loginOrEmail: string, password: string)
    //     : Promise<Result<{ accessToken: string } | null>> {
    //
    //     const result = await
    //         this.checkUserCredentials(loginOrEmail, password);
    //
    //     if (result.status !== ResultStatus.Success)
    //         return {
    //             status: ResultStatus.Unauthorized,
    //             errorMessage: 'Unauthorized',
    //             extensions: [{field: 'loginOrEmail', message: 'Wrong credentials'}],
    //             data: null,
    //         };
    //
    //     const accessToken = await jwtService
    //         .createToken(result.data!._id.toString(), result.data!.login);
    //
    //
    //     return {
    //         status: ResultStatus.Success,
    //         data: {accessToken},
    //         extensions: [],
    //     };
    //
    // },
    //
    // async checkUserCredentials(loginOrEmail: string, password: string)
    //     : Promise<Result<WithId<IUserDB> | null>> {
    //     const user
    //         = await userRepository.findByLoginOrEmail(loginOrEmail);
    //
    //     if (!user) {
    //         return {
    //             status: ResultStatus.NotFound,
    //             data: null,
    //             errorMessage: 'Not Found',
    //             extensions: [{field: 'loginOrEmail', message: 'Not Found'}],
    //         }
    //     }
    //
    //     const isPassCorrect = await bcryptService
    //         .checkPassword(password, user.passwordHash);
    //
    //     if (!isPassCorrect) {
    //         return {
    //             status: ResultStatus.BadRequest,
    //             data: null,
    //             errorMessage: 'Bad Request',
    //             extensions: [{field: 'password', message: 'Wrong password'}],
    //         };
    //     }
    //
    //     return {
    //         status: ResultStatus.Success,
    //         data: user,
    //         extensions: [],
    //     };
    // },
};
