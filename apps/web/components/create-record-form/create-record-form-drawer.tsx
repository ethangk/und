import type { ICreateRecordInput, Table as CoreTable } from '@egodb/core'
import { createRecordCommandInput } from '@egodb/core'
import { Drawer, zodResolver } from '@egodb/ui'
import { useAtom } from 'jotai'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { useConfirmModal } from '../../hooks'
import { CreateRecordForm } from './create-record-form'
import { CreateRecordFormProvider, useCreateRecord } from './create-record-form-context'
import { createRecordFormDrawerOpened } from './drawer-opened.atom'

interface IProps {
  table: CoreTable
}

export const CreateRecordFormDrawer: React.FC<IProps> = ({ table }) => {
  const [opened, setOpened] = useAtom(createRecordFormDrawerOpened)

  const initialValues: ICreateRecordInput = {
    tableId: table.id.value,
    value: table.schema.fields.map((field) => ({
      name: field.name.value,
      // TODO: get field default value
      value: field.type === 'bool' ? false : null,
    })),
  }

  const form = useCreateRecord({
    initialValues,
    validate: zodResolver(createRecordCommandInput),
  })

  useDeepCompareEffect(() => {
    form.setValues(initialValues)
  }, [initialValues])

  const reset = () => {
    setOpened(false)
    form.clearErrors()
    form.reset()
  }
  const confirm = useConfirmModal({ onConfirm: reset })

  return (
    <CreateRecordFormProvider form={form}>
      <Drawer
        target="body"
        opened={opened}
        onClose={() => {
          if (form.isDirty()) {
            confirm()
          } else {
            reset()
          }
        }}
        title="New Record"
        padding="xl"
        position="right"
        size={700}
      >
        <CreateRecordForm table={table} onCancel={reset} />
      </Drawer>
    </CreateRecordFormProvider>
  )
}
