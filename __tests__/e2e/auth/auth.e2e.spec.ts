import request from "supertest";
import {AUTH_PATH, BLOGS_PATH, TESTING_PATH} from "../../../src/core/paths/paths";
import {HttpStatus} from "../../../src/core/types/http-statuses";
import express, {Express} from "express";

import {runDB, deviceSessionsCollection} from "../../../src/db/mongo.db";
import {setupApp} from "../../../src/setup-app";
import {UserInputDto} from "../../../src/features/users/application/dtos/user.input-dto";
import {MongoDeviceSessionsRepository} from "../../../src/features/auth/repositories/device-sessions.repository";
import {DevicesService} from "../../../src/features/auth/application/devicesService";
import {authTestManager} from "./utils/authTestManager";
import {ENV} from "../../../src/core/config/env";

let app: Express;

const user1: UserInputDto = {
    login: "Alex1",
    password: "string",
    email: "Alex1@mail.com",
};

const userAgent1 = "iPhone Safari";
const userAgent2 = "Device2";
const userAgent3 = "Device3";
const userAgent4 = "Device4";

describe("testing auth, AccessToken, RefreshToken, sessions", () => {
    beforeAll(async () => {
        await runDB(ENV.MONGO_URL);

        const deviceRepo = new MongoDeviceSessionsRepository(deviceSessionsCollection);
        const devicesService = new DevicesService(deviceRepo);

        app = setupApp(express(), devicesService);

        await request(app).delete(`${TESTING_PATH}/all-data`);
    });

    it("should return 200 and empty array", async () => {
        await request(app)
            .get(BLOGS_PATH)
            .expect(HttpStatus.Ok, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: [],
            });
    });

    it("should create user and after login user with 4 devices and return RToken, AT", async () => {

        await authTestManager.createUser(app, user1)
        await authTestManager.loginUser1WithDevice1(app, user1, userAgent1)
        await authTestManager.loginUser1WithDevice2(app, user1, userAgent2)
        await authTestManager.loginUser1WithDevice3(app, user1, userAgent3)
        await authTestManager.loginUser1WithDevice4(app, user1, userAgent3)

    });

//     it(`should create two more devices to existing user`, async () => {
//     })

});


// it(`shouldn't create blog with incorrect input data`, async () => {
//     const data = {
//         name: "My Blog",
//         description: 12345,
//         websiteUrl: "https://myblog.com"
//     };
//
//     const response = await request(app)
//         .post(BLOGS_PATH)
//         .auth("admin", "qwerty")
//         .send(data)
//         .expect(HttpStatus.BadRequest);
//
// })
//
// it("if not _mongoId format it should return 400 for badrequest ", async () => {
//
//     await request(app)
//         .get(`${BLOGS_PATH}/1`)
//         .auth("admin", "qwerty")
//         .expect(HttpStatus.BadRequest);
// })
//
// it("if _mongoId should return 404 for not existing entity ", async () => {
//
//     await request(app)
//         .get(`${BLOGS_PATH}/6881f6db017eb592fa948feb`)
//         .auth("admin", "qwerty")
//         .expect(HttpStatus.NotFound);
// })
//
// it(`shouldn't update blog with incorrect input data`, async () => {
//     const data3: BlogInputDto = {
//         name: "My Bitau",
//         description: "Best blog ever!",
//         websiteUrl: "https://myblog.com"
//     }
//
//     const response = await request(app)
//         .post(BLOGS_PATH)
//         .auth("admin", "qwerty")
//         .send(data3)
//         .expect(HttpStatus.Created);
//
//    const newBlogId = response.body.id
//
//     const data4 = {
//         name: "My Err",
//         description: 123,
//         websiteUrl: ""
//     }
//
//     await request(app)
//         .put(`${BLOGS_PATH}/${newBlogId}`)
//         .auth("admin", "qwerty")
//         .send(data4)
//         .expect(HttpStatus.BadRequest);
//
//
//
// })


