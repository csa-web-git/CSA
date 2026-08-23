import type { CollectionConfig } from 'payload'

export const Taches: CollectionConfig = {
  slug: 'taches',
  labels: { singular: 'Tâche', plural: 'Tâches' },

  admin: {
    hidden: true,
    useAsTitle: 'titre',
    defaultColumns: ['titre', 'statut', 'equipe'],
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
      name: 'statut',
      type: 'select',
      required: true,
      defaultValue: 'a-faire',
      options: [
        { label: 'À faire',   value: 'a-faire'  },
        { label: 'En cours',  value: 'en-cours'  },
        { label: 'Terminé',   value: 'termine'   },
        { label: 'Bloqué',    value: 'bloque'    },
      ],
    },
    {
      name: 'raisonBlocage',
      type: 'textarea',
      label: 'Raison du blocage',
      admin: {
        condition: (_, siblingData) => siblingData.statut === 'bloque',
      },
    },
    {
      name: 'equipe',
      type: 'relationship',
      relationTo: 'equipes',
      required: true,
    },
  ],
}