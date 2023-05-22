import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Block } from "src/block/entities/block.entity";
import { Transaction } from "src/block/entities/transaction.entity";

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
                entities: [Block, Transaction],
                synchronize: true,
            })
        })
    ]
})
export class DatabaseModule { }