import request from "supertest";
import express, {Express} from "express";
import {runDB} from "../../../src/db/mongo.db";
import {setupApp} from "../../../src/setup-app";
import {AUTH_PATH, BLOGS_PATH, TESTING_PATH} from "../../../src/core/paths/paths";
import {ENV} from "../../../src/core/config/env";
import {authTestManager} from "./utils/authTestManager";
import {HttpStatus} from "../../../src/core/types/http-statuses";
import {UserInputDto} from "../../../src/features/users/application/dtos/user.input-dto";
import {DeviceSession} from "../../../src/features/auth/domain/device-session.entity";

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
        "2. Should update refreshToken for device 1, lastActiveDate must be same", async () => {

        await authTestManager.createUser(app, user1);

        const result1 = await authTestManager.loginUserWithDevice(app, user1, userAgent1);
        await authTestManager.loginUserWithDevice(app, user1, userAgent2);
        await authTestManager.loginUserWithDevice(app, user1, userAgent3);
        const result4 = await authTestManager.loginUserWithDevice(app, user1, userAgent4);

        const refreshCookieForDevice4 = result4.refreshCookie;

        await authTestManager.checkDevicesCount(app, 4, userAgent4, refreshCookieForDevice4);


        // Checking changes in lastActiveDate, and it must be changed in device1


        const refreshCookieForDevice1 = result1.refreshCookie;

        const devicesBeforeCheck: DeviceSession[] = await authTestManager.getAllDevices(app, userAgent1, refreshCookieForDevice1)

        await authTestManager.refreshToken(app, userAgent1, refreshCookieForDevice1)

        const devicesAfterCheck: DeviceSession[] = await authTestManager.getAllDevices(app, userAgent1, refreshCookieForDevice1)

        // 1. Кол-во девайсов не изменилось
        expect(devicesAfterCheck.length).toBe(devicesBeforeCheck.length)

        // 2. Получаем устройства по userAgent
        const beforeDevice1 = devicesBeforeCheck.find(d => d.userAgent === userAgent1);
        const afterDevice1 = devicesAfterCheck.find(d => d.userAgent === userAgent1);

        expect(beforeDevice1).toBeDefined();
        expect(afterDevice1).toBeDefined();

        // 3. lastActiveDate у девайса 1 должен обновиться
        expect(beforeDevice1!.lastActiveDate).not.toBe(afterDevice1!.lastActiveDate);

        // 4. Остальные девайсы должны остаться неизменными (deviceId и lastActiveDate)
        for (const before of devicesBeforeCheck) {
            const after = devicesAfterCheck.find(d => d.deviceId === before.deviceId);

            expect(after).toBeDefined();

            if (before.deviceId !== beforeDevice1!.deviceId) {
                expect(after!.lastActiveDate).toBe(before.lastActiveDate);
            }
        }


    });



    it("check refreshToken and accessToken and delete device session by deviceId", async () => {

        await authTestManager.createUser(app, user2);

        const result = await authTestManager.loginUserWithDevice(app, user2, userAgent1);


        expect(result.refreshCookie).toBeDefined();
        expect(result.response.body.accessToken).toBeDefined();


      await authTestManager.deleteDevice(app, result.deviceId, userAgent1, result.refreshCookie);


    })



    // it("Should delete device 2 (userAgent2) using refresh token from device 1, and return the updated list without device 2", async () => {
    //
    //     await authTestManager.createUser(app, user1);
    //
    //     const result = await authTestManager.loginUserWithDevice(app, user1, userAgent1);
    //     await authTestManager.loginUserWithDevice(app, user1, userAgent2);
    //     await authTestManager.loginUserWithDevice(app, user1, userAgent3);
    //
    //
    //     await authTestManager.deleteDevice(app, result.userId, userAgent2, result.refreshCookie);
    //
    //
    // })

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



