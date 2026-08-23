import type { CollectionConfig } from 'payload'

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

export const ActivitesRecurrentes: CollectionConfig = {
  slug: 'activites-recurrentes',

  admin: {
    useAsTitle: 'titre',
  },

  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.titre) {
          data.slug = slugify(data.titre)
        }

        return data
      },
    ],
  },

  fields: [
    {
      name: 'titre',
      type: 'text',
      required: true,
    },

    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        hidden: true,
        readOnly: true,
      },
    },

    {
      name: 'miniAffiche',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'descriptionCourte',
      type: 'textarea',
    },

    {
      name: 'descriptionLongue',
      type: 'textarea',
    },

    {
      name: 'activitePlanning',
      type: 'relationship',
      relationTo: 'activites',
      required: false,
      admin: {
        hidden: true
      }
    },
  ],
}