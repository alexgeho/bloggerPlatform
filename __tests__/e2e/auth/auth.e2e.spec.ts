import request from "supertest";
import { AUTH_PATH, BLOGS_PATH, TESTING_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import express, { Express } from "express";

import { runDB, deviceSessionsCollection } from "../../../src/db/mongo.db";
import { SETTINGS } from "../../../src/core/settings/settings";
import { setupApp } from "../../../src/setup-app";
import { UserInputDto } from "../../../src/features/users/application/dtos/user.input-dto";
import { MongoDeviceSessionsRepository } from "../../../src/features/auth/repositories/device-sessions.repository";
import { DevicesService } from "../../../src/features/auth/application/devices.service";

let app: Express;

const user1: UserInputDto = {
    login: "Alex1",
    password: "string",
    email: "Alex1@mail.com",
};

describe("testing auth, AccessToken, RefreshToken, sessions", () => {
    beforeAll(async () => {
        await runDB(SETTINGS.MONGO_URL);

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

    it("should create users with correct input data", async () => {
        await request(app)
            .post(`${AUTH_PATH}/registration`)
            .send(user1)
            .expect(HttpStatus.NoContent);
    });




    it("should login user with certain device and return RToken, AT", async () => {

        const userAgent = "iPhone Safari";

        const response = await request(app)
            .post("/auth/login")
            .set("User-Agent", userAgent)
            .send({ loginOrEmail: user1.email, password: user1.password })
            .expect(HttpStatus.Ok);

        expect(response.body).toHaveProperty("accessToken");
        expect(response.headers["set-cookie"]).toEqual(
            expect.arrayContaining([expect.stringContaining("refreshToken=")])
        );

        const setCookieHeader = response.headers["set-cookie"];

        if (!Array.isArray(setCookieHeader)) {
            throw new Error("Expected 'set-cookie' to be an array");
        }

        const refreshCookie = setCookieHeader
            .find((cookie) => cookie.includes("refreshToken="))
            ?.split(";")[0];

        if (!refreshCookie) {
            throw new Error("Refresh token cookie not found");
        }

        console.log("Cookie being sent:", refreshCookie);
    });

    it("should show devices with access", async () => {

        const devicesResponse = await request(app)
            .get("/security/devices")
            .set("User-Agent", userAgent)
            .set("Cookie", [refreshCookie]) // именно массив
            .expect(HttpStatus.Ok);

        const hasDevice = devicesResponse.body.some(
            (device: any) =>
                device.deviceName.includes("iPhone") ||
                device.deviceName.includes("Safari")
        );

        expect(hasDevice).toBe(true);

    })

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


