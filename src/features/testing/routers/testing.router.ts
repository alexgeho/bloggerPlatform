import { Request, Response, Router } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import {
    blacklistCollection,
    blogCollection,
    commentCollection,
    postCollection,
    userCollection
} from '../../../db/mongo.db';

export const testingRouter = Router({});

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    //truncate db
    try{

        await Promise.all([

            blogCollection.deleteMany(),
            postCollection.deleteMany(),
            userCollection.deleteMany(),
            commentCollection.deleteMany(),
            blacklistCollection.deleteMany(),

        ]);
        res.sendStatus(HttpStatus.NoContent);

    } catch (e: unknown) {
        console.log(e);
    }


});
