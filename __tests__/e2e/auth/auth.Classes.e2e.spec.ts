import express, {Express} from "express";
import {runDB} from "../../../src/db/mongo.db";
import {ENV} from "../../../src/core/config/env";
import {setupApp} from "../../../src/setup-app";
import request from "supertest";
import {AUTH_PATH, TESTING_PATH} from "../../../src/core/paths/paths";
import { emailAdapter } from "../../../src/features/auth/adapters/email.adapter";


jest.mock("../../../src/features/auth/adapters/email.adapter", () => ({
    emailAdapter: {
        sendEmail: jest.fn().mockResolvedValue(true), // всегда "успех"
    },
}));

let app: Express

describe("aut e2e tests after implement of Classes", () => {

    beforeAll(async () => {
        await runDB(ENV.MONGO_URL);
        app = setupApp(express());
        await request(app).delete(`${TESTING_PATH}/all-data`);
    });

    it("should send email with recovery code; status 204", async () => {


      const user = {
            login: "Alex",
            password: "string",
            email: "alexander@gealab.nu",
        };

        // регистрируем (будет confirmation письмо)
        const res = await request(app)
            .post(`${AUTH_PATH}/registration`)
            .send(user);
        expect(res.status).toBe(204);

        // очищаем мок, чтобы confirmation не мешал
        (emailAdapter.sendEmail as jest.Mock).mockClear();

        const res2 = await request(app)
            .post(`${AUTH_PATH}/password-recovery`)
            .send({email: "alexander@gealab.nu"})

        expect(res2.status).toBe(204);

        expect(emailAdapter.sendEmail).toHaveBeenCalledTimes(1);
        expect(emailAdapter.sendEmail).toHaveBeenCalledWith(
            "alexander@gealab.nu",
            expect.any(String), // subject
            expect.stringContaining("recoveryCode") // html
        );


    });


})