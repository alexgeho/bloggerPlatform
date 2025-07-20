import {BlogDataOutput} from './blog-data.output'
import {PaginatedOutput} from "../../../core/types/paginated.output";

export type BlogListPaginatedOutput = PaginatedOutput & {
    items: BlogDataOutput [];
};
