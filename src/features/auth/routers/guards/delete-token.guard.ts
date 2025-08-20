import { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifyRefreshTokenWithDevice } from '../../adapters/jwt.service';
import {devicesService} from "../../application/devicesService";
import {deleteDeviceByIdHandler} from "../handlers/devicesHandlers/delete-deviceById.handler";




// const token = req.cookies?.refreshToken as string | undefined;
//
// if (!token) { res.sendStatus(401); return; }
//
// const verifyToken = await verifyRefreshTokenWithDevice(token);
//
//
// if (!verifyToken) { res.sendStatus(401); return; }
//
// // req.refresh = {
// //     userId: verifyToken.userId,
// //     deviceId: verifyToken.deviceId
// // };
// //
// // next();

// // augment Express Request with `refresh`
// declare global {
//     namespace Express { interface Request { refresh?: JwtRefreshWithDevice } }
// }
