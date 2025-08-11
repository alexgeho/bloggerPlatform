
import { MongoMemoryServer } from 'mongodb-memory-server';
import { runDB, dropDb, stopDb } from '../../src/db/mongo.db';
import { authService } from '../../src/features/auth/application/auth.service';
import { emailAdapter } from '../../src/features/auth/adapters/email.adapter';
import { testSeeder } from './test.seeder';
import {ResultStatus} from "../../src/features/auth/common/result/resultCode";

describe('AUTH-INTEGRATION', () => {
    let mongod: MongoMemoryServer;

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        await runDB(mongod.getUri());
    });

    beforeEach(async () => {
        await dropDb();
        jest.clearAllMocks();
        jest.spyOn(emailAdapter, 'sendEmail').mockResolvedValue(true); // важно: sendEmail: Promise<void>
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
            // сигнатура: (email, subject, html)
            const [to, subject, html] = (emailAdapter.sendEmail as jest.Mock).mock.calls[0];
            expect(to).toBe(dto.email);
            expect(subject).toBe('Confirm your registration');
            expect(html).toContain(user!.emailConfirmation.confirmationCode);
        });

        it('should NOT register the same user twice', async () => {

            const dto = testSeeder.createRegistrationDto();

            await testSeeder.insert (dto);


            const result = await authService.create(dto);

            expect(result).toBeNull();

        });
    });
});
