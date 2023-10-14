import { DecodedNotam } from '@rovacc/notam-decoder'
import { Timestamp } from 'firebase-admin/firestore'

export type RomatsaNotam = {
  icao: string
  number: string
  notam: string
}

export type RomatsaNotamUpdatedEvent = {
  name: 'notam-updated'
  payload: RomatsaNotam
}

export type FirestoreDecodedNotam = Omit<DecodedNotam, 'duration'> & {
  duration: Omit<DecodedNotam['duration'], 'dateBegin' | 'dateEnd'> & {
    dateBegin: Timestamp
    dateEnd?: Timestamp
  }
}
