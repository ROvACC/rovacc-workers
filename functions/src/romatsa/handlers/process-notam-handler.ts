import { MessagePublishedData, onMessagePublished } from 'firebase-functions/v2/pubsub'
import { NOTAM_COLLECTION, ROMATSA_NOTAM_TOPIC } from '../config'
import { CloudEvent } from 'firebase-functions/v2'
import { RomatsaNotam } from '../types'
import { getFirestore } from 'firebase-admin/firestore'
import { decode } from '@rovacc/notam-decoder'

const handler = onMessagePublished(
  ROMATSA_NOTAM_TOPIC,
  async (event: CloudEvent<MessagePublishedData<RomatsaNotam>>) => {
    const data = event.data.message.json

    const db = getFirestore()
    const notamCollection = db.collection(NOTAM_COLLECTION)
    const notamSnapshot = await notamCollection.where('number', '==', data.number).get()
    if (notamSnapshot.empty) {
      const decoded = decode(data.notam)
      await notamCollection.add({ number: data.number, ...decoded })
    }
  },
)

export default handler
