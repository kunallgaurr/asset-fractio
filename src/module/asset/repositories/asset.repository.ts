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
import { AssetMasterEntity } from "../entities";

@Injectable()
export class AssetMasterRepository {
    constructor(
        @InjectRepository(AssetMasterEntity)
        private readonly repo: Repository<AssetMasterEntity>
    ) { }

    async find(options: FindManyOptions<AssetMasterEntity>): Promise<AssetMasterEntity[]> {
        return await this.repo.find(options);
    }

    async findOne(options: FindOneOptions<AssetMasterEntity>): Promise<AssetMasterEntity | null> {
        return await this.repo.findOne(options);
    }

    async save(entity: DeepPartial<AssetMasterEntity>): Promise<AssetMasterEntity> {
        return await this.repo.save(entity);
    }

    async insert(entities: DeepPartial<AssetMasterEntity>[]): Promise<InsertResult> {
        return await this.repo.insert(entities);
    }

    async update(criteria: FindOptionsWhere<AssetMasterEntity>, partialEntity: DeepPartial<AssetMasterEntity>) {
        return await this.repo.update(criteria, partialEntity);
    }

    async delete(criteria: FindOptionsWhere<AssetMasterEntity>) {
        return await this.repo.delete(criteria);
    }
}
