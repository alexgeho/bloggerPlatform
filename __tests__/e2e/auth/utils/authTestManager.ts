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


        return { response };

    }

}