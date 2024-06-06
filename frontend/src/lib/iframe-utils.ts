// language=JavaScript
export const iframeScript = `
    const cidRegexp = /^cid:(.*?)$/i;

    function updateImageUrl(url) {
        const cid = cidRegexp.exec(url);
        if (cid) {
            return cidBlobs[cid[1]];
        }
        return 'https://mail-imgproxy.re146.dev/?url=' + encodeURIComponent(url);
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        [...document.getElementsByTagName('img')].map(element => {
            element.src = updateImageUrl(element.src);
        });
    });
`;

export function randomString(): string {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return [...Array(16)].map(_ => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export function createScriptElement(nonce: string, script: string): string {
    return `<script nonce=${JSON.stringify(nonce)}>${script}</script>`
}