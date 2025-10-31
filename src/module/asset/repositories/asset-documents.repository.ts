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
import { AssetDocumentsEntity } from "../entities";

@Injectable()
export class AssetDocumentsRepository {
    constructor(
        @InjectRepository(AssetDocumentsEntity)
        private readonly repo: Repository<AssetDocumentsEntity>
    ) { }

    async find(options: FindManyOptions<AssetDocumentsEntity>): Promise<AssetDocumentsEntity[]> {
        return await this.repo.find(options);
    }

    async findOne(options: FindOneOptions<AssetDocumentsEntity>): Promise<AssetDocumentsEntity | null> {
        return await this.repo.findOne(options);
    }

    async save(entity: DeepPartial<AssetDocumentsEntity>): Promise<AssetDocumentsEntity> {
        return await this.repo.save(entity);
    }

    async insert(entities: DeepPartial<AssetDocumentsEntity>[]): Promise<InsertResult> {
        return await this.repo.insert(entities);
    }

    async update(criteria: FindOptionsWhere<AssetDocumentsEntity>, partialEntity: DeepPartial<AssetDocumentsEntity>) {
        return await this.repo.update(criteria, partialEntity);
    }

    async delete(criteria: FindOptionsWhere<AssetDocumentsEntity>) {
        return await this.repo.delete(criteria);
    }
}
