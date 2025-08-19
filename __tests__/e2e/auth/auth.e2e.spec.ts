import request from "supertest";
import {AUTH_PATH, BLOGS_PATH, SECURITY_DEVICES_PATH, TESTING_PATH} from "../../../src/core/paths/paths";
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

    // let refreshCookieForDevice4: string;

    it("should create user and after login user with 4 devices and return RToken, AT", async () => {
        await authTestManager.createUser(app, user1);
        await authTestManager.loginUser1WithDevice1(app, user1, userAgent1);
        await authTestManager.loginUser1WithDevice2(app, user1, userAgent2);
        await authTestManager.loginUser1WithDevice3(app, user1, userAgent3);

        const result = await authTestManager.loginUser1WithDevice4(app, user1, userAgent4);
       const refreshCookieForDevice4 = result.refreshCookie;

        await authTestManager.checkDevicesCount(app, 4, userAgent4, refreshCookieForDevice4);
        // <–– это ты возвращаешь из TestManager
    });




});



