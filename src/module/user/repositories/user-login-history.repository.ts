import { InjectRepository } from "@nestjs/typeorm";
import { UserLoginHistoryEntity } from "../entities";
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InsertResult } from "typeorm/browser";

@Injectable()
export class UserLoginHistoryRepository {
    constructor(
        @InjectRepository(UserLoginHistoryEntity)
        private readonly repo: Repository<UserLoginHistoryEntity>
    ) {}

    async find(options: FindManyOptions<UserLoginHistoryEntity>): Promise<UserLoginHistoryEntity[]> {
        return await this.repo.find(options);
    }

    async findOne(options: FindOneOptions<UserLoginHistoryEntity>): Promise<UserLoginHistoryEntity | null> {
        return await this.repo.findOne(options);
    }
    
    async save(entities: DeepPartial<UserLoginHistoryEntity>): Promise<DeepPartial<UserLoginHistoryEntity> & UserLoginHistoryEntity> {
        return await this.repo.save(entities);
    }

    async insert(entity: DeepPartial<UserLoginHistoryEntity>[]): Promise<InsertResult> {
        return await this.repo.insert(entity);
    }
    
    async update(criteria: FindOptionsWhere<UserLoginHistoryEntity>, partialEntity: DeepPartial<UserLoginHistoryEntity>) {
        return await this.repo.update(criteria, partialEntity);
    }

    async delete(criteria: FindOptionsWhere<UserLoginHistoryEntity>) {
        return await this.repo.delete(criteria);
    }
}