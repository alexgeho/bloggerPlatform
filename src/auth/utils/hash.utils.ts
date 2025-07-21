import bcrypt from 'bcryptjs';

export async function generateHash(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
}
