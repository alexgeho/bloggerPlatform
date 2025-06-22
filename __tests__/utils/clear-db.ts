import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../src/core/types/http-statuses';

export async function clearDb(app: Express) {
    await request(app)
        .delete(`api/testing/all-data`)
        .expect(HttpStatus.NoContent);
    return;
}
