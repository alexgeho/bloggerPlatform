export class UnauthorizedError extends Error {
    statusCode: number;
    field?: string;

    constructor(message: string = 'Unauthorized', field?: string) {
        super(message);
        this.name = 'UnauthorizedError';
        this.statusCode = 401;
        this.field = field;

        // Важно: сохранить прототип, иначе instanceof не будет работать
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}
