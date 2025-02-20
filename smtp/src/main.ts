import {SMTPServer, SMTPServerDataStream, SMTPServerSession} from "smtp-server";
import {promises as fsPromises} from "fs";
import dotenv from "dotenv";
import {AddressObject, simpleParser} from "mailparser";
import {Database} from "./database";
import {getMailboxId} from "./utils";
import {S3Storage} from "./s3-storage";

dotenv.config();

function addressesToStrings(addresses: AddressObject | AddressObject[] | undefined): string[] {
    if (!addresses) {
        return [];
    }

    const emails: (string | undefined)[] = [];
    if (Array.isArray(addresses)) {
        for (const address of addresses) {
            emails.push(...(address.value.map(email => email.address ?? undefined)));
        }
    } else {
        emails.push(...(addresses.value.map(address => address.address ?? undefined)));
    }
    return emails.filter(email => email) as string[];
}

(async () => {
    const database = new Database(process.env.DATABASE_URL ?? "postgres://postgres:postgres@postgres:5432/postgres");
    await database.init();
    const storage = new S3Storage({
        endpoint: process.env.S3_ENDPOINT ?? "http://minio:9000",
        accessKey: process.env.S3_ACCESS_KEY ?? "minioadmin",
        secretKey: process.env.S3_SECRET_KEY ?? "minioadmin",
        bucket: process.env.S3_BUCKET ?? "mail-re146-dev"
    });

    const commonOptions = {
        key: await fsPromises.readFile(process.env.TLS_KEY_PATH ?? "tls/server.key"),
        cert: await fsPromises.readFile(process.env.TLS_CERTIFICATE_PATH ?? "tls/server.crt"),
        name: "re146.dev",
        banner: "mail.re146.dev temporary receiving service",
        disabledCommands: ["AUTH"],

        onData(stream: SMTPServerDataStream, session: SMTPServerSession,
               callback: (err?: (Error | null)) => void) {
            const buffers: Buffer[] = [];
            stream.on("data", data => {
                buffers.push(data);
            });
            stream.on("end", () => {
                callback();

                const contents = Buffer.concat(buffers);
                simpleParser(contents)
                    .then(mail => {
                        const to = addressesToStrings(mail.to);
                        const from = addressesToStrings(mail.from);

                        if (to.length === 0) {
                            console.info(`Received mail from ${from.length === 0 ? "N/A" : from.join(", ")} to N/A`);
                            return;
                        }

                        console.info(`Received mail from ${from.length === 0 ? "N/A" : from.join(", ")} to ${to.length === 0 ? "N/A" : to.join(", ")}`);

                        const subject = mail.subject;

                        (async () => {
                            for (const address of to) {
                                const mailboxId = getMailboxId(address);
                                const messageId = await database.addEmail(mailboxId, from.join(", "), new Date(), subject ?? "N/A");
                                await storage.addEmail(mailboxId, messageId, contents);
                            }
                        })().catch(e => console.error(`Saving error: ${e}`));
                    })
                    .catch(e => {
                        console.error(`Parsing error: ${e}`);
                    });
            })
        }
    };

    const insecureServerAt25 = new SMTPServer({
        ...commonOptions
    });
    const insecureServerAt587 = new SMTPServer({
        ...commonOptions
    });
    const secureServerAt465 = new SMTPServer({
        ...commonOptions,
        secure: true
    });

    function errorListener(e: Error) {
        console.error(`Error: ${e}`);
    }

    insecureServerAt25.addListener("error", errorListener);
    insecureServerAt587.addListener("error", errorListener);
    secureServerAt465.addListener("error", errorListener);

    insecureServerAt25.listen(25, () => console.info("Started at :25"));
    insecureServerAt587.listen(587, () => console.info("Started at :587"));
    secureServerAt465.listen(465, () => console.info("Started at :465"));
})().catch(e => console.error(e));