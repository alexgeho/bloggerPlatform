import dotenv from "dotenv";
dotenv.config();

export const appConfig = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL as string,
    DB_NAME: process.env.DB_NAME as string,
    AC_SECRET: process.env.AC_SECRET as string,
    AC_TIME: Number(process.env.AC_TIME ?? 1000),
    RT_SECRET: process.env.RT_SECRET as string,
    RT_TIME: Number(process.env.RT_TIME ?? 2000),
    DB_TYPE: process.env.DB_TYPE,
    EMAIL: process.env.EMAIL as string,
    EMAIL_PASS: process.env.EMAIL_PASS as string,
};
