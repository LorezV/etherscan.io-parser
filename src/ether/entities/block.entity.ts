import { Entity, PrimaryColumn, OneToMany } from "typeorm";
import { Timestamp } from "src/database/mixins/timestamp";
import { Transaction } from "src/ether/entities/transaction.entity";

@Entity()
export class Block extends Timestamp {
    @PrimaryColumn()
    number: number

    @OneToMany(() => Transaction, (transaction => transaction.block))
    transactions: Transaction[]
}