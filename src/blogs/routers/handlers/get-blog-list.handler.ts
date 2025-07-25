import { Request, Response } from 'express';
import { blogsService } from '../../application/blogs.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapToBlogListPaginatedOutput } from '../mappers/map-to-blog-list-paginated-output.util';
import { BlogQueryInput } from '../input/blog-query.input';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import {PaginationAndSorting} from "../../../core/types/pagination-and-sorting";
import {BlogSortField} from "../input/blog-sort-field";
import {blogsQwRepository} from "../../repositories/blogsQwRepository";

export async function getBlogListHandler(req: Request, res: Response) {
    try {
        const queryInput = setDefaultSortAndPaginationIfNotExist(
            req.query as Partial<PaginationAndSorting<BlogSortField>> & { searchNameTerm?: string }
        ) as BlogQueryInput;

        const { items, totalCount } = await blogsQwRepository.findMany(queryInput);

        const blogsListOutput = mapToBlogListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
        });

        res.send(blogsListOutput);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}
