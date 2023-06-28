import { Expose } from "class-transformer"
import { SelectQueryBuilder } from "typeorm"

export interface PaginateOptions {
    limit: number
    currentPage: number
    total?: boolean
}

// 可以返回数组
export class PaginationResult<T> {
    // Partial: 使 中的所有属性可选
    constructor(partial: Partial<PaginationResult<T>>) {
        // 将所有可枚举自身属性的值从一个或多个源对象复制到 目标对象。返回目标对象
        Object.assign(this, partial)
    }
    @Expose()
    first: number
    @Expose()
    last: number
    @Expose()
    limit: number
    @Expose()
    total?: number
    @Expose()
    data: T[]
}

export async function paginate<T>(
    qb: SelectQueryBuilder<T>,
    options: PaginateOptions = {
        limit: 10,
        currentPage: 1,
    }
): Promise<PaginationResult<T>> {
    const offset = (options.currentPage - 1) * options.limit
    const data = await qb.limit(options.limit)
        .offset(offset).getMany()
    return new PaginationResult({
        first: offset + 1,
        last: offset + data.length,
        limit: options.limit,
        total: options.total ? await qb.getCount() : null,
        data
    })
}