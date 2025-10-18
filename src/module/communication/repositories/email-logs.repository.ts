import { Injectable } from '@nestjs/common';
import { Repository, DeepPartial, InsertResult, FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { EmailLogEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EmailLogRepository {
    constructor(
        @InjectRepository(EmailLogEntity)
        private readonly repo: Repository<EmailLogEntity>
    ) { }

    async find(options: FindManyOptions<EmailLogEntity>) {
        return this.repo.find(options);
    }

    async findOne(options: FindOneOptions<EmailLogEntity>) {
        return this.repo.findOne(options);
    }

    async save(entity: DeepPartial<EmailLogEntity>) {
        return this.repo.save(entity);
    }

    async insert(entities: DeepPartial<EmailLogEntity>[]): Promise<InsertResult> {
        return this.repo.insert(entities);
    }

    async update(criteria: FindOptionsWhere<EmailLogEntity>, partialEntity: DeepPartial<EmailLogEntity>) {
        return this.repo.update(criteria, partialEntity);
    }

    async delete(criteria: FindOptionsWhere<EmailLogEntity>) {
        return this.repo.delete(criteria);
    }
}
