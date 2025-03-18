import {Controller, Get, Injectable} from "@nestjs/common";
import {DomainsService} from "./domains.service";
import {ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";

@ApiTags('domains')
@Controller()
export class DomainsController {
    constructor(private domainsService: DomainsService) {
    }

    @Get("domains")
    @ApiOperation({
        summary: "Get all active domains"
    })
    @ApiOkResponse({
        description: "Successful response",
        type: [String],
    })
    async getActiveDomains(): Promise<string[]> {
        return (await this.domainsService.getActiveDomains()).map(domain => domain.domain);
    }
}