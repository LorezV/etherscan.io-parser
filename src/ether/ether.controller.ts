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
        const start = performance.now()
        const results = []

        for (let i = 0; i < 1; i++) {
            results.push(await this.blockService.getMostChangedAddress())
        }

        const end = performance.now()

        console.log(end - start)
        return results
    }
}