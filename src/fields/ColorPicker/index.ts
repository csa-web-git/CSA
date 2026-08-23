import type { TextField } from 'payload'

export const colorPickerField = {
  name: 'couleur',
  type: 'text',
  label: 'Couleur',
  required: true,
  defaultValue: '#cccccc',
  admin: {
    components: {
      Field: '@/fields/ColorPicker/Field.client#ColorPickerField',
    },
  },
  validate: (val: string | null | undefined) => {
    if (typeof val !== 'string') return 'Couleur requise'
    if (!/^#[0-9a-fA-F]{6}$/.test(val)) return 'Format hex attendu (#RRGGBB)'
    return true
  },
} satisfies TextField
