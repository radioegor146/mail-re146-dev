import {Column, Entity, Index, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Message {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("text")
    @Index()
    mailboxId!: string;

    @Column("text")
    from!: string;

    @Column("timestamp without time zone")
    receivedAt!: Date;

    @Column("text")
    subject!: string;
}