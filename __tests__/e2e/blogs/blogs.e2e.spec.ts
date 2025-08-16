import request from "supertest";
import {BLOGS_PATH, TESTING_PATH} from "../../../src/core/paths/paths";
import {BlogInputDto} from "../../../src/features/blogs/application/dtos/blog.input-dto";
import {HttpStatus} from "../../../src/core/types/http-statuses";
import * as setupAppConfig from "../../../src/setup-app";
import express from "express";
import {doSomething} from "../../../src/app";
import * as appContent from "../../../src/app";
import {runDB} from "../../../src/db/mongo.db";
import {SETTINGS} from "../../../src/core/settings/settings";

console.log('123')
console.log(setupAppConfig, ' setupAppConfig')
const app = setupAppConfig.setupApp(express());
console.log(appContent)

describe("testing POST to /blogs", () => {
    beforeAll(() => {
        doSomething()
        runDB(SETTINGS.MONGO_URL)

    })
    beforeEach(async () => {
        await request(app).delete(`${TESTING_PATH}/all-data`);
    });

    it('TEST should respond with hello world', async () => {
        const res = await request(app).get('/');
        console.log(res.text); // Должен увидеть Hello world Bitau!
    })

    it ('should return 200 and empty array', async () => {
        await request(app)
            .get(BLOGS_PATH)
            .expect(HttpStatus.Ok, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
    })

    it("should create blog with correct input data ", async () => {
        const data: BlogInputDto = {
            name: "My Blog",
            description: "Best blog ever!",
            websiteUrl: "https://myblog.com"
        };

        const response = await request(app)
            .post(BLOGS_PATH)
            .auth("admin", "qwerty")
            .send(data)
            .expect(HttpStatus.Created);
    })

    it(`shouldn't create blog with incorrect input data`, async () => {
        const data = {
            name: "My Blog",
            description: 12345,
            websiteUrl: "https://myblog.com"
        };

        const response = await request(app)
            .post(BLOGS_PATH)
            .auth("admin", "qwerty")
            .send(data)
            .expect(HttpStatus.BadRequest);

    })

    it("if not _mongoId format it should return 400 for badrequest ", async () => {

        await request(app)
            .get(`${BLOGS_PATH}/1`)
            .auth("admin", "qwerty")
            .expect(HttpStatus.BadRequest);
    })

    it("if _mongoId should return 404 for not existing entity ", async () => {

        await request(app)
            .get(`${BLOGS_PATH}/6881f6db017eb592fa948feb`)
            .auth("admin", "qwerty")
            .expect(HttpStatus.NotFound);
    })

    it(`shouldn't update blog with incorrect input data`, async () => {
        const data3: BlogInputDto = {
            name: "My Bitau",
            description: "Best blog ever!",
            websiteUrl: "https://myblog.com"
        }

        const response = await request(app)
            .post(BLOGS_PATH)
            .auth("admin", "qwerty")
            .send(data3)
            .expect(HttpStatus.Created);

       const newBlogId = response.body.id

        const data4 = {
            name: "My Err",
            description: 123,
            websiteUrl: ""
        }

        await request(app)
            .put(`${BLOGS_PATH}/${newBlogId}`)
            .auth("admin", "qwerty")
            .send(data4)
            .expect(HttpStatus.BadRequest);



    })

});
