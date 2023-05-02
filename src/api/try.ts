import axios from 'axios'

export function gatewayStartService(
  gateway: string,
  gid: number,
  sid: number,
  type: string,
  cfg_addrs: string | undefined,
  shared_addrs: string | undefined,
): any {
  return axios.put(`${gateway}/start`, {}, {
    headers: {
      gid,
      sid,
      stype: type,
      cfg_addrs,
      shared_addrs,
    },
  })
}

export function gatewayStopService(gateway: string, type: string, gid: number, sid: number): any {
  return axios.put(`${gateway}/stop`, {}, {
    headers: {
      sid,
      gid,
      stype: type,
    },
  })
}

export function gatewayDisconnect(gateway: string): any {
  return axios.put(`${gateway}/close`)
}

export function setGroup(gateway: string, gid: number, shared_addrs: string): any {
  return axios.put(`${gateway}/config/join`, {}, {
    headers: {
      gid,
      shared_addrs,
    },
  })
}

export function updateBucket(gateway: string, gid: number, bucket_range: string): any {
  return axios.put(`${gateway}/config/move`, {}, {
    headers: {
      gid,
      buckets: bucket_range,
    },
  })
}

export function putKv(gateway: string, key: string, value: string): any {
  return axios.put(`${gateway}/apis/put`, {}, {
    headers: {
      key,
      value,
    },
  })
}

export function getKv(gateway: string, key: string): any {
  return axios.get(`${gateway}/apis/get`, {
    headers: {
      key,
    },
  })
}

export function queryBuckets(gateway: string, gid: number, blist: string): any {
  return axios.get(`${gateway}/apis/query`, {
    headers: {
      gid,
      blist,
    },
  })
}
