"use client";

import React, {useState} from "react";
import {useToast} from "@/components/ui/use-toast";
import {MutationCache, QueryClient} from "@tanstack/query-core";
import {QueryCache, QueryClientProvider} from "@tanstack/react-query";

export function AppQueryClientProvider({children}: Readonly<{
    children: React.ReactNode;
}>) {
    const {toast} = useToast();

    function defaultErrorHandler(error: Error) {
        toast({
            title: "Error",
            description: "message" in error ? error.message : `${error}`,
            variant: "destructive"
        });
    }

    const [queryClient] = useState(new QueryClient({
        queryCache: new QueryCache({
            onError: defaultErrorHandler,
        }),
        mutationCache: new MutationCache({
            onError: defaultErrorHandler
        })
    }));

    return <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
}