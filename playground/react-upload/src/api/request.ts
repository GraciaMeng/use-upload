export const BASE_URL = '/api'

export function request<T = any>(
  url: string,
  method: 'post' | 'get',
  data = {},
  headers: HeadersInit = {},
): Promise<T> {
  return fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    }
  }).then(res => res.json())
}
