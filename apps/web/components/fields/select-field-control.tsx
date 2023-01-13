import { DndContext, rectIntersection } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { optionColorOrder } from '@egodb/core'
import { OptionId } from '@egodb/core'
import {
  useListState,
  Stack,
  Group,
  ActionIcon,
  IconGripVertical,
  TextInput,
  Button,
  IconSelect,
  FocusTrap,
  IconCircleChevronDown,
  Popover,
  SimpleGrid,
  UnstyledButton,
  IconTrash,
  Grid,
} from '@egodb/ui'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { CSS } from '@dnd-kit/utilities'
import type { IOptionColor, ICreateOptionSchema } from '@egodb/core'
import { OptionColor } from '@egodb/core'
import { Option } from '../option/option'
import { useState } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'

type OnColorChange = (color: IOptionColor) => void

interface IOptionColorPickerProps {
  option: ICreateOptionSchema
  onChange: OnColorChange
}

const OptionColorPicker: React.FC<IOptionColorPickerProps> = ({ option, onChange }) => {
  const [opened, setOpened] = useState(false)

  return (
    <Popover position="bottom-start" opened={opened} onChange={setOpened}>
      <Popover.Target>
        <ActionIcon
          size="sm"
          variant="filled"
          onClick={() => setOpened(true)}
          color={`${option.color?.name}.${option.color?.shade}`}
        >
          <IconCircleChevronDown size={14} />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown>
        <SimpleGrid cols={2}>
          {optionColorOrder.map((color) => (
            <UnstyledButton
              onClick={() => {
                onChange({ name: color, shade: option.color?.shade ?? OptionColor.defaultShade })
                setOpened(false)
              }}
            >
              <Option
                id={option.id ?? ''}
                name={option.name || 'a'}
                colorName={color}
                shade={option.color?.shade ?? OptionColor.defaultShade}
              />
            </UnstyledButton>
          ))}
        </SimpleGrid>
      </Popover.Dropdown>
    </Popover>
  )
}

interface IOptionControlProps {
  option: ICreateOptionSchema
  onNameChange: (name: string) => void
  onColorChange: OnColorChange
  onRemove: () => void
}

const OptionControl: React.FC<IOptionControlProps> = ({ option, onNameChange, onColorChange, onRemove }) => {
  const { listeners, attributes, setNodeRef, transform, transition } = useSortable({ id: option.id as string })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Grid align="center" grow ref={setNodeRef} style={style}>
      <Grid.Col span={1}>
        <ActionIcon {...listeners} {...attributes}>
          <IconGripVertical size={14} color="gray" />
        </ActionIcon>
      </Grid.Col>

      <Grid.Col span={9}>
        <Group>
          <OptionColorPicker onChange={onColorChange} option={option} />
          <FocusTrap>
            <TextInput
              variant="unstyled"
              value={option.name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="option name..."
            />
          </FocusTrap>
        </Group>
      </Grid.Col>

      <Grid.Col span={1}>
        <ActionIcon onClick={() => onRemove()}>
          <IconTrash size={14} color="gray" />
        </ActionIcon>
      </Grid.Col>
    </Grid>
  )
}

interface ISelectFieldControlProps {
  onChange: (options: ICreateOptionSchema[]) => void
}

export const SelectFieldControl: React.FC<ISelectFieldControlProps> = ({ onChange }) => {
  const [options, handlers] = useListState<ICreateOptionSchema>()
  useDeepCompareEffect(() => {
    onChange(options)
  }, [options])

  const items = options.map((o) => o.id as string)
  const [parent, enableAnimations] = useAutoAnimate({ duration: 200 })

  return (
    <Stack spacing={0}>
      <div ref={parent as any}>
        <DndContext
          collisionDetection={rectIntersection}
          modifiers={[restrictToVerticalAxis]}
          onDragStart={() => enableAnimations(false)}
          onDragEnd={(e) => {
            const { over, active } = e
            setTimeout(() => {
              enableAnimations(true)
            }, 0)
            if (over) {
              handlers.reorder({
                from: active.data.current?.sortable?.index,
                to: over?.data.current?.sortable?.index,
              })
            }
          }}
        >
          <SortableContext items={items}>
            {options.map((o, index) => (
              <OptionControl
                key={o.id}
                option={o}
                onNameChange={(name) => handlers.setItemProp(index, 'name', name)}
                onColorChange={(color) => handlers.setItemProp(index, 'color', color)}
                onRemove={() => handlers.remove(index)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      <Button
        leftIcon={<IconSelect size={14} />}
        size="xs"
        variant="subtle"
        onClick={() => {
          const length = options.length
          const color =
            length === 0
              ? OptionColor.defaultColor
              : OptionColor.create(options[length - 1]?.color)
                  .next()
                  .unpack()
          handlers.append({
            id: OptionId.create().value,
            name: '',
            color: {
              name: color.name,
              shade: color.shade,
            },
          })
        }}
      >
        Add new option
      </Button>
    </Stack>
  )
}
