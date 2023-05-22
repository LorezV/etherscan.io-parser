import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Block } from "src/ether/entities/block.entity";
import { Transaction } from "src/ether/entities/transaction.entity";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('database.host'),
                port: configService.get('database.port'),
                username: configService.get('database.user'),
                password: configService.get('database.password'),
                database: configService.get('database.db'),
                entities: ["dist/**/*.entity{ .ts,.js}"],
                synchronize: true,
                migrations: ["dist/migrations/*{.ts,.js}"],
                migrationsTableName: "migrations_typeorm",
                migrationsRun: true,
            })
        })
    ]
})
export class DatabaseModule { }