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
    },

    delete(id: number): void {
        const index = db.blogs.findIndex((v) => v.id === id);

        if (index === -1) {
            throw new Error('Driver not exist');
        }

        db.blogs.splice(index, 1);
        return;
    }


}