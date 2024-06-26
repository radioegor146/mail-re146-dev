import { Module } from '@nestjs/common';
import {AppConfigModule} from "./common/config/app-config.module";
import {DatabaseModule} from "./common/database/database.module";
import {DomainsModule} from "./domains/domains.module";
import {MessagesModule} from "./mail/messages.module";
import {ScheduleModule} from "@nestjs/schedule";

@Module({
  imports: [
      ScheduleModule.forRoot(),
      AppConfigModule,
      DatabaseModule,
      DomainsModule,
      MessagesModule
  ],
})
export class AppModule {}
