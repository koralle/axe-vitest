import { plugins } from 'pretty-format'
import type { AxeMatchers } from '../src'

import { toHaveNoViolations } from '../src'

expect.extend({ toHaveNoViolations })

declare module 'vitest' {
  interface Assertion extends AxeMatchers {}
}

expect.addSnapshotSerializer(plugins.ConvertAnsi as any)

HTMLCanvasElement.prototype.getContext = vi.fn(() => null)
