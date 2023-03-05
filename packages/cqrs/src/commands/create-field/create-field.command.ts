import { ICreateFieldSchema } from '@egodb/core'
import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { ICreateFieldCommandInput } from './create-field.command.interface.js'

export class CreateFieldCommand extends Command implements ICreateFieldCommandInput {
  public readonly tableId: string
  public readonly viewId?: string
  public readonly at?: number
  public readonly field: ICreateFieldSchema

  constructor(props: CommandProps<ICreateFieldCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.at = props.at
    this.field = props.field
  }
}
