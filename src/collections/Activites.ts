import type { CollectionConfig } from 'payload'

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

export const Activites: CollectionConfig = {
  slug: 'activites',
  admin: {
    useAsTitle: 'titre',
    defaultColumns: ['titre', 'date', 'heureDebut', 'heureFin', 'categorie'],
    description: 'Activités planifiées du centre social.',
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
          ({ value, data }) =>
            value || (data?.titre ? slugify(String(data.titre + data.date)) : value),
        ],
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } },
    },
    {
      name: 'heureDebut',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: 'timeOnly', displayFormat: 'HH:mm' } },
    },
    {
      name: 'heureFin',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: 'timeOnly', displayFormat: 'HH:mm' } },
    },
    {
      name: 'lieu',
      type: 'text',
      required: true,
      admin: { description: 'Texte libre (ex. "Salle principale", "Cours arrière").' },
    },
    {
      name: 'organisateurs',
      type: 'text',
      admin: { description: 'Pseudo Signal ou email de contact.' },
    },
    {
      name: 'descriptionCourte',
      type: 'textarea',
      admin: { description: 'Affichée dans la bulle du planning.' },
    },
    { name: 'descriptionLongue', type: 'richText' },
    {
      name: 'categorie',
      type: 'relationship',
      relationTo: 'categories',
      required: false,
      hasMany: false,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'activiteRecurrente',
      type: 'relationship',
      relationTo: 'activites-recurrentes',
      admin: { description: 'Est-ce que cette activité est récurrente, si oui encoder laquelle..' },
      required: false,
      hasMany: false,
    },
    {
      name: 'afficherActivitePonctuelle',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      admin: {
        description:
          'Permet d afficher sur la page activite en plus de la page programme. Permet un petit coup de pub supplémentaire',
        condition: (data, siblingData) => {
          // On affiche la checkbox UNIQUEMENT si activiteRecurrente est vide/null
          return !siblingData?.activiteRecurrente
        },
      },
    },
  ],
}
