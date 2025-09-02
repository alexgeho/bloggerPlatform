import { Response } from 'express';
import { RepositoryNotFoundError } from './repository-not-found.error';
import { UnauthorizedError } from './UnauthorizedError'; // ✅ добавили
import { HttpStatus } from '../types/http-statuses';
import { createErrorMessages } from '../middlewares/validation/input-validtion-result.middleware';
import { DomainError } from './domain.error';

export function errorsHandler(error: unknown, res: Response): void {
    if (error instanceof RepositoryNotFoundError) {
        const httpStatus = HttpStatus.NotFound;

        res.status(httpStatus).send(
            createErrorMessages([
                { field: "common", message: error.message },
            ]),
        );
        return;
    }

    if (error instanceof DomainError) {
        const httpStatus = HttpStatus.UnprocessableEntity;

        res.status(httpStatus).send(
            createErrorMessages([
                { field: "common", message: error.message },
            ]),
        );
        return;
    }

    if (error instanceof UnauthorizedError) {
        const httpStatus = HttpStatus.Unauthorized;

        res.status(httpStatus).send(
            createErrorMessages([
                { field: error.field ?? "common", message: error.message },
            ]),
        );
        return;
    }

    console.error('error', error);
    res.status(HttpStatus.InternalServerError).send(
        createErrorMessages([
            { field: "common", message: "Internal server error" },
        ])
    );
}
