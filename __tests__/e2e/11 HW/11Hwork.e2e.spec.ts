import express, {Express} from "express";
import {runDB} from "../../../src/db/mongo.db";
import {ENV} from "../../../src/core/config/env";
import {setupApp} from "../../../src/setup-app";
import request from "supertest";
import {AUTH_PATH, BLOGS_PATH, POSTS_PATH, TESTING_PATH} from "../../../src/core/paths/paths";
import {emailAdapter} from "../../../src/features/auth/adapters/email.adapter";


let app: Express

describe("aut e2e tests after implement of Classes", () => {

    beforeAll(async () => {
        await runDB(ENV.MONGO_URL);
        app = setupApp(express());
        await request(app).delete(`${TESTING_PATH}/all-data`);
    });

    it("should create new comment and GET comment", async () => {


        const user = {
            login: "Alex",
            password: "string",
            email: "alexander@gealab.nu",
        };

        const registration = await request(app)
            .post(`${AUTH_PATH}/registration`)
            .send(user)
            .expect(204);

        const login = await request(app)
            .post(`${AUTH_PATH}/login`)
            .send(
                {
                    loginOrEmail: user.email,
                    password: user.password
                })
            .expect(200);

        const accessToken = login.body.accessToken;

        const blog = {
            name: "string",
            description: "string",
            websiteUrl: "https://website.com"
        }

        const blogPost: any = await request(app)
            .post(BLOGS_PATH)
            .set("Authorization", "Basic YWRtaW46cXdlcnR5")
            .send(blog)
            .expect(201);

        const post = {
            title: "string",
            shortDescription: "string",
            content: "string",
            blogId: blogPost.body.id
        }

        const postPost = await request(app)
            .post(POSTS_PATH)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(post)
            .expect(201);


        const comment = {
            "content": "This is my first comment",
        }

        const postId = postPost.body.id;

        const postComment = await request(app)
            .post(`${POSTS_PATH}/${postId}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(comment)
            .expect(201)


        const getComment = await request(app)
            .get(`${POSTS_PATH}/${postId}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)


        console.log('GET COMMENT RESPONSE:', getComment.body)

        expect(getComment.body.items.length).toBeGreaterThan(0)
        // expect(getComment.body.items[0]).toHaveProperty('content')
        // expect(getComment.body.items[0]).toHaveProperty('commentatorInfo')
        // expect(getComment.body.items[0]).toHaveProperty('likesInfo')

    });


})


