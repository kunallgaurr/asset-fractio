import { Injectable } from "@nestjs/common";
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, InsertResult, Repository, SaveOptions } from "typeorm";
import { AddressEntity } from "./address.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AddressRepository {
    constructor(
        @InjectRepository(AddressEntity)
        private readonly repo: Repository<AddressEntity>
    ) {}

    async find(options: FindManyOptions<AddressEntity>): Promise<AddressEntity[]> {
        return await this.repo.find(options);
    }

    async findOne(options: FindOneOptions<AddressEntity>): Promise<AddressEntity | null> {
        return await this.repo.findOne(options);
    }

    async save(entities: DeepPartial<AddressEntity>): Promise<DeepPartial<AddressEntity> & AddressEntity> {
        return await this.repo.save(entities);
    }

    async insert(entity: DeepPartial<AddressEntity>[]): Promise<InsertResult> {
        return await this.repo.insert(entity);
    }

    async update(criteria: FindOptionsWhere<AddressEntity>, partialEntity: DeepPartial<AddressEntity>) {
        return await this.repo.update(criteria, partialEntity);
    }

    async delete(criteria: FindOptionsWhere<AddressEntity>) {
        return await this.repo.delete(criteria);
    }
}
