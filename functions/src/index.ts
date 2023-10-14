import { setGlobalOptions } from 'firebase-functions/v2'
import { initializeApp } from 'firebase-admin/app'
import { firestore } from 'firebase-admin'

initializeApp()

const db = firestore()
db.settings({ ignoreUndefinedProperties: true })

setGlobalOptions({ region: 'europe-west3' })
export * from './romatsa'
