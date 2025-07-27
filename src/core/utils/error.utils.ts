import { validationError } from '../../features/blogs/types/validationerror';

export const createErrorMessages = (
    errors: validationError[],
): { errorsMessages: validationError[] } => {
    return { errorsMessages: errors };
};
