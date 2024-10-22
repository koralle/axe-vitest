import type { AxeCore } from './core'
import { LINE_BREAK, HORIZONTAL_LINE } from './consts'
import { printReceived } from './utils'
import { gray, blue, yellow } from 'picocolors'
import dedent from 'dedent'

const violationResolveHelpText = (violation: Pick<AxeCore.Result, 'helpUrl'>) => {
  return dedent`
    You can find more information on this issue here:${' '}
    ${blue(violation.helpUrl)}
  `
}

const expectedText = (node: AxeCore.NodeResult) => {
  const selector = node.target.join(', ')
  return `Expected the HTML found at $('${selector}') to have no violations:`
}

const violationErrorReport = ({ violation, node }: { violation: AxeCore.Result; node: AxeCore.NodeResult }) => {
  return dedent`
    ${expectedText(node)}

    ${gray(node.html)}

    Received:

    ${printReceived(`${violation.help} (${violation.id})`)}

    ${node.failureSummary
      ?.split('\n')
      .map((line) => yellow(line))
      .join('\n')}

    ${violation.helpUrl ? violationResolveHelpText(violation) : ''}
  `
}

const reporter = (violations: AxeCore.Result[]) => {
  if (violations.length === 0) {
    return []
  }

  const delimiter = LINE_BREAK + HORIZONTAL_LINE + LINE_BREAK

  return violations
    .map((violation) => {
      const errorBody = violation.nodes.map((node) => violationErrorReport({ violation, node })).join(LINE_BREAK)

      return errorBody
    })
    .join(delimiter)
}

export { reporter }
