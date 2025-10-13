import { JwtPayloadUser } from '../../features/auth/types/jwt-payload-user.type';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayloadUser | null;
        }
    }
}
