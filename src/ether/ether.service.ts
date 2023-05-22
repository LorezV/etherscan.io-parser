import axios from "axios";
import { DataSource, Repository } from "typeorm";
import { Block } from "./entities/block.entity";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { TransactionDto } from "./dto/transaction.dto";
import { Transaction } from "./entities/transaction.entity";
import { ExecuterService } from "src/executer/executer.service";

@Injectable()
export class EtherService {
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Block)
        private readonly blockRepository: Repository<Block>,
        private readonly dataSource: DataSource,
        private readonly executerService: ExecuterService
    ) {
        this.executerService.addTask({
            context: this,
            fn: this.checkBlocksRelevance
        })
    }

    private async checkBlocksRelevance() {
        const lastBlock = (await this.blockRepository.find({
            select: { number: true },
            order: { number: "DESC" },
            take: 1
        }))[0]?.number || this.configService.get("polling.start") - 1

        const currentBlock = await this.fetchBlock()

        const diff = currentBlock - lastBlock;
        for (let i = 1; i <= diff; i++) {
            this.executerService.addTask({
                context: this,
                fn: this.pollBlock,
                args: [lastBlock + i]
            })

            if (i > 5) {
                break;
            }
        }

        this.executerService.addTask({
            context: this,
            fn: this.checkBlocksRelevance
        })
    }

    private async pollBlock(blockNumber: number) {
        await this.dataSource.transaction(async manager => {
            const block = manager.create(Block, { number: blockNumber, transactions: [] })
            const blockTransactions = await this.fetchTransactions(blockNumber);
            const transactions: Transaction[] = []

            await manager.insert(Block, block);

            for (const tr of blockTransactions) {
                transactions.push(manager.create(Transaction, {
                    value: Number(tr.value),
                    from: tr.from,
                    to: tr.to,
                    block: block,
                }))
            }

            await manager.insert(Transaction, transactions);
        })
    }

    public async fetchBlock(): Promise<number> {
        const data: any = (await axios.get("https://api.etherscan.io/api", {
            params: {
                module: "proxy",
                action: "eth_blockNumber",
                apikey: this.configService.get("etherscanApiKey")
            }
        })).data

        if (data.status) {
            throw new Error(data.result)
        }

        return Number(data.result)
    }

    public async fetchTransactions(blockNumber: number): Promise<TransactionDto[]> {
        const data: any = (await axios.get(`https://api.etherscan.io/api`, {
            params: {
                module: "proxy",
                action: "eth_getBlockByNumber",
                tag: blockNumber.toString(16),
                boolean: true,
                apikey: this.configService.get("etherscanApiKey")
            }
        })).data

        if (data.status) {
            throw new Error(data.result)
        }

        return data.result.transactions as TransactionDto[]
    }

    public async getMostChangedAddress() {
        const changes: { [key: string]: number } = {}

        const blocks = await this.blockRepository.find(
            {
                select: { number: true },
                order: { number: "DESC" },
                relations: { transactions: true },
                take: 100
            },
        )

        let returnValue = { address: "", delta: 0 }
        for (const block of blocks) {
            for (const transaction of block.transactions) {
                changes[transaction.from] = (changes[transaction.from] || 0) - Number(transaction.value);
                changes[transaction.to] = (changes[transaction.to] || 0) + Number(transaction.value);

                if (Math.abs(returnValue.delta) < Math.abs(changes[transaction.from])) {
                    returnValue = { address: transaction.from, delta: changes[transaction.from] }
                }

                if (Math.abs(returnValue.delta) < Math.abs(changes[transaction.to])) {
                    returnValue = { address: transaction.to, delta: changes[transaction.to] }
                }
            }
        }
        
        return returnValue
    }
}