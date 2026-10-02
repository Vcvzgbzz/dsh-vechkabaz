// Subagents are dsh's own; this row only exists so its switch can turn them off.
import { feature } from '../index.js'

export const name = 'vechkabaz-subagents'

export function apply(ctx) {
  feature(ctx, 'subagents')
}
