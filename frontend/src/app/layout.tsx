import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import React from "react";
import {cn} from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import {AppQueryClientProvider} from "@/components/app-query-client-provider";

const inter = Inter({subsets: ["latin"], variable: "--font-sans"});

export const metadata: Metadata = {
    title: "TempMail at re146.dev",
    description: "Temporary mail receiving service on re146.dev",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={cn(
            "min-h-screen bg-background font-sans antialiased",
            inter.variable
        )}>
        <Toaster/>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
        >
            <AppQueryClientProvider>
                {children}
            </AppQueryClientProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
