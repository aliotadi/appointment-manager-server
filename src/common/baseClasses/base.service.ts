import {
  DeepPartial,
  DeleteResult,
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  InsertResult,
  Repository,
} from 'typeorm';
import { UpsertOptions } from 'typeorm/repository/UpsertOptions';

export class BaseService<T> {
  entityName: string;
  constructor(protected repository: Repository<T>) {
    this.entityName = this.repository.metadata.tableName;
  }

  async create(
    input: DeepPartial<T> | DeepPartial<T>[],
    manager?: EntityManager,
  ): Promise<InsertResult> {
    return manager
      ? await manager.insert(this.entityName, input as any)
      : await this.repository.insert(input as any); // @TODO:  AS T<>
  }

  async upsert(
    input: DeepPartial<T> | DeepPartial<T>[],
    conflictPathsOrOptions: string[] | UpsertOptions<T>,
  ): Promise<InsertResult> {
    return await this.repository.upsert(input as any, conflictPathsOrOptions);
  }

  // DOES NOT SUPPORT TRANSACTION, DO WE NEED TRANSACTION IN INSERT OR IGNORE? I THINK SO
  async insertOrIgnore(
    input: DeepPartial<T> | DeepPartial<T>[],
  ): Promise<number> {
    try {
      const result = await this.create(input);
      return result.identifiers[0].id;
    } catch (e) {
      return undefined;
    }

    // THIS IS THE TRANSACTIONAL SUPPORT CODE
    const [sql, params] = this.repository
      .createQueryBuilder()
      .insert()
      .into(this.entityName)
      .values(input)
      .orIgnore()
      .getQueryAndParameters();

    const response = await this.repository.query(sql, params);

    return response.insertId;
  }

  async update(
    conditions: FindOptionsWhere<T>,
    input: DeepPartial<T>,
    manager?: EntityManager,
  ): Promise<T> {
    if (manager) {
      await manager.update(this.entityName, conditions, input as any);
      return await manager.findOne(this.entityName, {
        where: conditions,
      });
    } else {
      await this.repository.update(conditions, input as any);
      return await this.repository.findOne({
        where: conditions,
      });
    }
  }

  async save(
    input: DeepPartial<T> | DeepPartial<T>[],
    manager?: EntityManager,
  ): Promise<T> {
    return manager
      ? await manager.save(this.entityName, input)
      : await this.repository.save(input as any);
  }

  async delete(
    conditions: FindOptionsWhere<T> | number,
    manager?: EntityManager,
  ): Promise<void> {
    manager
      ? await manager.softDelete(this.entityName, conditions)
      : await this.repository.softDelete(conditions);
  }

  async hardDelete(
    conditions: FindOptionsWhere<T> | number,
    manager?: EntityManager,
  ): Promise<void> {
    manager
      ? await manager.delete(this.entityName, conditions)
      : await this.repository.delete(conditions);
  }

  async findOne(
    options: FindOneOptions<T>,
    manager?: EntityManager,
  ): Promise<T> {
    return manager
      ? await manager.findOne(this.entityName, options)
      : await this.repository.findOne(options);
  }

  async findMany(
    options: FindManyOptions<T>,
    manager?: EntityManager,
  ): Promise<T[]> {
    return manager
      ? await manager.find(this.entityName, options)
      : await this.repository.find(options);
  }

  async paginate(options: FindManyOptions<T>): Promise<[T[], number]> {
    return await this.repository.findAndCount(options);
  }

  async count(options: FindManyOptions<T>): Promise<number> {
    return await this.repository.count(options);
  }
}
