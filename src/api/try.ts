import axios from 'axios'

export function gatewayStartServer(gateway: string, sid: number, type: string, cfg_addrs: string | undefined): any {
  return axios.put(`${gateway}/start`, {}, {
    headers: {
      sid,
      stype: type,
      cfg_addrs,
    },
  })
}

export function gatewayStopServer(gateway: string, sid: number, type: string): any {
  return axios.put(`${gateway}/stop`, {}, {
    headers: {
      sid,
      stype: type,
    },
  })
}

export function gatewayDisconnect(gateway: string): any {
  return axios.put(`${gateway}/close`)
}
