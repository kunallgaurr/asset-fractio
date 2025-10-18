import { Injectable } from "@nestjs/common";
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, InsertResult, Repository, SaveOptions } from "typeorm";
import { UserMasterEntity } from "../entities";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserMasterEntity)
        private readonly repo: Repository<UserMasterEntity>
    ) {}

    async find(options: FindManyOptions<UserMasterEntity>): Promise<UserMasterEntity[]> {
        return await this.repo.find(options);
    }

    async findOne(options: FindOneOptions<UserMasterEntity>): Promise<UserMasterEntity | null> {
        return await this.repo.findOne(options);
    }

    async save(entities: DeepPartial<UserMasterEntity>): Promise<DeepPartial<UserMasterEntity> & UserMasterEntity> {
        return await this.repo.save(entities)  
    }

    async insert(entity: DeepPartial<UserMasterEntity>[]): Promise<InsertResult> {
        return await this.repo.insert(entity); 
    }

    async update(criteria: FindOptionsWhere<UserMasterEntity>, partialEntity: DeepPartial<UserMasterEntity>) {        
        return await this.repo.update(criteria, partialEntity); 
    }

    async delete(criteria: FindOptionsWhere<UserMasterEntity>) {
        return await this.repo.delete(criteria); 
    }
}