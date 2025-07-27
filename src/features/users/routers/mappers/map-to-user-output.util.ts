import { WithId } from 'mongodb';
import { User } from '../../domain/user';
import {UserDataOutput} from "../output/user-data.output";

export function mapToUserOutput(user: WithId<User>): UserDataOutput {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: new Date().toISOString()
    };
}
