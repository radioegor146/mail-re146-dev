import PostalMime, {Email} from "postal-mime";

export interface Mail {
    from: string,
    message_id: string,
    subject: string,
    timestamp: number
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "";

export async function getMailAt(mailBoxId: string): Promise<Mail[]> {
    return await (await fetch(`${BASE_URL}/api/list/${encodeURIComponent(mailBoxId)}`)).json();
}

export async function getMailDomains(): Promise<string[]> {
    return await (await fetch(`${BASE_URL}/api/domains`)).json();
}

export async function getAndParseMailContentAt(mailBoxId: string, messageId: string): Promise<Email> {
    const response = await fetch(getMailContentUrl(mailBoxId, messageId));
    if (!response.body) {
        throw new Error("No body");
    }

    return await PostalMime.parse(response.body);
}

export function getMailContentUrl(mailBoxId: string, messageId: string): string {
    return `${BASE_URL}/storage/${encodeURIComponent(mailBoxId)}/${encodeURIComponent(messageId)}`;
}