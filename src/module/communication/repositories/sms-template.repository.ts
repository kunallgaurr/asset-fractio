import { Injectable } from '@nestjs/common';
import { Repository, DeepPartial, InsertResult, FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { SmsTemplateEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SmsTemplateRepository {
    constructor(
        @InjectRepository(SmsTemplateEntity)
        private readonly repo: Repository<SmsTemplateEntity>
    ) { }

    async find(options: FindManyOptions<SmsTemplateEntity>) {
        return this.repo.find(options);
    }

    async findOne(options: FindOneOptions<SmsTemplateEntity>) {
        return this.repo.findOne(options);
    }

    async save(entity: DeepPartial<SmsTemplateEntity>) {
        return this.repo.save(entity);
    }

    async insert(entities: DeepPartial<SmsTemplateEntity>[]): Promise<InsertResult> {
        return this.repo.insert(entities);
    }

    async update(criteria: FindOptionsWhere<SmsTemplateEntity>, partialEntity: DeepPartial<SmsTemplateEntity>) {
        return this.repo.update(criteria, partialEntity);
    }

    async delete(criteria: FindOptionsWhere<SmsTemplateEntity>) {
        return this.repo.delete(criteria);
    }
}
