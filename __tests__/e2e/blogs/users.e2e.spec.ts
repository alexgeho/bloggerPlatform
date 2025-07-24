import { doSomething} from "../../../src/app"; // ⚡️ Импортируешь готовый app, а не создаёшь новый!
import request from "supertest";
import { USERS_PATH, TESTING_PATH } from "../../../src/core/paths/paths";
import { UserInputDto } from "../../../src/users/application/dtos/user.input-dto";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import {runDB} from "../../../src/db/mongo.db";
import {SETTINGS} from "../../../src/core/settings/settings";
import * as setupAppConfig from "../../../src/setup-app";
import express from "express";
import {usersRouter} from "../../../src/users/routers/user.router";
const app = setupAppConfig.setupApp(express());

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
    });

    it("should create User with correct input data ", async () => {
        const data: UserInputDto = {
            login: "Cu0ISj",
            password: "st2ring",
            email: "exam2ple@example.com"
        };

        const response = await request(app)
            .post(USERS_PATH)
            .send(data)
            .auth("admin", "qwerty")
            .expect(HttpStatus.Created);
    });

    it(`shouldn't create User with incorrect email`, async () => {
        const data: UserInputDto = {
            login: "Cv0ISj",
            password: "string",
            email: "exampleexamplecom"
        };

        const response = await request(app)
            .post(USERS_PATH)
            .send(data)
            .auth("admin", "qwerty")
            .expect(HttpStatus.BadRequest);
    });

    it("should delete User", async () => {

        const data1: UserInputDto = {
            login: "Alex",
            password: "1234567a",
            email: "exam5@eexample.com"
        }

        let createdUser: any;

        const createResponse = await request(app)
            .post(USERS_PATH)
            .send(data1)
            .auth("admin", "qwerty")
            .expect(HttpStatus.Created)

        createdUser = createResponse.body;

        await request(app)
            .delete(`${USERS_PATH}/${createdUser.id}`)
            .auth("admin", "qwerty")
            .expect(HttpStatus.NoContent)
    });



});
