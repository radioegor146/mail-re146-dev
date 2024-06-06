import {md5} from "js-md5";

export function getMailboxId(account: string, domain: string): string {
    return md5(`${account}@${domain}`);
}