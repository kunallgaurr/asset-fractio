import { Body, Controller, Post } from "@nestjs/common";
import { CommunicationService } from "./communication.service";

@Controller('communication')
export class CommunicationController {
    constructor(
        private communicationService: CommunicationService
    ) {}

    @Post('sms/template/create')
    async createSmsTemplate(@Body() body) {
        return this.communicationService.createSmsTemplate(body);
    }
}