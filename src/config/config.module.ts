import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from "joi";

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            load: [() => ({
                database: {
                    host: process.env.POSTGRES_HOST,
                    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
                    user: process.env.POSTGRES_USER,
                    password: process.env.POSTGRES_PASSWORD,
                    db: process.env.POSTGRES_DB
                },
                polling: {
                    start: process.env.POOL_START,
                    delay: process.env.POOL_DELAY
                },
                etherscanApiKey: process.env.ETHERSCAN_API_KEY
            })],
            validationSchema: Joi.object({
                POSTGRES_HOST: Joi.string().required(),
                POSTGRES_PORT: Joi.number().required(),
                POSTGRES_USER: Joi.string().required(),
                POSTGRES_PASSWORD: Joi.string().required(),
                POSTGRES_DB: Joi.string().required(),
                ETHERSCAN_API_KEY: Joi.string()
            })
        })
    ]
})
export class ConfigModule { }