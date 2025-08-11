// __tests__/integration/auth.integration.test.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import { runDB, dropDb, stopDb, userCollection } from '../../src/db/mongo.db';
import { authService } from '../../src/features/auth/application/auth.service';
import { emailAdapter } from '../../src/features/auth/adapters/email.adapter';
import { testSeeder } from './test.seeder';
import { ResultStatus } from '../../src/features/auth/common/result/resultCode'; // подстрой путь, если иной

describe('AUTH-INTEGRATION', () => {
    let mongod: MongoMemoryServer;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        await runDB(mongod.getUri());
    });

    beforeEach(async () => {
        await dropDb();
        jest.clearAllMocks();
        // почему: отключаем реальную отправку писем
        jest.spyOn(emailAdapter, 'sendEmail').mockResolvedValue(true as any);
    });

    afterAll(async () => {
        await dropDb();
        await stopDb();
        await mongod.stop();
    });

    describe('User Registration', () => {
        it('should register user, create confirmation code and send email', async () => {
            const dto = testSeeder.createRegistrationDto();

            const user = await authService.create(dto);

            expect(user).not.toBeNull();
            expect(user!.accountData.email).toBe(dto.email);
            expect(user!.emailConfirmation.confirmationCode).toEqual(expect.any(String));

            expect(emailAdapter.sendEmail).toHaveBeenCalledTimes(1);
            // (email, subject, html)
            const [to, subject, html] = (emailAdapter.sendEmail as jest.Mock).mock.calls[0];
            expect(to).toBe(dto.email);
            expect(subject).toBe('Confirm your registration');
            expect(html).toContain(user!.emailConfirmation.confirmationCode);
        });

        it('should NOT register the same user twice', async () => {
            const dto = testSeeder.createRegistrationDto();

            await testSeeder.insert(dto); // через сервис, письмо замокано

            const result = await authService.create(dto);

            expect(result).toBeNull();
            expect(emailAdapter.sendEmail).toHaveBeenCalledTimes(1); // письмо только при первом вызове
        });
    });

    describe('Confirm email', () => {
        const confirmEmailUseCase = (code: string) => authService.confirmEmail(code);

        it('should NOT confirm email if user does not exist', async () => {
            const result = await confirmEmailUseCase('non-existing-code');
            expect(result.status).toBe(ResultStatus.BadRequest);
        });

        it('should NOT confirm email which is already confirmed', async () => {
            const code = 'test-code';
            const { login, password, email } = testSeeder.createRegistrationDto();

            await testSeeder.insertUser({ login, password, email, code, isConfirmed: true });

            const result = await confirmEmailUseCase(code);
            expect(result.status).toBe(ResultStatus.BadRequest);
        });

        it('should NOT confirm email with expired code', async () => {
            const code = 'expired-code';
            const { login, password, email } = testSeeder.createRegistrationDto();

            await testSeeder.insertUser({
                login,
                password,
                email,
                code,
                expirationDate: new Date(Date.now() - 60_000)
            });

            const result = await confirmEmailUseCase(code);
            expect(result.status).toBe(ResultStatus.BadRequest);
        });

        it('should confirm email with valid code', async () => {
            const code = 'valid-code';
            const { login, password, email } = testSeeder.createRegistrationDto();

            const seeded = await testSeeder.insertUser({
                login,
                password,
                email,
                code,
                isConfirmed: false,
                expirationDate: new Date(Date.now() + 60 * 60_000)
            });

            const result = await confirmEmailUseCase(code);
            expect(result.status).toBe(ResultStatus.Success);

            const fresh = await userCollection.findOne({ _id: seeded.user._id });
            expect(fresh?.emailConfirmation.isConfirmed).toBe(true);
        });
    });
});
