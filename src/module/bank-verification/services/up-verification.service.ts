import { Injectable } from "@nestjs/common";
import { UpiVerificationRepository } from "../repositories";

@Injectable()
export class UpiVerificationService {
    constructor(
        private readonly bankAccountVerification: UpiVerificationRepository
    ) { }

}
