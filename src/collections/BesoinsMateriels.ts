// src/collections/BesoinsMateriels.ts
import type { CollectionConfig } from 'payload'

export const BesoinsMateriels: CollectionConfig = {
  slug: 'besoins-materiels',
  labels: { singular: 'Besoin matériel', plural: 'Besoins matériels' },

  admin: {
    useAsTitle: 'titre',
    defaultColumns: ['titre', 'fait'],
  },

  access: {
    read: () => true,
  },

  fields: [
    {
      name: 'titre',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'fait',
      type: 'checkbox',
      label: 'Besoin comblé',
      defaultValue: false,
    },
    {
      name: 'afficher',
      type: 'checkbox',
      label: 'Afficher sur le site',
      defaultValue: true,
    },
  ],
}