import type { IOptionColorName, IOptionColorShade, IRootFilter, IViewFieldOption } from '@egodb/core'
import type { ICurrencySymbol } from '@egodb/core/field/currency'

type NumberFieldInMemory = {
  id: string
  type: 'number'
  name: string
  required?: boolean
  currency?: ICurrency
}

interface ICurrency {
  symbol: ICurrencySymbol
}

type StringFieldInMemory = {
  id: string
  type: 'string'
  name: string
  required?: boolean
}

type DateFieldInMemory = {
  id: string
  type: 'date'
  name: string
  required?: boolean
}

type DateRangeFieldInMemory = {
  id: string
  type: 'date-range'
  name: string
  required?: boolean
}

export type OptionInMemory = {
  id: string
  name: string
  color: {
    name: IOptionColorName
    shade: IOptionColorShade
  }
}

export type SelectFieldInMemory = {
  id: string
  type: 'select'
  name: string
  required?: boolean
  options: OptionInMemory[]
}

type BoolFieldInMemory = {
  id: string
  type: 'bool'
  name: string
  required?: boolean
}

export type SchemaInMemory = FieldInMemory[]

export type FieldInMemory =
  | StringFieldInMemory
  | NumberFieldInMemory
  | DateFieldInMemory
  | DateRangeFieldInMemory
  | SelectFieldInMemory
  | BoolFieldInMemory

export type KanbanInMemory = {
  fieldId?: string
}

export type CalendarInMemory = {
  fieldId?: string
}

export type ViewInMemory = {
  id: string
  name: string
  displayType: 'grid' | 'kanban' | 'calendar'
  kanban?: KanbanInMemory
  calendar?: CalendarInMemory
  filter?: IRootFilter
  fieldOptions: Record<string, IViewFieldOption>
  fieldsOrder?: string[]
}

export type ViewsInMemory = ViewInMemory[]

export type TableInMemory = {
  id: string
  name: string
  schema: FieldInMemory[]
  views: ViewInMemory[]
}