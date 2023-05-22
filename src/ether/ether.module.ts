import { Module } from "@nestjs/common";
import { EtherService } from "./ether.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Block } from "./entities/block.entity";
import { Transaction } from "src/ether/entities/transaction.entity";
import { ExecuterModule } from "src/executer/executer.module";
import { EtherController } from "./ether.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Block, Transaction]), ExecuterModule],
    providers: [EtherService],
    controllers: [EtherController]
})
export class EtherModule {
}