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
import { UpiVerificationEntity } from "../entities";

@Injectable()
export class UpiVerificationRepository {
    constructor(
        @InjectRepository(UpiVerificationEntity)
        private readonly repo: Repository<UpiVerificationEntity>,
    ) { }

    async find(
        options: FindManyOptions<UpiVerificationEntity>,
    ): Promise<UpiVerificationEntity[]> {
        return await this.repo.find(options);
    }

    async findOne(
        options: FindOneOptions<UpiVerificationEntity>,
    ): Promise<UpiVerificationEntity | null> {
        return await this.repo.findOne(options);
    }

    async save(
        entity: DeepPartial<UpiVerificationEntity>,
    ): Promise<DeepPartial<UpiVerificationEntity> & UpiVerificationEntity> {
        return await this.repo.save(entity);
    }

    async insert(
        entities: DeepPartial<UpiVerificationEntity>[],
    ): Promise<InsertResult> {
        return await this.repo.insert(entities);
    }

    async update(
        criteria: FindOptionsWhere<UpiVerificationEntity>,
        partialEntity: DeepPartial<UpiVerificationEntity>,
    ) {
        return await this.repo.update(criteria, partialEntity);
    }

    async delete(criteria: FindOptionsWhere<UpiVerificationEntity>) {
        return await this.repo.delete(criteria);
    }
}
