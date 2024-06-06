import {Input} from "@/components/ui/input";
import {Card} from "@/components/ui/card";
import {AtSign} from "lucide-react";
import {DomainPicker} from "@/components/domain-picker";
import React from "react";

export function MailPicker({domain, account, onDomainChange, onAccountChange, domains}: {
    domain: string,
    account: string,
    onDomainChange: (value: string) => void,
    onAccountChange: (value: string) => void,
    domains?: string[]
}) {
    return <div className={"flex flex-row w-full"}>
        <Input className={"rounded-r-none"} value={account} onChange={e => onAccountChange(e.target.value)}/>
        <Card className={"rounded-none border-l-0 flex justify-center items-center min-w-8"}>
            <AtSign className={"w-4 h-4"}/>
        </Card>
        <DomainPicker domain={domain} onDomainChange={onDomainChange} domains={domains}/>
    </div>
}