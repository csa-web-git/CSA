// src/collections/Soumissions.ts
import type { CollectionConfig } from 'payload'

export const Soumissions: CollectionConfig = {
  slug: 'soumissions',
  labels: { singular: 'Soumission', plural: 'Soumissions' },

  admin: {
    hidden: true,
    useAsTitle: 'type',
    defaultColumns: ['type', 'statut', 'createdAt'],
    description: 'Soumissions des formulaires du site, à valider ou refuser.',
  },

  // Mise à jour d'un besoin matériel lorsqu'on valide une soumission par l'API (depuis la page admin)
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        if (
          doc.type === 'ajout-activite' &&
          doc.statut === 'validee' &&
          previousDoc?.statut !== 'validee'
        ) {
          const don = doc.donnees
          
          const heureDebut = new Date(`${don.date}T${don.heureDebut}:00`)
          const heureFin = new Date(`${don.date}T${don.heureFin}:00`)

          await req.payload.create({
            collection: 'activites',
            data: {
              titre: don.titre,
              date: don.date,
              heureDebut: heureDebut.toISOString(),
              heureFin: heureFin.toISOString(),
              lieu: don.lieu,
              organisateurs: don.organisateurs,
              descriptionCourte: don.description,
              afficherActivitePonctuelle: true,
              image: don.image ?? null
            },
          })
        }},
      async ({ doc, previousDoc, req }) => { // Si on confirme qu'un besoin est validé => On valide le besoin
        if (
          doc.type === 'confirmation-besoin' &&
          doc.statut === 'validee' &&
          previousDoc?.statut !== 'validee'
        ) {
          const besoinId = doc.donnees?.besoinId
          if (besoinId) {
            await req.payload.update({
              collection: 'besoins-materiels',
              id: besoinId,
              data: { fait: true },
            })
          }
        }
      },
      async ({ doc, previousDoc, req}) => { // Si on confirme une requête de besoin => On crée le besoin
        if (
          doc.type === 'ajout-besoin' &&
          doc.statut === 'validee' &&
          previousDoc?.statut !== 'validee'
        ) {
          await req.payload.create({
            collection: 'besoins-materiels',
            data: {
              titre: doc.donnees?.titre,
              description: doc.donnees?.description ?? '',
              fait: false,
            },
          })
        }
      }
    ],
  },

  access: {
    read: ({ req }) => Boolean(req.user), // visible uniquement aux admins connectés
    create: () => true, // les formulaires publics peuvent créer une soumission
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },

  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Réserver une salle',       value: 'reservation-salle' },
        { label: 'Passer une nuit',          value: 'passer-nuit' },
        { label: 'Ajout besoin matériel',    value: 'ajout-besoin' },
        { label: 'Confirmation besoin',      value: 'confirmation-besoin' },
        { label: 'Ajouter une activité',     value: 'ajout-activite'},
        { label: 'Faire une suggestion',     value: 'suggestion-site'}
      ],
    },
    {
      name: 'statut',
      type: 'select',
      required: true,
      defaultValue: 'en-attente',
      options: [
        { label: 'En attente', value: 'en-attente' },
        { label: 'Validée',    value: 'validee'    },
        { label: 'Refusée',    value: 'refusee'     },
      ],
    },
    {
      name: 'donnees',
      type: 'json',
      label: 'Données du formulaire',
      admin: {
        description: 'Contenu brut soumis par le formulaire.',
      },
    },
  ],
}