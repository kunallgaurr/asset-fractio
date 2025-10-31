import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
    DeepPartial,
    FindManyOptions,
    FindOneOptions,
    FindOptionsWhere,
    InsertResult,
    Repository,
} from "typeorm";
import { AssetUpdateLogsEntity } from "../entities";

@Injectable()
export class AssetUpdateLogsRepository {
    constructor(
        @InjectRepository(AssetUpdateLogsEntity)
        private readonly repo: Repository<AssetUpdateLogsEntity>
    ) { }

    async find(options: FindManyOptions<AssetUpdateLogsEntity>): Promise<AssetUpdateLogsEntity[]> {
        return await this.repo.find(options);
    }

    async findOne(options: FindOneOptions<AssetUpdateLogsEntity>): Promise<AssetUpdateLogsEntity | null> {
        return await this.repo.findOne(options);
    }

    async save(entity: DeepPartial<AssetUpdateLogsEntity>): Promise<AssetUpdateLogsEntity> {
        return await this.repo.save(entity);
    }

    async insert(entities: DeepPartial<AssetUpdateLogsEntity>[]): Promise<InsertResult> {
        return await this.repo.insert(entities);
    }

    async update(criteria: FindOptionsWhere<AssetUpdateLogsEntity>, partialEntity: DeepPartial<AssetUpdateLogsEntity>) {
        return await this.repo.update(criteria, partialEntity);
    }

    async delete(criteria: FindOptionsWhere<AssetUpdateLogsEntity>) {
        return await this.repo.delete(criteria);
    }
}
