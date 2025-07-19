import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { setupApp } from "./setup-app";
import { SETTINGS } from "./core/settings/settings";
import { runDB } from "./db/mongo.db";
export { app };

const app = express();


const bootstrap = async () => {

// создание приложения
   setupApp(app);

    const PORT = SETTINGS.PORT;
    await runDB (SETTINGS.MONGO_URL);//


// запуск приложения
    app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}`);
    });
    return app;
};

bootstrap();
