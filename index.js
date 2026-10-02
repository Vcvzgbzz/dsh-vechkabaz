// Core: the server client, plus hiding the tools of any feature whose switch is off.
// Each feature is its own row (web/, memory/, subagents/) with its own switch on the Plugins page.
export const name = 'vechkabaz'

export const BASE = 'https://ai.vechkabaz.com/api/v1'
const KEY_REF = 'VECHKABAZ_API_KEY'
const UA = 'dsh-vechkabaz/0.3.0'

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

/** Features whose rows are mounted right now; a switched-off row runs no code, so the core hides its tools. */
export const features = new Set()

/** Mark a feature on for as long as its row is mounted. */
export function feature(ctx, id) {
  features.add(id)
  ctx.effect(() => () => features.delete(id))
}

const TOOLS = {
  web: ['web_search', 'web_fetch'],
  subagents: ['subagent', 'subagent_fork', 'list_agents', 'send_message', 'interrupt_agent', 'subagent_codex', 'subagent_claude_code'],
}

const offTools = () => new Set(Object.entries(TOOLS).flatMap(([id, names]) => features.has(id) ? [] : names))

export const inject = ['tools']

export function apply(ctx) {
  // Hidden from the model at each prompt assembly: this reaches tools a session registers for
  // itself (the web app's `subagent`), which tools.restrict() cannot.
  ctx.on('system-prompt/assemble', async (_assembly, _context, next) => {
    const assembled = await next()
    const off = offTools()
    return off.size ? { ...assembled, tools: assembled.tools.filter(t => !off.has(t.name)) } : assembled
  })
  // Backstop for a call to a hidden tool.
  ctx.tools.guard(exec => offTools().has(exec.name)
    ? `${exec.name} is switched off (Plugins → dsh-vechkabaz).`
    : undefined)
}
