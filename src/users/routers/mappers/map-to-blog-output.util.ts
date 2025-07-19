import { WithId } from 'mongodb';
import { User } from '../../domain/user';
import {BlogDataOutput} from "../output/blog-data.output";

export function mapToBlogOutput(blog: WithId<User>): BlogDataOutput {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    };
}
