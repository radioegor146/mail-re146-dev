import {Attachment} from "postal-mime";
import {downloadBlob} from "@/lib/download-utils";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {nicefyFileName} from "@/lib/text-utils";
import {Download, FileText} from "lucide-react";
import {Button} from "@/components/ui/button";
import React from "react";

const UNKNOWN_FILE_NAME = "unknown.bin";

export function MailAttachment({attachment}: { attachment: Attachment }) {
    function downloadAttachment() {
        downloadBlob(attachment.content, attachment.filename ?? UNKNOWN_FILE_NAME, attachment.mimeType);
    }

    return <Card className={"w-36 h-full flex flex-col"}>
        <CardContent className={"p-2 flex flex-col gap-2 flex-1"}>
            <div className={"break-words text-sm"} title={attachment.filename ?? UNKNOWN_FILE_NAME}>
                {nicefyFileName(attachment.filename ?? UNKNOWN_FILE_NAME)}
            </div>
            <div className={"flex justify-center w-full justify-self-end"}>
                <FileText className={"h-24 w-24"} strokeWidth={0.5}/>
            </div>
        </CardContent>
        <CardFooter className={"p-0"}>
            <Button className={"rounded-t-none p-1 w-full"} onClick={() => downloadAttachment()}><Download/></Button>
        </CardFooter>
    </Card>;
}