import { Injectable } from "@nestjs/common";
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, InsertResult, Repository, SaveOptions } from "typeorm";
import { UserPreferencesEntity, AssetType, InvestmentRisk, NotificationFrequency, PrivacyLevel } from "../entities";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserPreferencesRepository {
    constructor(
        @InjectRepository(UserPreferencesEntity)
        private readonly repo: Repository<UserPreferencesEntity>
    ) {}

    async find(options: FindManyOptions<UserPreferencesEntity>): Promise<UserPreferencesEntity[]> {
        return await this.repo.find(options);
    }

    async findOne(options: FindOneOptions<UserPreferencesEntity>): Promise<UserPreferencesEntity | null> {
        return await this.repo.findOne(options);
    }

    async save(entities: DeepPartial<UserPreferencesEntity>): Promise<DeepPartial<UserPreferencesEntity> & UserPreferencesEntity> {
        return await this.repo.save(entities);
    }

    async insert(entity: DeepPartial<UserPreferencesEntity>[]): Promise<InsertResult> {
        return await this.repo.insert(entity);
    }

    async update(criteria: FindOptionsWhere<UserPreferencesEntity>, partialEntity: DeepPartial<UserPreferencesEntity>) {
        return await this.repo.update(criteria, partialEntity);
    }

    async delete(criteria: FindOptionsWhere<UserPreferencesEntity>) {
        return await this.repo.delete(criteria);
    }
}
