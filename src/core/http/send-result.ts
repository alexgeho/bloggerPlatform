import { Response } from 'express';
import { ResultStatus } from '../../features/auth/common/result/resultCode';

type ServiceResultLoose<T> = {
    status: ResultStatus;
    data?: T;
    extensions?: Array<{ field: string; message: string }> | Record<string, unknown>;
};

// why: убираем дублирование и не завязываемся на дискриминирующий union
export function sendResult<T>(res: Response, result: ServiceResultLoose<T>, successCode = 200) {
    if (result.status !== ResultStatus.Success) {
        const map: Record<string, number> = {
            [ResultStatus.Unauthorized]: 401,
            [ResultStatus.BadRequest]: 400,
            [ResultStatus.Forbidden]: 403,
            [ResultStatus.NotFound]: 404,
            [ResultStatus.InternalError]: 500,
        } as const;
        const code = map[result.status] ?? 400;
        return res.status(code).send(result.extensions ?? { message: result.status });
    }
    return res.status(successCode).send(result.data as any);
}