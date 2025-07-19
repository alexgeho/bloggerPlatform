import { app } from "../../../src/app"; // ⚡️ Импортируешь готовый app, а не создаёшь новый!
import request from "supertest";
import { BLOGS_PATH, TESTING_PATH } from "../../../src/core/paths/paths";
import { BlogInputDto } from "../../../src/blogs/application/dtos/blog.input-dto";
import { HttpStatus } from "../../../src/core/types/http-statuses";

describe("testing POST to /blogs", () => {
    beforeEach(async () => {
        await request(app).delete(`${TESTING_PATH}/all-data`);
    });

    it('TEST should respond with hello world', async () => {
        const res = await request(app).get('/');
        console.log(res.text); // Должен увидеть Hello world Bitau!
    });

    it("should create blog with correct input data ", async () => {
        const data: BlogInputDto = {
            name: "My Blog",
            description: "Best blog ever!",
            websiteUrl: "https://myblog.com"
        };

        const response = await request(app)
            .post(BLOGS_PATH)
            .set('Authorization', 'Basic admin-qwerty')
            .send(data)
            .expect(HttpStatus.Created);

        // Если надо проверить тело ответа:
        // expect(response.body).toEqual({
        //     ...data,
        //     id: expect.any(String), // если есть id
        // });
    });
});
