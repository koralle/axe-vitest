import prettyAnsi from 'pretty-ansi'
import type { AxeMatchers } from '../src'
import type { Config, Refs, Printer } from '@vitest/pretty-format'

import { toHaveNoViolations } from '../src'

expect.extend({ toHaveNoViolations })

declare module 'vitest' {
  interface Assertion extends AxeMatchers {}
}

const ansiEscapeSerializer = {
  serialize(text: string, config: Config, indentation: string, depth: number, refs: Refs, printer: Printer) {
    return printer(prettyAnsi(text), config, indentation, depth, refs)
  },
  test(val: unknown) {
    return typeof val === 'string' && val.includes('\u001b')
  }
}

expect.addSnapshotSerializer(ansiEscapeSerializer)

HTMLCanvasElement.prototype.getContext = vi.fn(() => null)
