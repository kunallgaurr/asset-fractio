import { Global, Module } from "@nestjs/common";
import { SmsGateway } from "./sms-gateway.service";

@Global()
@Module({
    providers: [
        SmsGateway
    ],
    exports: [
        SmsGateway
    ]
})
export class GlobalModule {}