import dotenv from "dotenv";
dotenv.config();

import { setupApp } from "./setup-app";
import { SETTINGS } from "./core/settings/settings";
import { runDB } from "./db/mongo.db";
import {app} from "./app";




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
