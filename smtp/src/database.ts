import {Column, DataSource, Entity, Index, PrimaryGeneratedColumn} from "typeorm";

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

export class Database {
    private dataSource: DataSource;

    constructor(private databaseUrl: string) {
        this.dataSource = new DataSource({
            type: "postgres",
            url: databaseUrl,
            entities: [Message]
        });
    }

    async init(): Promise<void> {
        await this.dataSource.initialize();
    }

    async addEmail(mailboxId: string, from: string, receivedAt: Date, subject: string): Promise<string> {
        const result = await this.dataSource.createQueryBuilder()
            .insert()
            .into(Message)
            .values({
                mailboxId,
                from,
                receivedAt,
                subject
            })
            .returning(["inserted.id"])
            .execute();
        return result.raw[0].id;
    }
}