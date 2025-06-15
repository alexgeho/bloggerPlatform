import request from 'supertest';
import { setupApp } from "../../../src/setup-app";
import express from 'express';
import {BlogInputDto} from "../../../src/blogs/dto/blog.input-dto";
import {HttpStatus} from "../../../src/core/types/http-statuses";

describe ('Blog Api body validation check', () => {
    const app = express();
    setupApp(app);

    const testBlogData: BlogInputDto = {
        name: "name",
        description: "title",
        websiteUrl: "name"
    };

    beforeAll(async () => {
            await request(app).delete('/testing/all-data').expect(HttpStatus.NoContent);
    });


    it('should create blog; POST /blogs', async () => {
        const newBlog: BlogInputDto = {
            ...testBlogData,
            name: 'Feodor',
            description: 'feodor@example.com',
        };

        await request(app)
            .post('/blogs')
            .send(newBlog)
            .expect(HttpStatus.Created);
    });

    
    
    it('should return blogs list; GET /blogs', async () => {
        await request(app)
            .post('/blogs')
            .send({ ...testBlogData, name: 'Another blog' })
            .expect(HttpStatus.Created);

        await request(app)
            .post('/blogs')
            .send({ ...testBlogData, name: 'Another blog2' })
            .expect(HttpStatus.Created);

        const blogListResponse = await request(app)
            .get('/blogs')
            .expect(HttpStatus.Ok);

        expect(blogListResponse.body).toBeInstanceOf(Array);
        expect(blogListResponse.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should return blog by id; GET /blogs/:id', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .send({ ...testBlogData, name: 'Another test' })
            .expect(HttpStatus.Created);

        const getResponse = await request(app)
            .get(`/blogs/${createResponse.body.id}`)
            .expect(HttpStatus.Ok);

        expect(getResponse.body).toEqual({
            ...createResponse.body,
            id: expect.any(Number),
            createdAt: expect.any(String),
        });
    });

    
    
    it('should update blog; PUT /blogs/:id', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .send({ ...testBlogData, name: 'Another Test' })
            .expect(HttpStatus.Created);

        const blogUpdateData: BlogInputDto = {
            name: "name",
            description: "title",
            websiteUrl: "name"
            
        };

        await request(app)
            .put(`/blogs/${createResponse.body.id}`)
            .send(blogUpdateData)
            .expect(HttpStatus.NoContent);

        const blogResponse = await request(app).get(
            `/blogs/${createResponse.body.id}`,
        );

        expect(blogResponse.body).toEqual({
            ...blogUpdateData,
            id: createResponse.body.id,
            createdAt: expect.any(String),
        });
    });

    it('DELETE /blogs/:id and check after NOT FOUND', async () => {
        const {
            body: { id: createdBlogId },
        } = await request(app)
            .post('/blogs')
            .send({ ...testBlogData, name: 'Another Test Bitau' })
            .expect(HttpStatus.Created);

        await request(app)
            .delete(`/blogs/${createdBlogId}`)
            .expect(HttpStatus.NoContent);

        const blogResponse = await request(app).get(
            `/blogs/${createdBlogId}`,
        );
        expect(blogResponse.status).toBe(HttpStatus.NotFound);
    });

});



