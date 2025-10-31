import { Injectable } from "@nestjs/common";
import {
    DeepPartial,
    FindManyOptions,
    FindOneOptions,
    FindOptionsWhere,
    InsertResult,
    Repository,
} from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { BankAccountVerificationEntity } from "../entities";

@Injectable()
export class BankAccountVerificationRepository {
    constructor(
        @InjectRepository(BankAccountVerificationEntity)
        private readonly repo: Repository<BankAccountVerificationEntity>,
    ) { }

    async find(
        options: FindManyOptions<BankAccountVerificationEntity>,
    ): Promise<BankAccountVerificationEntity[]> {
        return await this.repo.find(options);
    }

    async findOne(
        options: FindOneOptions<BankAccountVerificationEntity>,
    ): Promise<BankAccountVerificationEntity | null> {
        return await this.repo.findOne(options);
    }

    async save(
        entity: DeepPartial<BankAccountVerificationEntity>,
    ): Promise<DeepPartial<BankAccountVerificationEntity> &
        BankAccountVerificationEntity> {
        return await this.repo.save(entity);
    }

    async insert(
        entities: DeepPartial<BankAccountVerificationEntity>[],
    ): Promise<InsertResult> {
        return await this.repo.insert(entities);
    }

    async update(
        criteria: FindOptionsWhere<BankAccountVerificationEntity>,
        partialEntity: DeepPartial<BankAccountVerificationEntity>,
    ) {
        return await this.repo.update(criteria, partialEntity);
    }

    async delete(criteria: FindOptionsWhere<BankAccountVerificationEntity>) {
        return await this.repo.delete(criteria);
    }
}
