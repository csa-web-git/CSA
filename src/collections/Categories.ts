import type { CollectionConfig } from 'payload'
import { colorPickerField } from '@/fields/ColorPicker'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'nom',
    defaultColumns: ['nom', 'couleur'],
    description: "Catégories d'activités (artistique, organisation, technique…) avec leur couleur.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'nom',
      type: 'text',
      required: true,
      unique: true,
    },
    colorPickerField,
  ],
}
