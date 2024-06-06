import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env.local', '.env']
        })
    ]
})
export class AppConfigModule {

}