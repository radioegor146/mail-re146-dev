import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {Domain} from "./entities/domain.entity";
import {Message} from "./entities/message.entity";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: "postgres",
                url: configService.getOrThrow("DATABASE_URL"),
                entities: [Domain, Message],
                synchronize: true
            }),
            inject: [ConfigService]
        })
    ]
})
export class DatabaseModule {}