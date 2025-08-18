
import { setupApp } from "./setup-app";
import { SETTINGS } from "./core/settings/settings";
import { deviceSessionsCollection, runDB } from "./db/mongo.db";
import { app } from "./app";
import { MongoDeviceSessionsRepository } from "./features/auth/repositories/device-sessions.repository";
import { devicesService } from "./features/auth/application/devicesService";
import { authService } from "./features/auth/application/auth.service";



const bootstrap = async () => {
    // 1. Connecting to Db
    await runDB(SETTINGS.MONGO_URL);

    // 2. Создаём репозиторий и сервис ТОЛЬКО после подключения к базе
    const deviceRepo = new MongoDeviceSessionsRepository(deviceSessionsCollection);
    const devicesService = new devicesService(deviceRepo);
    authService.setDevices(devicesService);

    // 3. Конфигурируем приложение
    setupApp(app, devicesService);

    // 4. Запускаем сервер
    const PORT = SETTINGS.PORT;
    app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}`);
    });

    return app;
};

bootstrap();
