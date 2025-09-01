import request from "supertest";
import express, { Express } from "express";
import { runDB } from "../../../src/db/mongo.db";
import { setupApp } from "../../../src/setup-app";
import {AUTH_PATH, BLOGS_PATH, TESTING_PATH} from "../../../src/core/paths/paths";
import { ENV } from "../../../src/core/config/env";
import { authTestManager } from "./utils/authTestManager";
import {HttpStatus} from "../../../src/core/types/http-statuses";
import {UserInputDto} from "../../../src/features/users/application/dtos/user.input-dto";

let app: Express;

describe("auth e2e tests", () => {
    beforeAll(async () => {
        await runDB(ENV.MONGO_URL);
        app = setupApp(express());
        await request(app).delete(`${TESTING_PATH}/all-data`);
    });

    it("should respond with hello world", async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
        expect(res.text).toBe("Hello world Bitau!");
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


    const user1: UserInputDto = {
        login: "Alex1",
        password: "string",
        email: "Alex1@mail.com",
    };

    const user2: UserInputDto = {
        login: "Alex2",
        password: "string",
        email: "Alex2@mail.com",
    };


    const userAgent1 = "iPhone Safari";
    const userAgent2 = "Device2";
    const userAgent3 = "Device3";
    const userAgent4 = "Device4";

    it("1. Should create user and after login user with 4 devices and return RToken, AT." +
        "2. Should update refreshToken for device 1", async () => {

        await authTestManager.createUser(app, user1);

        const result1 = await authTestManager.loginUser1WithDevice2(app, user1, userAgent1);
        await authTestManager.loginUser1WithDevice2(app, user1, userAgent2);
        await authTestManager.loginUser1WithDevice2(app, user1, userAgent3);

        const result = await authTestManager.loginUser1WithDevice4(app, user1, userAgent4);
       const refreshCookieForDevice4 = result.refreshCookie;

        await authTestManager.checkDevicesCount(app, 4, userAgent4, refreshCookieForDevice4);

        const refreshToken = result1.refreshCookie;

        await request(app)
            .post(`${AUTH_PATH}/refresh-token`)
            .set("User-Agent", userAgent1)
            .set("Cookie", refreshToken)
            .expect(HttpStatus.Ok);


    });



//     it("should refresh refreshToken for one device", async () => {
//
//         await authTestManager.createUser(app, user2);
//
//         const loginRespond = await authTestManager.loginUserWithDevice(app, user2.email, user2.password, userAgent1);
//
//         const refreshToken = loginRespond.refreshCookie;
//
//         const response = await request(app)
//             .post(`${AUTH_PATH}/refresh-token`)
//             .set("User-Agent", userAgent1)
//             .set("Cookie", refreshToken)
//             .expect(HttpStatus.Ok);
// //console.log(response)
//
//         expect(response.body).toHaveProperty("accessToken");
//         expect(response.headers["set-cookie"]).toEqual(
//             expect.arrayContaining([expect.stringContaining("refreshToken=")])
//
//
//         );
//
//
//
//
//     });



});



