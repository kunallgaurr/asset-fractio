import { Injectable } from "@nestjs/common";
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, InsertResult, Repository, SaveOptions } from "typeorm";
import { UserMasterEntity } from "./user-master.entity";

@Injectable()
export class UserRepository {
    constructor(
        private readonly userRepository: Repository<UserMasterEntity>
    ) {}

    async find(options: FindManyOptions<UserMasterEntity>): Promise<UserMasterEntity[]> {
        return await this.userRepository.find(options);
    }

    async findOne(options: FindOneOptions<UserMasterEntity>): Promise<UserMasterEntity | null> {
        return await this.userRepository.findOne(options);
    }

    async save(entities: DeepPartial<UserMasterEntity>): Promise<DeepPartial<UserMasterEntity> & UserMasterEntity> {
        return await this.userRepository.save(entities)  
    }

    async insert(entity: DeepPartial<UserMasterEntity>[]): Promise<InsertResult> {
        return await this.userRepository.insert(entity); 
    }

    async update(criteria: FindOptionsWhere<UserMasterEntity>, partialEntity: DeepPartial<UserMasterEntity>) {        
        return await this.userRepository.update(criteria, partialEntity); 
    }

    async delete(criteria: FindOptionsWhere<UserMasterEntity>) {
        return await this.userRepository.delete(criteria); 
    }
}