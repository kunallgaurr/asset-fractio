import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { SmsTemplateEntity } from "./entities";
import { EmailLogRepository, EmailTemplateRepository, SmsLogRepository, SmsTemplateRepository } from "./repositories";
import { constants, HttpResponse } from "src/utils";
import { SmsGateway } from "src/global";

@Injectable()
export class CommunicationService {
    constructor(
        private readonly emailTemplate: EmailTemplateRepository,
        private readonly emailLogs: EmailLogRepository,
        private readonly smsTemplate: SmsTemplateRepository,
        private readonly smsLogs: SmsLogRepository,
        private readonly smsGateway: SmsGateway
    ) { };

    async createSmsTemplate(payload) {
        try {
            const {content, name, variables} = payload;

            const templateLookup = await this.smsTemplate.findOne({
                where: [
                    {content}, {name}
                ]
            });

            if(templateLookup) return HttpResponse.badRequest('Template already exist.')

            const [template, sid] = await Promise.all([
                this.smsTemplate.save({ content, name, variables }),
                this.smsGateway.createTemplate(payload)
            ]);

            template.sid = sid;
            await this.smsTemplate.save(template);

            return HttpResponse.success();
        } catch (error) {
            console.log(error);
            return HttpResponse.internalServerError();
        }
    }

    async createEmailTemplate() {}
    
    private renderTemplate(template: string, variables: Record<string, string>) {
        return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
            return variables[key] ?? '';
        });
    }
}