import {Module} from "@nestjs/common";
import {DomainsController} from "./domains.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {DomainsService} from "./domains.service";
import {Domain} from "../common/database/entities/domain.entity";
import {ConfigModule} from "@nestjs/config";
import {DomainCheckerService} from "./checker/domain-checker.service";

@Module({
    imports: [TypeOrmModule.forFeature([Domain]), ConfigModule],
    controllers: [DomainsController],
    providers: [DomainsService, DomainCheckerService]
})
export class DomainsModule {
}