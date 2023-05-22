import { Controller, Get } from "@nestjs/common";
import { EtherService } from "./ether.service";
import { performance } from "perf_hooks";

@Controller()
export class EtherController {
    constructor(
        private readonly blockService: EtherService
    ) {}

    @Get("api/address/mostChanged")
    public async getMostChangedAddress() {
        return this.blockService.getMostChangedAddress()
    }
}