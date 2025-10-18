import { Injectable } from "@nestjs/common";
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, InsertResult, Repository, SaveOptions } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserUpdateLogs } from "../entities";

@Injectable()
export class UserUpdateLogsRepository {
    constructor(
        @InjectRepository(UserUpdateLogs)
        private readonly repo: Repository<UserUpdateLogs>
    ) {}

    async find(options: FindManyOptions<UserUpdateLogs>): Promise<UserUpdateLogs[]> {
        return await this.repo.find(options);
    }

    async findOne(options: FindOneOptions<UserUpdateLogs>): Promise<UserUpdateLogs | null> {
        return await this.repo.findOne(options);
    }

    async save(entities: DeepPartial<UserUpdateLogs>): Promise<DeepPartial<UserUpdateLogs> & UserUpdateLogs> {
        return await this.repo.save(entities)  
    }

    async insert(entity: DeepPartial<UserUpdateLogs>[]): Promise<InsertResult> {
        return await this.repo.insert(entity); 
    }

    async update(criteria: FindOptionsWhere<UserUpdateLogs>, partialEntity: DeepPartial<UserUpdateLogs>) {        
        return await this.repo.update(criteria, partialEntity); 
    }

    async delete(criteria: FindOptionsWhere<UserUpdateLogs>) {
        return await this.repo.delete(criteria); 
    }
}