// import {Request, Response} from 'express';
//
//
// export async function getEmailConfirmationHandler(
//     req: Request,
//     res: Response) {
//
//     const code = req.params.code;
// const email = req.???.email;
//
// const userExist = await usersQwRepository.findByEmail(email);
//
// if (!userExist) {
//     res.sendStatus(404);
//     return;
// }
//
// if (userExist.code === code) {
//
//
//    const userExist = {
//         ...userExist,
//         isEmailConfirmed: true,
//     };
//
// }
//
// }