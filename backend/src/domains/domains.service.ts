import {InjectRepository} from "@nestjs/typeorm";
import {Domain} from "../common/database/entities/domain.entity";
import {Repository} from "typeorm";
import {Injectable} from "@nestjs/common";

@Injectable()
export class DomainsService {
    constructor(@InjectRepository(Domain) private domainRepository: Repository<Domain>) {
    }

    async getDomains(): Promise<Domain[]> {
        return await this.domainRepository.find();
    }

    async getActiveDomains(): Promise<Domain[]> {
        return await this.domainRepository.find({
            where: {
                active: true
            }
        });
    }

    async saveDomain(domain: Domain): Promise<Domain> {
        return await this.domainRepository.save(domain);
    }
}