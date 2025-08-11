import { ObjectId } from 'mongodb';
import { add } from 'date-fns';
import { userCollection } from '../../src/db/mongo.db';
import { RegistrationDto } from '../../src/features/auth/types/registration.dto';
import { authService } from '../../src/features/auth/application/auth.service';

function unique(s: string) {
    return `${s}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export type SeedUserOpts = RegistrationDto & {
    code?: string;
    isConfirmed?: boolean;
    expirationDate?: Date;
};

export const testSeeder = {
    createRegistrationDto(overrides: Partial<RegistrationDto> = {}): RegistrationDto {
        const login = overrides.login ?? unique('user');
        const email = overrides.email ?? `${login}@example.com`;
        const password = overrides.password ?? 'P@ssw0rd!';
        return { login, email, password };
    },

    // как у тебя было — просто дергаем сервис
    async insert(dto: RegistrationDto) {
        return await authService.create(dto);
    },

    // прямое создание пользователя для тестов с кодами
    async insertUser(opts: SeedUserOpts) {
        const { login, email, password, code, isConfirmed, expirationDate } = opts;

        const _id = new ObjectId();
        const confirmationCode = code ?? `code_${_id.toHexString()}`;
        const confirmed = isConfirmed ?? false;
        const expiresAt = expirationDate ?? add(new Date(), { hours: 1, minutes: 30 });

        const doc = {
            _id,
            accountData: {
                login,
                email,
                passwordHash: `hash:${password}`, // в тестах можно фейк
                passwordSalt: 'seed',
                createdAt: new Date()
            },
            emailConfirmation: {
                confirmationCode,
                expirationDate: expiresAt,
                isConfirmed: confirmed
            }
        } as any;

        await userCollection.insertOne(doc);
        return { user: doc, code: confirmationCode };
    }
};
