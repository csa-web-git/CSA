import { getPayload } from 'payload'
import config from '@payload-config'
import { seed } from '../endpoints/seed'

const run = async () => {
  const payload = await getPayload({ config })

  const users = await payload.find({
    collection: 'users',
    limit: 1,
  })

  if (users.totalDocs === 0) {
    payload.logger.info('DB vide, lancement du seed...')
    await seed({ payload, req: {} as any })
  } else {
    payload.logger.info('DB déjà peuplée, seed ignoré.')
  }

  process.exit(0)
}

run()
