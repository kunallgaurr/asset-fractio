import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BankAccountVerificationEntity, UpiVerificationEntity } from "./entities";
import { BankAccountVerificationService, UpiVerificationService } from "./services";
import { BankAccountVerificationRepository, UpiVerificationRepository } from "./repositories";
import { BankAccountVerificationController, UpiVerificationController } from "./controller";


@Module({
    imports: [
        TypeOrmModule.forFeature([
            BankAccountVerificationEntity,
            UpiVerificationEntity
        ])
    ],
    providers: [
        BankAccountVerificationService,
        BankAccountVerificationRepository,
        UpiVerificationService,
        UpiVerificationRepository
    ],
    controllers: [
        BankAccountVerificationController,
        UpiVerificationController
    ]
})
export class BankVerificationModule{}