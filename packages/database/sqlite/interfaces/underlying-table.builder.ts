import type { NoneSystemField } from '@egodb/core'

export interface IUnderlyingColumnBuilder {
  createAutoIncrement(): this
  createId(tableName: string): this
  createCreatedAt(): this
  createUpdatedAt(tableName: string): this
  createDeletedAt(): this
  createUnderlying(fields: NoneSystemField[]): this
}
