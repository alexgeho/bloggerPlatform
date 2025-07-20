import { WithId } from 'mongodb';
import { Blog } from '../../domain/blog';
import {BlogDataOutput} from "../output/blog-data.output";

export function mapToBlogOutput(blog: WithId<Blog>): BlogDataOutput {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    };
}
