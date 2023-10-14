import { load } from 'cheerio'
import { RomatsaNotam } from '../../types'

export const extractNotamFromHtml = (html: string): RomatsaNotam[] => {
  const $ = load(html)
  const notams: RomatsaNotam[] = []

  $('div#content table TR').each((index, element) => {
    if (index > 0) {
      $(element).find('TD').eq(2).find('br').replaceWith('\n')
      const notam = {
        number: $(element).find('TD').eq(0).text().trim(),
        icao: $(element).find('TD').eq(1).text().trim(),
        notam: $(element).find('TD').eq(2).text().trim(),
      } as RomatsaNotam

      notams.push(notam)
    }
  })

  return notams
}
