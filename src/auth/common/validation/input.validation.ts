// import { ValidationError, validationResult } from 'express-validator';
// import { Request, Response, NextFunction } from 'express';
//
// export const inputValidation = (req: Request, res: Response, next: NextFunction) => {
//     const errorFormatter = (error: ValidationError) => {
//         return {
//             message: error.msg,
//             field: error.param,
//         };
//     };
//
//     const result = validationResult(req).formatWith(errorFormatter);
//
//     if (!result.isEmpty()) {
//         return res.status(400).send({ errorsMessages: result.array({ onlyFirstError: true }) });
//     }
//
//     return next();
// };
//