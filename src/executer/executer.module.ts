import { Module } from "@nestjs/common";
import { ExecuterService } from "./executer.service";

@Module({
    providers: [ExecuterService],
    exports: [ExecuterService]
})
export class ExecuterModule { }