import {Email} from "postal-mime";
import {createScriptElement, iframeScript, randomString} from "@/lib/iframe-utils";
import React, {useEffect, useRef} from "react";

export function MailContentView({data}: { data: Email }) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (!data.html) {
            return;
        }

        const iframe = iframeRef.current;
        if (!iframe) {
            return;
        }

        const nonce = randomString();
        const csp = `default-src 'none'; script-src 'nonce-${nonce}'; style-src 'unsafe-inline'; img-src blob: https://mail-imgproxy.re146.dev`;


        const cidBlobsScript = `const cidBlobs = ${JSON.stringify(Object.fromEntries(
            data.attachments.filter(item => item.contentId)
                .map(item => [
                    item.contentId!.slice(1, item.contentId!.length - 1),
                    window.URL.createObjectURL(
                        new Blob([item.content], {
                            type: item.mimeType
                        })
                    )
                ])
        ))};\n`;

        iframe.allow = "";
        (iframe as any).csp = csp;
        iframe.srcdoc = createScriptElement(nonce, cidBlobsScript + iframeScript) + data.html;
    }, [iframeRef, data])

    if (data.html) {
        return <iframe ref={iframeRef} allow={""}
                       className={"flex-1"}></iframe>;
    }

    return <pre className={"p-2 flex-1"}>{data.text}</pre>;
}