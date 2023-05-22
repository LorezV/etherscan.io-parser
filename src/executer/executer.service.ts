import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ExecuterTask } from "./classes/ExecuterTask";

@Injectable()
export class ExecuterService {
    private readonly tasks: ExecuterTask[] = []
    private working: boolean = false;
    private avaliableAfter: number = 0;

    constructor(
        private readonly configService: ConfigService
    ) {
        this.execute()
    }

    public addTask(task: ExecuterTask) {
        this.tasks.push(task)

        if (!this.working) {
            this.working = true;
            setTimeout(() => { this.execute() }, Math.min(Math.max(this.avaliableAfter - (new Date()).getMilliseconds(), 0), this.configService.get("polling.delay")))
        }
    }

    private async execute() {
        if (this.tasks.length) {
            this.working = true;
            const task = this.tasks.shift()

            await this.runTask(task)

            if (this.tasks.length > 0) {
                setTimeout(() => {
                    this.execute()
                }, this.configService.get("polling.delay"))
            } else {
                this.avaliableAfter = (new Date()).getMilliseconds() + this.configService.get("polling.delay");
            }
        }

        this.working = false
    }

    private async runTask(task: ExecuterTask) {
        try {
            await new Promise(
                resolve => {
                    task.fn.call(task.context || {}, ...(task.args || [])).then(() => {
                        resolve(true)
                    })
                }
            )
        } catch (e: any) {
            console.log("Ошибка при выполнении задачи:", task)
            console.error(e)
        }
    }
}