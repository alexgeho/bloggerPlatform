"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToBlogOutput = mapToBlogOutput;
function mapToBlogOutput(blog) {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    };
}
//# sourceMappingURL=map-to-blog-output.util.js.map