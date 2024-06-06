import {Module} from "@nestjs/common";
import {DomainsController} from "./domains.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {DomainsService} from "./domains.service";
import {Domain} from "../common/database/entities/domain.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Domain])],
    controllers: [DomainsController],
    providers: [DomainsService]
})
export class DomainsModule {
}