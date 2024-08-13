'use server'

import { headers } from 'next/headers'
import { UAParser } from 'ua-parser-js'

const toMatch = [
  /Android/i,
  /webOS/i,
  /iPhone/i,
  /iPad/i,
  /iPod/i,
  /BlackBerry/i,
  /Windows Phone/i
];

export const isMobileDevice = () => {
  if (typeof process === 'undefined') {
    throw new Error('[Server method] you are importing a server-only module outside of server')
  }

  const { get } = headers()
  const ua = get('user-agent')

  const device =new UAParser(ua || '').getUA()

  return toMatch.some((toMatchItem) => {
    return device.match(toMatchItem);
  });
}
