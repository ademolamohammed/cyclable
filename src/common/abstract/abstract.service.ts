import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, DeleteResult, FindConditions, FindManyOptions, FindOneOptions, ObjectID, Repository, SaveOptions } from 'typeorm';
import { IDefaultOptions, IGetMetaProps, IMeta, IPaginateResult, PaginateResult } from '../paginate-result.interface';

@Injectable()
export class AbstractService<T> {
  constructor(protected readonly repository: Repository<T>, protected readonly entityName?: string) { }

  protected DEFAULTOPTIONS: IDefaultOptions = { limit: 10, page: 1 };

  protected getMeta({ total, data, limit, page }: IGetMetaProps): IMeta {
    let meta: Partial<IMeta> = { totalItems: total, count: data?.length };
    meta = { ...meta, itemsPerPage: limit, currentPage: page };
    meta = { ...meta, totalPages: Math.ceil(total / limit) };
    return meta as IMeta;
  }

  async findAll(condition?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(condition);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const newRecord = this.repository.create(data);
    return await this.repository.save(newRecord as DeepPartial<T>);
  }

  async createMany(data: DeepPartial<T>[]): Promise<T[]> {
    const newRecords = this.repository.create(data);
    return await this.repository.save(newRecords as DeepPartial<T>[]);
  }

  async findOne(condition: FindOneOptions<T>): Promise<T> {
    return await this.repository.findOne(condition);
  }

  async findOneOrFail(condition: FindOneOptions<T>): Promise<T> {
    return await this.repository.findOneOrFail(condition);
  }

  async findByIds(condition: string[] | any[]): Promise<T[]> {
    return await this.repository.findByIds(condition);
  }

  async count(condition: FindManyOptions<T>): Promise<number> {
    return await this.repository.count(condition);
  }

  async find(condition: FindManyOptions<T> | FindConditions<T>, options = this.DEFAULTOPTIONS): Promise<IPaginateResult<T[]>> {
    let { limit = 10, page = 1 } = options;
    const query = { ...condition, take: limit, skip: (page - 1) * limit };
    const [data, total] = await this.repository.findAndCount(query);
    const meta = this.getMeta({ total, data, limit, page });
    return { data, meta };
  }

  async update(id: string | ObjectID, data: DeepPartial<T>): Promise<T> {
    const exists = await this.repository.findOne(id);
    if (!exists) throw new Error(`${this.entityName || 'Record'} Does Not Exist`);
    return await this.repository.save({ id, ...exists, ...data }, { reload: true, transaction: true });
  }

  async updateWhere(condition: FindConditions<T> | FindOneOptions<T>, data: DeepPartial<T>): Promise<T> {
    const exists = await this.repository.findOne(condition);
    if (!exists) throw new Error(`${this.entityName || 'Record'} Does Not Exist`);
    return await this.repository.save({ ...exists, ...data });
  }

  async updateManyWhere(condition: FindConditions<T> | FindOneOptions<T>, data: DeepPartial<T>): Promise<T[]> {
    const exists = await this.repository.find(condition);
    if (!exists) throw new Error(`${this.entityName || 'Record'} Does Not Exist`);
    if (exists.length === 0) return exists;
    const updateData = exists.map((item) => ({ ...item, ...data }));
    return await this.repository.save(updateData);
  }

  async softRemove(condition: FindOneOptions<T>, saveOptions?: SaveOptions): Promise<{ message: string }> {
    const exists = await this.repository.findOne(condition);
    if (!exists) throw new Error(`${this.entityName || 'Record'} Does Not Exist`);
    const record = this.repository.create(exists as DeepPartial<T>);
    await this.repository.softRemove(record as DeepPartial<T>, saveOptions);
    return { message: `${this.entityName || 'Record'} Deleted Successfully` };
  }

  async delete(id: string | number | string[] | Date | ObjectID | FindConditions<T> | number[] | Date[] | ObjectID[]): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  async deleteWhere(condition: FindConditions<T>): Promise<DeleteResult> {
    return await this.repository.delete(condition);
  }
}
