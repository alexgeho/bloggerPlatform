import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import * as fs from "fs";
import * as path from "path";
import YAML from "yaml";

const openApiPath = path.join(process.cwd(), "src", "core", "swagger", "openapi.swagger.yml");

function loadSwaggerSpec(): object {
    const raw = fs.readFileSync(openApiPath, "utf8");
    return YAML.parse(raw);
}

export const setupSwagger = (app: Express) => {
    const spec = loadSwaggerSpec();
    app.use("/api", swaggerUi.serve, swaggerUi.setup(spec));
};