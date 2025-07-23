import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapToUserListPaginatedOutput } from '../mappers/map-to-user-list-paginated-output.util';
import { UserQueryInput } from '../input/user-query.input';
import { setDefaultSortAndPaginationIfNotExist } from '../../../core/helpers/set-default-sort-and-pagination';
import {PaginationAndSorting} from "../../../core/types/pagination-and-sorting";
import {UserSortField} from "../input/user-sort-field";
import {usersQwRepository} from "../../repositories/usersQwRepository";

export async function getUserListHandler(req: Request, res: Response) {
    try {
        const paginationAndSorting = setDefaultSortAndPaginationIfNotExist(
            req.query as Partial<PaginationAndSorting<UserSortField>>
        );

        // Вот здесь добавляем нужные поля для поиска!
        const queryInput: UserQueryInput = {
            ...paginationAndSorting,
            login: req.query.searchLoginTerm ?? "",
            email: req.query.searchEmailTerm ?? "",
        };

        const { items, totalCount } = await usersQwRepository.findMany(queryInput);

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

