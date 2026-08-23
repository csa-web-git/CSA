import type { CollectionConfig } from 'payload'

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

export const Kiosk: CollectionConfig = {
  slug: 'kiosk',
  labels: { singular: 'Document Kiosk', plural: 'Kiosk' },
  admin: {
    useAsTitle: 'titre',
    defaultColumns: ['titre', 'datePublication'],
    description: 'Documents PDF publiés sur la page Kiosk.',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'titre', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
      hooks: {
        beforeValidate: [
          ({ value, data }) => value || (data?.titre ? slugify(String(data.titre)) : value),
        ],
      },
    },
    { name: 'descriptionCourte', type: 'textarea', required: true },
    {
      name: 'document',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'PDF affiché en ligne sur la page de détail.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: { description: 'Optionnel — une icône générée est utilisée si absente.' },
    },
    {
      name: 'datePublication',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        description: 'Utilisée pour le tri (plus récent en premier).',
      },
    },
  ],
}