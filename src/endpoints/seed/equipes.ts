import type { Payload, PayloadRequest } from 'payload'
import path from 'path'
import fs from 'fs'

const EQUIPES = [
  {
    nom: 'GT Logistique',
    slug: 'gt-logistique',
    descriptionCourte: 'Gestion des travaux - ect',
    ordre: 1,
    iconFileName: 'inge.png',
    iconAlt: 'Icône GT Logistique',
  },
  {
    nom: 'GT Accueil',
    slug: 'gt-accueil',
    descriptionCourte: 'Accueil',
    ordre: 2,
    iconFileName: 'fonctionnement.png',
    iconAlt: 'Icône GT Accueil',
  },
  {
    nom: 'GT Bouffe',
    slug: 'gt-bouffe',
    descriptionCourte: 'Gestion de la nourriture et cuisine',
    ordre: 3,
    iconFileName: 'nourriture.png',
    iconAlt: 'Icône GT Bouffe',
  },
  {
    nom: 'GT Com',
    slug: 'gt-com',
    descriptionCourte: 'Communication (réseaux, site web)',
    ordre: 4,
    iconFileName: 'communication.png',
    iconAlt: 'Icône GT Com',
  },
  {
    nom: 'GT Habitant.e',
    slug: 'gt-habitant-e',
    descriptionCourte: 'Gestion des habitant.es',
    ordre: 5,
    iconFileName: 'residents.png',
    iconAlt: 'Icône GT Habitant.e',
  },
  {
    nom: 'GT Garderie',
    slug: 'gt-garderie',
    descriptionCourte: 'Gestion de la garderie et des enfants',
    ordre: 6,
    iconFileName: 'garderie.png',
    iconAlt: 'Icône GT Garderie',
  },
  {
    nom: 'GT Économie',
    slug: 'gt-economie',
    descriptionCourte: 'Gestion du budget et des finances',
    ordre: 7,
    iconFileName: 'economie.png',
    iconAlt: 'Icône GT Économie',
  },
  {
    nom: 'GT Activité',
    slug: 'gt-activite',
    descriptionCourte: 'Gestion des animations et activités',
    ordre: 8,
    iconFileName: 'activite.png',
    iconAlt: 'Icône GT Activité',
  },
  {
    nom: 'GT Sleeping',
    slug: 'gt-sleeping',
    descriptionCourte: 'Gestion des hébergements et couchages',
    ordre: 9,
    iconFileName: 'sleeping.png',
    iconAlt: 'Icône GT Sleeping',
  },
]

export async function seedEquipes(payload: Payload, req: PayloadRequest) {
  payload.logger.info('— Seeding équipes depuis les fichiers locaux...')

  for (const equipe of EQUIPES) {
    let mediaId: string | number | null = null
    const fileName = equipe.iconFileName

    try {
      // 1. VERIFICATION : Est-ce que ce fichier existe déjà ?
      const existingMedia = await payload.find({
        collection: 'media',
        where: {
          filename: {
            equals: fileName,
          },
        },
        limit: 1,
      })

      // 🔥 CORRECTION : Si le média existe, on le supprime pour pouvoir le recréer proprement
      if (existingMedia.docs.length > 0) {
        payload.logger.info(`L'icône ${fileName} existe déjà. Suppression de l'ancien pour override...`)
        await payload.delete({
          collection: 'media',
          id: existingMedia.docs[0].id,
        })
      }

      // 2. Chemin vers vos icônes locales
      const filePath = path.join(process.cwd(), 'public', 'icons', fileName)

      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath)

        // 3. UPLOAD : On crée le nouveau média (l'override est garanti car l'ancien est supprimé)
        const media = await payload.create({
          collection: 'media',
          data: { alt: equipe.iconAlt },
          file: {
            data: fileBuffer,
            name: fileName,
            size: fileBuffer.length,
            mimetype: 'image/png',
          },
          overwriteExistingFiles: true,
        })
        mediaId = media.id
      } else {
        payload.logger.error(`Fichier introuvable sur le disque : ${filePath}`)
      }
    } catch (error) {
      payload.logger.error(`Erreur média pour ${equipe.nom}:`)
    }

    // 4. Création de l'équipe
    await payload.create({
      collection: 'equipes',
      data: {
        nom: equipe.nom,
        slug: equipe.slug,
        descriptionCourte: equipe.descriptionCourte,
        ordre: equipe.ordre,
        ...(mediaId ? { image: mediaId } : {}),
      },
    })
  }
  payload.logger.info('✅ Seeding des équipes terminé avec succès !')
}