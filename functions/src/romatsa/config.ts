import { defineString } from 'firebase-functions/params'

export const ENVIRONMENT = defineString('ROVACC_ENVIRONMENT', { default: 'staging' })

export const ROMATSA_NOTAM_TOPIC = 'romatsa-notam-update-production'

export const NOTAM_COLLECTION = 'notams'

export const discordConfig = {
  id: process.env.NOTAM_DISCORD_WEBHOOK_ID as string,
  token: process.env.NOTAM_DISCORD_WEBHOOK_TOKEN as string,
}
