import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Repository,
  DeepPartial,
  FindOneOptions,
  FindManyOptions,
  InsertResult,
  FindOptionsWhere,
} from "typeorm";
import { IfoDetailsEntity } from "../entities";

@Injectable()
export class IfoDetailsRepository {
  constructor(
    @InjectRepository(IfoDetailsEntity)
    private readonly repo: Repository<IfoDetailsEntity>,
  ) {}

  async find(options?: FindManyOptions<IfoDetailsEntity>): Promise<IfoDetailsEntity[]> {
    return await this.repo.find(options);
  }

  async findOne(options: FindOneOptions<IfoDetailsEntity>): Promise<IfoDetailsEntity | null> {
    return await this.repo.findOne(options);
  }

  async save(entity: DeepPartial<IfoDetailsEntity>): Promise<IfoDetailsEntity> {
    return await this.repo.save(entity);
  }

  async insert(entity: DeepPartial<IfoDetailsEntity>[]): Promise<InsertResult> {
    return await this.repo.insert(entity);
  }

  async update(criteria: FindOptionsWhere<IfoDetailsEntity>, partialEntity: DeepPartial<IfoDetailsEntity>) {
    return await this.repo.update(criteria, partialEntity);
  }

  async delete(criteria: FindOptionsWhere<IfoDetailsEntity>) {
    return await this.repo.delete(criteria);
  }
}
