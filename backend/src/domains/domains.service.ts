import {InjectRepository} from "@nestjs/typeorm";
import {Domain} from "../common/database/entities/domain.entity";
import {Repository} from "typeorm";
import {Injectable} from "@nestjs/common";

@Injectable()
export class DomainsService {
    constructor(@InjectRepository(Domain) private domainRepository: Repository<Domain>) {
    }

    async getDomains(): Promise<string[]> {
        return (await this.domainRepository.find()).map(domain => domain.domain);
    }
}