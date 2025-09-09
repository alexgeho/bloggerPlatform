import { setupApp } from "./setup-app";
import { runDB } from "./db/mongo.db";
import { app } from "./app";
import { ENV } from "./core/config/env";

const bootstrap = async () => {

    app.set('trust proxy', true)
    await runDB(ENV.MONGO_URL);

    // 2. Конфигурируем приложение
    setupApp(app); // Больше не нужно передавать сервисы

    // 3. Запускаем сервер
    const PORT = ENV.PORT;
    app.listen(PORT, () => {
        console.log(`🚀 App listening on port ${PORT}`);
    });

    return app;
};

bootstrap();
