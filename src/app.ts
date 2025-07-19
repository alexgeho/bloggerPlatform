// src/app.ts
import express from "express";
import { setupApp } from "./setup-app";

const app = express();
setupApp(app);

export { app };
