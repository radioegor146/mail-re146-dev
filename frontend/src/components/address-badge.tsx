import {Address} from "postal-mime";
import {Badge} from "@/components/ui/badge";
import React from "react";

export function AddressBadge({address}: { address: Address }) {
    return <Badge>{address.name ? <><span>{address.name}</span>&nbsp;
            <span>{address.address ? `<${address.address}>` : ''}</span></> :
        <span>{address.address ? address.address : 'Unknown'}</span>}</Badge>
}