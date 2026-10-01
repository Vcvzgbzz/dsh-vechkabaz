// web_search / web_fetch backends served by ai.vechkabaz.com/api/v1/{search,fetch}.
export const name = 'vechkabaz-web'
export const inject = ['web']

export const BASE = 'https://ai.vechkabaz.com/api/v1'
const KEY_REF = 'VECHKABAZ_API_KEY'
const UA = 'dsh-vechkabaz/0.2.1'

/** Authenticated JSON calls to the server; the key resolves through dsh's credential store per call. */
export function client(ctx) {
  const key = async () => {
    const creds = ctx.get('credentials')
    const value = creds ? (await creds.resolve(KEY_REF))?.value : process.env[KEY_REF]
    if (!value) throw new Error(`${KEY_REF} is not set — add it in Settings → Models → Vechkabaz`)
    return value
  }
  return async (path, { method = 'GET', body, headers, signal } = {}) => {
    const res = await fetch(BASE + path, {
      method,
      headers: {
        Authorization: `Bearer ${await key()}`, 'User-Agent': UA,
        ...body === undefined ? {} : { 'Content-Type': 'application/json' },
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
    const out = await res.json().catch(() => ({}))
    if (!res.ok) throw Object.assign(new Error(out?.error?.message ?? `vechkabaz ${path.split('?')[0]}: HTTP ${res.status}`), { status: res.status })
    return out
  }
}

export function apply(ctx) {
  const api = client(ctx)

  ctx.web.registerSearchProvider({
    id: 'vechkabaz',
    available: () => true,
    async search({ query }, signal) {
      const r = await api(`/search?q=${encodeURIComponent(query)}`, { signal })
      return { sources: r.results.map(h => ({ url: h.url, title: h.title, snippet: h.snippet })), truncated: false }
    },
  })

  ctx.web.registerFetchProvider({
    id: 'vechkabaz',
    available: () => true,
    async fetch({ url }, signal) {
      const r = await api(`/fetch?url=${encodeURIComponent(url)}`, { signal })
      return { url: r.final_url ?? url, statusCode: 200, body: { kind: 'text', content: r.text }, truncated: false }
    },
  })
}
