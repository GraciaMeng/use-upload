import { BASE_URL, request } from "./request";

export function mergeFile(options: { filename: string; hash: string | number }) {
  return request(`${BASE_URL}/merge`, 'post', options)
}
