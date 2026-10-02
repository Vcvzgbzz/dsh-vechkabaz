// web_search / web_fetch backends served by ai.vechkabaz.com/api/v1/{search,fetch}.
import { client, feature } from '../index.js'

export const name = 'vechkabaz-web'
export const inject = ['web']

export function apply(ctx) {
  feature(ctx, 'web')
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
