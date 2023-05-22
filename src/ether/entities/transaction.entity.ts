import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Timestamp } from "src/database/mixins/timestamp";
import { Block } from "src/ether/entities/block.entity";

@Entity()
export class Transaction extends Timestamp {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false, type: "decimal"})
    value: number

    @Column({nullable: false})
    from: string

    @Column({nullable: true})
    to: string

    @ManyToOne(() => Block, (block) => block.transactions)
    block: Block
}