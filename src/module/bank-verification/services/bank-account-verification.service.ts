import { Injectable } from "@nestjs/common";
import { BankAccountVerificationRepository } from "../repositories";

@Injectable()
export class BankAccountVerificationService {
    constructor(
        private readonly bankAccountVerification: BankAccountVerificationRepository
    ) { }

}
