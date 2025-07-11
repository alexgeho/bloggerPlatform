import { WithId } from 'mongodb';
import { Blog } from '../../domain/blog';
import { BlogOutput } from '../output/blog.output';
import { ResourceType } from '../../../core/types/resource-type';

export function mapToBlogOutput(blog: WithId<Blog>): BlogOutput {
    return {
        type: ResourceType.Blogs,
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: true
    };
}


// import {WithId} from 'mongodb';
// import {Blog} from '../../domain/blog';
// import {BlogDataOutput} from '../output/blog-data.output';
//
// export function mapToBlogViewModel (blog: WithId<Blog>): BlogDataOutput {
//     return {
//         id: blog._id.toString(),
//         name: blog.name,
//         description: blog.description,
//         websiteUrl: blog.websiteUrl,
//         createdAt: blog.createdAt,
//         isMembership: false
//     };
// }