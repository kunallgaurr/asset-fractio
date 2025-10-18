import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmailLogEntity, EmailTemplateEntity, SmsLogEntity, SmsTemplateEntity } from "./entities";
import { CommunicationService } from "./communication.service";
import { EmailLogRepository, EmailTemplateRepository, SmsLogRepository, SmsTemplateRepository } from "./repositories";
import { CommunicationController } from "./communication.controller";

@Module({
    imports: [
            TypeOrmModule.forFeature([
                EmailTemplateEntity,
                EmailLogEntity,
                SmsTemplateEntity,
                SmsLogEntity
            ])
        ],
        exports: [],
        providers: [
            CommunicationService,
            EmailTemplateRepository,
            EmailLogRepository,
            SmsTemplateRepository,
            SmsLogRepository
        ],
        controllers: [CommunicationController]
})
export class CommunicationModule {}