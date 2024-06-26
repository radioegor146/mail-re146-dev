import {createHash} from "crypto";

export function getMailboxId(email: string): string {
    return createHash("md5").update(email).digest("hex");
}