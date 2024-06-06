"use client";

import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import {Copy, Loader, Loader2, RotateCw} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getAndParseMailContentAt, getMailAt, getMailContentUrl, getMailDomains} from "@/lib/api";
import {generateRandomAccount} from "@/lib/account-generator";
import {useToast} from "@/components/ui/use-toast";
import {getMailboxId} from "@/lib/mailbox-utils";
import {MailPicker} from "@/components/mail-picker";
import {MailItem} from "@/components/mail-item";
import {MailView} from "@/components/mail/mail-view";

const MAIL_DOMAINS_QUERY_KEY = "MAIL_DOMAINS_QUERY_KEY";
const MAIL_QUERY_KEY = "MAIL_QUERY_KEY";
const MAIL_DATA_QUERY_KEY = "MAIL_DATA_QUERY_KEY";

const ACCOUNT_LOCALSTORAGE_KEY = "account";
const DOMAIN_LOCALSTORAGE_KEY = "domain";

export default function Index() {
    const {toast} = useToast();
    const queryClient = useQueryClient();

    const [currentAccount, setCurrentAccount] = useState("");
    const [currentDomain, setCurrentDomain] = useState("");
    const [selectedMessageId, setSelectedMessageId] = useState("");

    const domainsQuery = useQuery({
        queryFn: async () => {
            return await getMailDomains();
        },
        queryKey: [MAIL_DOMAINS_QUERY_KEY]
    });

    const mailQuery = useQuery({
        queryFn: async () => {
            return (await getMailAt(getMailboxId(currentAccount, currentDomain)))
                .sort((a, b) => b.timestamp - a.timestamp).map(mail => ({
                    at: new Date(mail.timestamp * 1000),
                    subject: mail.subject,
                    id: mail.message_id,
                    from: mail.from
                }))
        },
        queryKey: [MAIL_QUERY_KEY],
        refetchInterval: 10000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
    });

    const mailDataQuery = useQuery({
        queryFn: async () => {
            if (!selectedMessageId) {
                return null;
            }
            return (await getAndParseMailContentAt(getMailboxId(currentAccount, currentDomain), selectedMessageId));
        },
        queryKey: [MAIL_DATA_QUERY_KEY],
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
    });

    function setAndSaveAccount(account: string): void {
        window.localStorage.setItem(ACCOUNT_LOCALSTORAGE_KEY, account);
        setCurrentAccount(account);
    }

    function setAndSaveDomain(domain: string): void {
        window.localStorage.setItem(DOMAIN_LOCALSTORAGE_KEY, domain);
        setCurrentDomain(domain);
    }

    useEffect(() => {
        const account = window.localStorage.getItem(ACCOUNT_LOCALSTORAGE_KEY) ?? generateRandomAccount();
        setAndSaveAccount(account);
    }, []);

    useEffect(() => {
        if (!domainsQuery.data) {
            return;
        }
        let domain = window.localStorage.getItem(DOMAIN_LOCALSTORAGE_KEY) ?? domainsQuery.data[0];
        if (!domainsQuery.data.find(otherDomain => domain === otherDomain)) {
            domain = domainsQuery.data[0];
        }
        setAndSaveDomain(domain);
    }, [domainsQuery.data]);

    useEffect(() => {
        queryClient.cancelQueries({queryKey: [MAIL_QUERY_KEY]}).then(() =>
            queryClient.refetchQueries({queryKey: [MAIL_QUERY_KEY]})).catch(() => {
        });
    }, [currentDomain, currentAccount, queryClient]);

    useEffect(() => {
        queryClient.refetchQueries({queryKey: [MAIL_DATA_QUERY_KEY]}).catch(() => {
        });
    }, [selectedMessageId, queryClient]);

    function copyEmail() {
        navigator.clipboard.writeText(`${currentAccount}@${currentDomain}`)
            .then(() => {
                toast({
                    title: "Copied to clipboard!"
                });
            })
            .catch(e => {
                toast({
                    variant: "destructive",
                    title: "Error copying to clipboard",
                    description: e.toString()
                });
            });
    }

    return <ResizablePanelGroup className={"min-h-screen max-h-screen"} direction={"horizontal"}>
        <ResizablePanel minSize={30} defaultSize={35}>
            <div className={"w-full h-full flex flex-col"}>
                <div className={"flex flex-row gap-5 p-5"}>
                    <Button className={"min-w-10 p-0"} variant={"outline"} onClick={() =>
                        setCurrentAccount(generateRandomAccount())} title={"New address"}><Loader/></Button>
                    <Button className={"min-w-10 p-0"} variant={"outline"} onClick={() => copyEmail()} title={"Copy email"}><Copy/></Button>
                    <MailPicker account={currentAccount} onAccountChange={value => setAndSaveAccount(value)}
                                domain={currentDomain} onDomainChange={value => setAndSaveDomain(value)}
                                domains={domainsQuery.data}/>
                    <Button className={"min-w-10 p-0"} onClick={() => mailQuery.refetch()} title={"Update inbox"}><RotateCw
                        className={mailQuery.isFetching ?
                            "animate-spin" : ""}/></Button>
                </div>
                <Separator/>
                <ScrollArea className={"flex-1"}>
                    <div className={"flex flex-col p-5 items-center gap-5"}>
                        {mailQuery.data && mailQuery.data.length > 0 ? mailQuery.data.map(mail =>
                                <MailItem selected={mail.id === selectedMessageId} key={mail.id} from={mail.from}
                                          at={mail.at} subject={mail.subject}
                                          onClick={() => setSelectedMessageId(mail.id)}/>) :
                            <div>No mail yet...</div>}
                    </div>
                    <ScrollBar orientation="vertical"/>
                </ScrollArea>
                <Separator/>
                <div className={"flex flex-row p-5"}>
                    <div className={"flex-1"}>TempMail by <a href={"https://re146.dev"}
                                                             className={"underline"}>@radioegor146</a></div>
                    <div><a href={"/swagger/"} className={"underline"}>API docs</a></div>
                </div>
            </div>
        </ResizablePanel>
        <ResizableHandle withHandle={true}/>
        <ResizablePanel minSize={40}>
            {!mailDataQuery.data || mailDataQuery.isFetching ?
                <div className={"w-full h-full flex items-center justify-center"}>
                    {!mailDataQuery.data ? <div>No mail yet...</div> :
                        <Loader2 className="mr-2 h-16 w-16 animate-spin"/>}
                </div> : <MailView url={getMailContentUrl(getMailboxId(currentAccount, currentDomain), selectedMessageId)} data={mailDataQuery.data}/>}
        </ResizablePanel>
    </ResizablePanelGroup>;
}
