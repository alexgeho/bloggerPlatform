import {PostDataOutput} from './post-data.output'
import {PaginatedOutput} from "../../../../core/types/paginated.output";

export type PostListPaginatedOutput = PaginatedOutput & {
    items: PostDataOutput [];
};
