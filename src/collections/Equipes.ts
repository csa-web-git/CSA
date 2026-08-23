import type { CollectionConfig } from 'payload'

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

export const Equipes: CollectionConfig = {
  slug: 'equipes',
  admin: {
    hidden: true,
    useAsTitle: 'nom',
    defaultColumns: ['nom', 'referent', 'ordre'],
    description: 'Équipes / groupes du centre social.',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'nom', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
      hooks: {
        beforeValidate: [
          ({ value, data }) => value || (data?.nom ? slugify(String(data.nom)) : value),
        ],
      },
    },
    { name: 'descriptionCourte', type: 'textarea' },
    { name: 'description', type: 'richText' },
    { name: 'referent', type: 'text', admin: { description: 'Pseudo Signal ou contact.' } },
    { name: 'email', type: 'email', required: false },
    { name: 'membres', type: 'number', defaultValue: 0 },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'ordre',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Tri ascendant sur la page Équipes.' },
    },
  ],
}
