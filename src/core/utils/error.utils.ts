import { validationError } from '../../blogs/types/validationerror';

export const createErrorMessages = (
    errors: validationError[],
): { errorMessages: validationError[] } => {
    return { errorMessages: errors };
};
