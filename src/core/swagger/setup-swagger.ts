import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Blogger Platform 1",
            version: "1.0.0",
            description: "Blogger Platform API Bitau",
        },
    },
    apis: ["./src/**/*.swagger.yml"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
    app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};