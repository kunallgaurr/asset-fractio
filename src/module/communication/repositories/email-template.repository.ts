import { Injectable } from '@nestjs/common';
import { Repository, DeepPartial, InsertResult, FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { EmailTemplateEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EmailTemplateRepository {
    constructor(
        @InjectRepository(EmailTemplateEntity)
        private readonly repo: Repository<EmailTemplateEntity>
    ) { }

    async find(options: FindManyOptions<EmailTemplateEntity>) {
        return this.repo.find(options);
    }

    async findOne(options: FindOneOptions<EmailTemplateEntity>) {
        return this.repo.findOne(options);
    }

    async save(entity: DeepPartial<EmailTemplateEntity>) {
        return this.repo.save(entity);
    }

    async insert(entities: DeepPartial<EmailTemplateEntity>[]): Promise<InsertResult> {
        return this.repo.insert(entities);
    }

    async update(criteria: FindOptionsWhere<EmailTemplateEntity>, partialEntity: DeepPartial<EmailTemplateEntity>) {
        return this.repo.update(criteria, partialEntity);
    }

    async delete(criteria: FindOptionsWhere<EmailTemplateEntity>) {
        return this.repo.delete(criteria);
    }
}
