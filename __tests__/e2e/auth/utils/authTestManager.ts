import { AUTH_PATH } from "../../../../src/core/paths/paths";
import {HttpStatus} from "../../../../src/core/types/http-statuses";
import request from 'supertest';
import {UserInputDto} from "../../../../src/features/users/application/dtos/user.input-dto";
import {app} from "../../../../src/app";


export const authTestManager = {

    async createUser(app: any, data: UserInputDto) {
        const response = await request(app)
            .post(`${AUTH_PATH}/registration`)
            .send(data)
            .expect(HttpStatus.NoContent);

        return { response };
    },


    async loginUserWithDevice (app: any, data: UserInputDto, userAgent: string) {
        const response = await request(app)
            .post(`${AUTH_PATH}/login`)
            .set("User-Agent", userAgent)
            .send({
                loginOrEmail: data.email,
                password: data.password,
            })
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

        const userId: string = response.body.userId ;


        return { response, refreshCookie, userId };
    },

    async loginUser1WithDevice4 (app: any, data: UserInputDto, userAgent: string) {
        const response = await request(app)
            .post(`${AUTH_PATH}/login`)
            .set("User-Agent", userAgent)
            .send({
                loginOrEmail: data.email,
                password: data.password,
            })
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
        return { response, refreshCookie };

    },

    async checkDevicesCount(app: any, expectedCount: number, userAgent: string, refreshCookie: string) {

        const response = await request(app)
            .get("/security/devices")
            .set("User-Agent", userAgent)
            .set("Cookie", refreshCookie)
            .expect(HttpStatus.Ok);

        const devices = response.body;

        expect(Array.isArray(devices)).toBe(true);
        expect(devices.length).toBe(expectedCount);

        return devices;
    },

    async refreshToken(app: any, userAgent: string, refreshCookie: string) {

      const response = await request(app)
          .post(`${AUTH_PATH}/refresh-token`)
          .set("User-Agent", userAgent)
          .set("Cookie", refreshCookie)
          .expect(HttpStatus.Ok);

      return response;

    },

    async getAllDevices(app: any, userAgent: string, refreshCookie: string) {

        const response = await request(app)
            .get("/security/devices")
            .set("User-Agent", userAgent)
            .set("Cookie", refreshCookie)
            .expect(HttpStatus.Ok);

        return response.body;


    },

    async deleteDevice(app: any, deviceId: string, userAgent: string, refreshCookie: string) {



        const response = await request(app)
            .delete(`/security/devices/${deviceId}`)
            .set("User-Agent", userAgent)
            .set("Cookie", refreshCookie)
            .expect(HttpStatus.Ok);

        return response.body;


    }


}