import { blog } from '../types/blog';
import { db } from '../../db/in-memory.db';
import { BlogInputDto } from '../dto/blog.input-dto';

export const blogsRepository = {


    findAll(): blog[] { return db.blogs },

    findById(id: number): blog | null {
        return db.blogs.find((d) => d.id === id) ?? null; },

    create(newBlog: blog): blog {
        db.blogs.push(newBlog);
        return newBlog;
    },

    update(id: number, dto: BlogInputDto): void {
        const blog = db.blogs.find((d) => d.id === id);

        if (!blog) {
            throw new Error('Blog not exist bitau');
        }

        blog.name = dto.name;
        blog.description = dto.description;
        blog.websiteUrl = dto.websiteUrl;

        return;
    }


}