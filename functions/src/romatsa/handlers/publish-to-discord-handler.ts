import { logger } from 'firebase-functions/v2'
import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import { NOTAM_COLLECTION, discordConfig } from '../config'
import { EmbedBuilder, WebhookClient } from 'discord.js'
import { FirestoreDecodedNotam } from '../types'

const handler = onDocumentCreated(`${NOTAM_COLLECTION}/{documentId}`, async (event) => {
  const original = event.data?.data() as FirestoreDecodedNotam
  logger.info('got new event', { event, data: event.data?.data(), original })
  if (original.title !== 'Movement and landing areas Runway Closed') {
    return
  }
  const webhookClient = new WebhookClient({ ...discordConfig })

  const fields = [
    { name: 'Airport', value: original.fir },
    { name: 'Description', value: original.text },
    { name: 'Notam', value: original.notam.code },
    { name: 'Start Date', value: original.duration.dateBegin.toDate().toISOString() },
  ]
  if (original.duration.dateEnd) {
    fields.push({
      name: 'End Date',
      value: `${original.duration.dateEnd.toDate().toISOString()} ${original.duration.estimated ? 'EST' : ''}`,
    })
  }

  const embed = new EmbedBuilder()
    .setTitle(original.title.toUpperCase())
    .setColor(0x00ffff)
    .setFields(fields)
    .setDescription(original.raw)

  logger.info('embed', { embed })

  const response = await webhookClient.send({
    content: 'The following new NOTAM has been published by ROMATSA',
    username: 'Notam Updater',
    avatarURL: 'https://cdn.discordapp.com/app-icons/698959965599170640/c3933a7a062bf8a4fe833f236190bcce.png',
    embeds: [embed],
  })
  logger.info('publish to discord', { response })
})

export default handler
