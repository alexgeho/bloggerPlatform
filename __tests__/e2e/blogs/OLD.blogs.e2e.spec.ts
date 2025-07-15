import request from 'supertest';
import { setupApp } from "../../../src/setup-app";
import express from 'express';
import {BlogInputDto} from "../../../src/blogs/application/dtos/blog.input-dto";
import {HttpStatus} from "../../../src/core/types/http-statuses";

import {BLOGS_PATH} from "../../../src/core/paths/paths";
import {runDB} from "../../../src/db/mongo.db";
import {SETTINGS} from "../../../src/core/settings/settings";
// @ts-ignore
import {clearDb} from "../../utils/clear-db";

describe ('Blog Api body validation check', () => {
    const app = express();
    setupApp(app);

    const testBlogData: BlogInputDto = {
        name: "name",
        description: "title",
        websiteUrl: "name"
    };

    beforeAll(async () => {
        await runDB (SETTINGS.MONGO_URL);//
       // await clearDb(app);

        await request(app)
            .get('/')
            .expect(200)
    });


    it('should create blog; POST /blogs', async () => {
        const newBlog: BlogInputDto = {
            ...testBlogData,
            name: 'Feodor',
            description: 'feodor@example.com',
        };

        await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', 'adminToken')
            .send(newBlog)
            .expect(HttpStatus.Created);
    });

    
    
    it('should return blogs list; GET /blogs', async () => {
        await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', 'adminToken')
            .send({ ...testBlogData, name: 'Another blog' })
            .expect(HttpStatus.Created);

        await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', 'adminToken')
            .send({ ...testBlogData, name: 'Another blog2' })
            .expect(HttpStatus.Created);

        const blogListResponse = await request(app)
            .get(BLOGS_PATH)
            .expect(HttpStatus.Ok);

        expect(blogListResponse.body).toBeInstanceOf(Array);
        expect(blogListResponse.body.length).toBeGreaterThanOrEqual(2);
    });

    // it('should return blog by id; GET /blogs/:id', async () => {
    //     const createResponse = await request(app)
    //         .post(BLOGS_PATH)
    //         .set('Authorization', 'adminToken')
    //         .send({ ...testBlogData, name: 'Another test' })
    //         .expect(HttpStatus.Created);
    //
    //     const getResponse = await request(app)
    //         .get(/BLOGS_PATH/${createResponse.body.id})
    //         .expect(HttpStatus.Ok);
    //
    //     expect(getResponse.body).toEqual({
    //         ...createResponse.body,
    //         id: expect.any(Number),
    //         createdAt: expect.any(String),
    //     });
    // });

    
    
    it.skip('should update blog; PUT /blogs/:id', async () => {
        const createResponse = await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', 'adminToken')
            .send({ ...testBlogData, name: 'Another Test' })
            .expect(HttpStatus.Created);

        const blogUpdateData: BlogInputDto = {
            name: "name",
            description: "title",
            websiteUrl: "name"
            
        };

        await request(app)
            .put(`/${BLOGS_PATH}/${createResponse.body.id}`)
            .set('Authorization', 'adminToken')
            .send(blogUpdateData)
            .expect(HttpStatus.NoContent);

        const blogResponse = await request(app).get(
            `/BLOGS_PATH/${createResponse.body.id}`,
        );

        expect(blogResponse.body).toEqual({
            ...blogUpdateData,
            id: createResponse.body.id,
            createdAt: expect.any(String),
        });
    });

    it.skip('DELETE /blogs/:id and check after NOT FOUND', async () => {
        const {
            body: { id: createdBlogId },
        } = await request(app)
            .post('/BLOGS_PATH')
            .set('Authorization', 'adminToken')
            .send({ ...testBlogData, name: 'Another Test Bitau' })
            .expect(HttpStatus.Created);

        await request(app)
            .delete(`/BLOGS_PATH/${createdBlogId}`)
            .expect(HttpStatus.NoContent);

        const blogResponse = await request(app).get(
            `/BLOGS_PATH/${createdBlogId}`,
        );
        expect(blogResponse.status).toBe(HttpStatus.NotFound);
    });

});



