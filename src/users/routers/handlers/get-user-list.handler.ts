import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapToUserListPaginatedOutput } from '../mappers/map-to-user-list-paginated-output.util';
import { UserQueryInput } from '../input/user-query.input';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import {PaginationAndSorting} from "../../../core/types/pagination-and-sorting";
import {UserSortField} from "../input/user-sort-field";
import {userGetRepository} from "../../repositories/user.get.repository";

export async function getUserListHandler(req: Request, res: Response) {
    try {
        const queryInput = setDefaultSortAndPaginationIfNotExist( req.query as Partial<PaginationAndSorting<UserSortField>>
                & { searchNameTerm?: string }
        ) as UserQueryInput;

        const { items, totalCount } = await userGetRepository.findMany(queryInput);

        const usersListOutput = mapToUserListPaginatedOutput(items, {
            pageNumber: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount,
        });

        res.send(usersListOutput);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}
