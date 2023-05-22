import { Module } from "@nestjs/common";
import { BlockService } from "./block.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Block } from "./entities/block.entity";
import { Transaction } from "src/block/entities/transaction.entity";
import { ExecuterModule } from "src/executer/executer.module";
import { BlockController } from "./block.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Block, Transaction]), ExecuterModule],
    providers: [BlockService],
    controllers: [BlockController]
})
export class BlockModule {
}