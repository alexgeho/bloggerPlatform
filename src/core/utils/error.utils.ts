import { validationError } from '../../blogs/types/validationerror';

export const createErrorMessages = (
    errors: validationError[],
): { errorsMessages: validationError[] } => {
    return { errorsMessages: errors };
};
