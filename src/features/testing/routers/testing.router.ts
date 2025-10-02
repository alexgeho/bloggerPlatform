import { Request, Response, Router } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';

import {UserModel} from "../../auth/domain/user-mangoose.entity";
import {RateLimitModel} from "../../auth/domain/rate-limit.mangoose";
import {DeviceSessionModel} from "../../auth/domain/device-session.mangoose";
import {BlogModel} from "../../blogs/domain/blog.mangoose";
import {PostModel} from "../../posts/domain/post.mangoose";
import {CommentModel} from "../../comments/domain/comment.mangoose";
import {LikeModel} from "../../likes/domain/like.entity";

export const testingRouter = Router({});

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    //truncate db
    try{

        await Promise.all([

            BlogModel.deleteMany(),
            PostModel.deleteMany(),
            UserModel.deleteMany(),
            CommentModel.deleteMany(),
            DeviceSessionModel.deleteMany(),
            RateLimitModel.deleteMany(),
            LikeModel.deleteMany(),

        ]);
        res.sendStatus(HttpStatus.NoContent);

    } catch (e: unknown) {
    }


});
