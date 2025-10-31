import { Controller } from "@nestjs/common";
import { BankAccountVerificationService } from "../services";

@Controller('bank-account-verification')
export class BankAccountVerificationController {
    constructor(
        private readonly bankAccountVerification: BankAccountVerificationService
    ) { }

    
}
