import type { CollectionConfig } from 'payload'

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

export const Communiques: CollectionConfig = {
  slug: 'communiques',
  labels: { singular: 'Communiqué', plural: 'Communiqués' },
  admin: {
    useAsTitle: 'titre',
    defaultColumns: ['titre', 'type', 'datePublication'],
    description: "Documents internes et liens externes publiés au fil de l'avancement du CSA.",
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
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'document',
      options: [
        { label: 'Document (PDF)', value: 'document' },
        { label: 'Lien externe', value: 'lien-externe' },
      ],
    },
    {
      name: 'document',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) => data?.type === 'document',
        description: 'PDF affiché en ligne sur la page de détail.',
      },
      validate: (value: any, { siblingData }: any) => {
        if (siblingData?.type === 'document' && !value) {
          return 'Un document PDF est requis pour ce type.'
        }
        return true
      },
    },
    {
      name: 'lienExterne',
      type: 'text',
      admin: {
        condition: (data) => data?.type === 'lien-externe',
        description: 'URL complète (https://...).',
      },
      validate: (value: any, { siblingData }: any) => {
        if (siblingData?.type === 'lien-externe' && !value) {
          return 'Une URL est requise pour ce type.'
        }
        return true
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