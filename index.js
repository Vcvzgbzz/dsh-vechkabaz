// web_search / web_fetch backends served by ai.vechkabaz.com/api/v1/{search,fetch}.
export const name = 'vechkabaz-web'
export const inject = ['web']

const BASE = 'https://ai.vechkabaz.com/api/v1'
const KEY_REF = 'VECHKABAZ_API_KEY'
const UA = 'dsh-vechkabaz/0.1.0'

export function apply(ctx) {
  const key = async () => {
    const creds = ctx.get('credentials')
    const value = creds ? (await creds.resolve(KEY_REF))?.value : process.env[KEY_REF]
    if (!value) throw new Error(`${KEY_REF} is not set — add it in Settings or export it`)
    return value
  }
  const api = async (path, signal) => {
    const res = await fetch(BASE + path, {
      headers: { Authorization: `Bearer ${await key()}`, 'User-Agent': UA },
      signal,
    })
    if (!res.ok) throw new Error(`vechkabaz ${path.split('?')[0]}: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`)
    return res.json()
  }

  ctx.web.registerSearchProvider({
    id: 'vechkabaz',
    available: () => true,
    async search({ query }, signal) {
      const r = await api(`/search?q=${encodeURIComponent(query)}`, signal)
      return { sources: r.results.map(h => ({ url: h.url, title: h.title, snippet: h.snippet })), truncated: false }
    },
  })

  ctx.web.registerFetchProvider({
    id: 'vechkabaz',
    available: () => true,
    async fetch({ url }, signal) {
      const r = await api(`/fetch?url=${encodeURIComponent(url)}`, signal)
      return { url: r.final_url ?? url, statusCode: 200, body: { kind: 'text', content: r.text }, truncated: false }
    },
  })
}
