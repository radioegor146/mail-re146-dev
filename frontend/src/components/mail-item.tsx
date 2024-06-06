import {Button} from "@/components/ui/button";
import React from "react";

export function MailItem({selected, from, at, subject, onClick}: {
    selected: boolean,
    from: string, at: Date, subject: string, onClick: () => void
}) {
    return <Button variant={"outline"} className={"p-3 w-full h-full flex " +
        `flex-col items-start justify-start text-left gap-7 ${selected ? "bg-muted" : ""}`} onClick={() => onClick()}>
        <div className={"flex flex-row w-full"}>
            <div className={"flex-1"}>{from}</div>
            <div>{at.toLocaleString()}</div>
        </div>
        <div className={"overflow-ellipsis whitespace-pre-wrap"}>{subject}</div>
    </Button>
}