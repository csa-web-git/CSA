import type { CollectionConfig } from 'payload'

export const BanderoleSlides: CollectionConfig = {
  slug: 'banderole-slides',
  labels: { singular: 'Slide Banderole', plural: 'Banderole Slides' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'ordre', 'activite'],
    description: 'Visuels affichés dans la banderole latérale de la page d\'accueil.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
        name: 'title',
        type: 'text',
        required: true
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'Visuel vertical recommandé (ratio portrait 2:3 idéal).' },
    },
    {
      name: 'activite',
      type: 'relationship',
      relationTo: 'activites',
      required: false,
      admin: {
        description: 'Optionnel — si renseigné, le clic amène à la page de cette activité.',
      },
    },
    {
      name: 'ordre',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Tri ascendant.',
      },
    },
  ],
}