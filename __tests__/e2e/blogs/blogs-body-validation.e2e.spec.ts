import request from 'supertest';
import express from "express";
import {setupApp} from "../../../src/setup-app";
import {describe} from "node:test";
import {BlogInputDto} from "../../../src/blogs/dto/blog.input-dto";



describe ('blogs-body-validation', () => {
const app = express();
setupApp(app);

const correctTestBlogData: BlogInputDto = {
    name: "name",
    description: "title",
    websiteUrl: "name"
};



})