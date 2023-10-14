import { onSchedule } from 'firebase-functions/v2/scheduler'
import { PubSub } from '@google-cloud/pubsub'
import { logger } from 'firebase-functions'
import { extractNotamFromHtml } from '../services/romatsa/extract-notam-from-html'
import { Agent } from 'https'
import { constants } from 'node:crypto'
import axios from 'axios'
import { ROMATSA_NOTAM_TOPIC } from '../config'

const handler = onSchedule('every 1 hours', async () => {
  logger.info('Checking for updated NOTAMs')

  const httpsAgent = new Agent({
    rejectUnauthorized: false,
    secureOptions: constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION,
  })

  const response = await axios.get<string>('https://flightplan.romatsa.ro/init/notam/getnotamlist?ad=LR', {
    httpsAgent,
  })
  const text = response.data

  const notams = extractNotamFromHtml(text)

  const pubSubClient = new PubSub()
  for (const notam of notams) {
    try {
      const data = Buffer.from(JSON.stringify(notam))
      await pubSubClient.topic(ROMATSA_NOTAM_TOPIC).publishMessage({ data })
    } catch (error) {
      logger.error('Cound not publish notam to the queue', { notam, error })
    }
  }
})

export default handler
