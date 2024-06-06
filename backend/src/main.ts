import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix("api");

    const config = new DocumentBuilder()
        .setTitle('TempMail at re146.dev')
        .setDescription('Temporary mail receiving service on re146.dev')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    document.paths["/storage/{mailboxId}/{messageId}"] = {
        get: {
            tags: [
                "messages"
            ],
            summary: "Get message contents by message ID",
            parameters: [
                {
                    name: "mailboxId",
                    in: "path",
                    description: "Mailbox ID (md5(account@domain))",
                    required: true,
                    schema: {
                        type: "string",
                        format: "hex"
                    },
                    example: "6121f87980450cacb7e49b12d3707d7d"
                },
                {
                    name: "messageId",
                    in: "path",
                    description: "Message ID",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    }
                }
            ],
            responses: {
                "200": {
                    description: "Successful response",
                    content: {
                        "text/plain": {
                            schema: {
                                type: "string",
                                example: "message-contents"
                            }
                        }
                    }
                }
            }
        }
    };
    SwaggerModule.setup('swagger', app, document, {
        useGlobalPrefix: true
    });

    await app.listen(3000);
}

bootstrap();
