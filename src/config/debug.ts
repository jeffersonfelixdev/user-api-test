import { debuglog } from 'util'

export const logInfo = async (message: string) => {
  debuglog('server:info')(message)
}

export const logWarn = async (message: string) => {
  debuglog('server:warn')(message)
}

export const logError = async (message: string) => {
  debuglog('server:error')(message)
}
