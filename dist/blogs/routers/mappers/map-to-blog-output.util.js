"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToBlogOutput = mapToBlogOutput;
const resource_type_1 = require("../../../core/types/resource-type");
function mapToBlogOutput(blog) {
    return {
        type: resource_type_1.ResourceType.Blogs,
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: false
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
