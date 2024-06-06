import {Email} from "postal-mime";
import {AddressBadge} from "@/components/address-badge";
import {Separator} from "@/components/ui/separator";
import {MailAttachment} from "@/components/mail/mail-attachment";
import React from "react";

import {MailContentView} from "@/components/mail/mail-content-view";
import {Button} from "@/components/ui/button";
import {FileDown} from "lucide-react";
import {downloadURL} from "@/lib/download-utils";

export function MailView({data, url}: { data: Email, url: string }) {
    return <div className={"flex flex-col h-full"}>
        <div className={"flex flex-col p-5 gap-2"}>
            <a href={url} className={"absolute right-5 top-5"}>
                <Button className={"p-0 min-w-10"} variant={"outline"} title={"Download raw"}>
                    <FileDown/>
                </Button>
            </a>
            <div className={"flex flex-row gap-2"}>
                <div>From:</div>
                <div><AddressBadge address={data.from}/></div>
            </div>
            {data.to ? <div className={"flex flex-row gap-2"}>
                <div>To:</div>
                {data.to.map((address, i) => <div key={i}><AddressBadge address={address}/></div>)}
            </div> : <></>}
            {data.cc ? <div className={"flex flex-row gap-2"}>
                <div>CC:</div>
                {data.cc.map((address, i) => <div key={i}><AddressBadge address={address}/></div>)}
            </div> : <></>}
            {data.bcc ? <div className={"flex flex-row gap-2"}>
                <div>BCC:</div>
                {data.bcc.map((address, i) => <div key={i}><AddressBadge address={address}/></div>)}
            </div> : <></>}
            {data.replyTo ? <div className={"flex flex-row gap-2"}>
                <div>Reply to:</div>
                {data.replyTo.map((address, i) => <div key={i}><AddressBadge address={address}/></div>)}
            </div> : <></>}
            <div className={"flex flex-row gap-2"}>
                <div>Subject:</div>
                <div>{data.subject ?? "No subject"}</div>
            </div>
            <div className={"flex flex-row gap-2"}>
                <div>Sent at:</div>
                <div>{data.date ? new Date(data.date).toLocaleString() : "Never?"}</div>
            </div>
        </div>
        <Separator orientation={"horizontal"}/>
        <MailContentView data={data}/>
        <Separator orientation={"horizontal"}/>
        <div className={"flex flex-row p-3 gap-3"}>
            {
                data.attachments.filter(attachment => attachment.disposition === "attachment")
                    .map((attachment, i) => <MailAttachment key={i} attachment={attachment}/>)
            }
        </div>
    </div>;
}