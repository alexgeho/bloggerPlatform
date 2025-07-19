import {PaginatedOutput} from "../../../core/types/paginated.output";
import {UserDataOutput} from "./user-data.output";

export type UserListPaginatedOutput = PaginatedOutput & {
    items: UserDataOutput [];
};
