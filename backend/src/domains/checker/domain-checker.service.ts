import {Injectable, Logger, OnModuleInit} from "@nestjs/common";
import {DomainsService} from "../domains.service";
import {ConfigService} from "@nestjs/config";
import {Cron, CronExpression} from "@nestjs/schedule";
import {query} from "dns-query";
import {SingleQuestionPacket} from "@leichtgewicht/dns-packet";

@Injectable()
export class DomainCheckerService implements OnModuleInit {
    private readonly logger: Logger = new Logger(DomainCheckerService.name);
    private dnsServer: string;
    private requiredMXRecordValue: string;

    private checkingDomains: boolean = false;

    constructor(private domainService: DomainsService, private configService: ConfigService) {
    }

    onModuleInit() {
        this.dnsServer = this.configService.getOrThrow("DOMAIN_CHECKER_DNS_SERVER");
        this.requiredMXRecordValue = this.configService.getOrThrow("DOMAIN_CHECKER_REQUIRED_MX_RECORD_VALUE");
    }

    isActive(response: SingleQuestionPacket): boolean {
        if (!response.answers) {
            return false;
        }
        if (response.answers.length === 0) {
            return false;
        }
        for (const answer of response.answers) {
            if (answer.type === "MX") {
                if (answer.data.exchange !== this.requiredMXRecordValue) {
                    return false;
                }
            } else {
                return false;
            }
        }
        return true;
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async checkDomains(): Promise<void> {
        if (this.checkingDomains) {
            this.logger.warn("Domain check takes too long!");
            return;
        }
        this.checkingDomains = true;
        try {
            const domains = await this.domainService.getDomains();
            for (const domain of domains) {
                try {
                    const response = await query({
                        question: {
                            type: "MX",
                            name: domain.domain
                        }
                    }, {
                        endpoints: [this.dnsServer]
                    });

                    const active = this.isActive(response);

                    if (domain.active !== active) {
                        this.logger.warn(`Domain '${domain.domain}' changed status from ${
                            domain.active ? "active" : "inactive"} to ${active ? "active" : "inactive"}: ${JSON.stringify(response.answers)}`);
                        domain.active = active;
                    }
                } catch (e) {
                    this.logger.error(`Failed to query '${domain.domain}' on '${this.dnsServer}': ${e}`);
                }
            }
        } finally {
            this.checkingDomains = false;
        }
    }
}