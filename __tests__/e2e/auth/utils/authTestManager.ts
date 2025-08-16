import { AUTH_PATH } from "../../../../src/core/paths/paths";
import {HttpStatus} from "../../../../src/core/types/http-statuses";
import request from 'supertest';
import {UserInputDto} from "../../../../src/features/users/application/dtos/user.input-dto";
import {app} from "../../../../src/app";


export const authTestManager = {

    async createUser(data: UserInputDto) {
        const response = await request(app)
            .post(`${AUTH_PATH}/registration`)
            .send(data)
            .expect(HttpStatus.Created);

        return { response };
    }



}