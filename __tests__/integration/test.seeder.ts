import { RegistrationDto } from '../../src/features/auth/types/registration.dto';

function unique(s: string) {
    return `${s}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const testSeeder = {
    createRegistrationDto(overrides: Partial<RegistrationDto> = {}): RegistrationDto {
        const login = overrides.login ?? unique('user');
        const email = overrides.email ?? `${login}@example.com`;
        const password = overrides.password ?? 'P@ssw0rd!';
        return { login, email, password };
    }
};