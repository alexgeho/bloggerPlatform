import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { mapToBlogOutput } from '../mappers/map-to-blog-output.util';
import { blogsService } from '../../application/blogs.service';
import { errorsHandler } from '../../../core/errors/errors.handler';

export async function getBlogHandler(
    req: Request<{ id: string }>,
    res: Response,
) {
    try {
        const id = req.params.id;

        const driver = await blogsService.findByIdOrFail(id);

        const driverOutput = mapToBlogOutput(driver);

        res.status(HttpStatus.Ok).send(driverOutput);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}
