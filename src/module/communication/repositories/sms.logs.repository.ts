import { Injectable } from '@nestjs/common';
import { Repository, DeepPartial, InsertResult, FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { SmsLogEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SmsLogRepository {
    constructor(
        @InjectRepository(SmsLogEntity)
        private readonly repo: Repository<SmsLogEntity>
    ) { }

    async find(options: FindManyOptions<SmsLogEntity>) {
        return this.repo.find(options);
    }

    async findOne(options: FindOneOptions<SmsLogEntity>) {
        return this.repo.findOne(options);
    }

    async save(entity: DeepPartial<SmsLogEntity>) {
        return this.repo.save(entity);
    }

    async insert(entities: DeepPartial<SmsLogEntity>[]): Promise<InsertResult> {
        return this.repo.insert(entities);
    }

    async update(criteria: FindOptionsWhere<SmsLogEntity>, partialEntity: DeepPartial<SmsLogEntity>) {
        return this.repo.update(criteria, partialEntity);
    }

    async delete(criteria: FindOptionsWhere<SmsLogEntity>) {
        return this.repo.delete(criteria);
    }
}
