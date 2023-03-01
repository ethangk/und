import { ISortDirection } from '@egodb/core'
import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { ISetShowSystemFieldsCommandInput } from './set-show-system-fields.command.interface.js'

export class SetShowSystemFieldsCommand extends Command implements ISetShowSystemFieldsCommandInput {
  readonly tableId: string
  readonly viewId?: string
  readonly fieldId: string
  readonly direction: ISortDirection

  constructor(props: CommandProps<ISetShowSystemFieldsCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.fieldId = props.fieldId
    this.direction = props.direction
  }
}
