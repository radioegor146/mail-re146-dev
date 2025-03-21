import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Domain {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("text")
    domain!: string;

    @Column("boolean", {default: false})
    active!: boolean;
}