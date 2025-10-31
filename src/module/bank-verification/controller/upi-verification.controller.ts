import { Controller } from "@nestjs/common";
import { UpiVerificationService } from "../services";

@Controller('upi-verification')
export class UpiVerificationController {
    constructor(
        private readonly upiVerification: UpiVerificationService
    ) { }

}
