import chalk from 'chalk'
import type { AxeCore } from './core'
import { LINE_BREAK, HORIZONTAL_LINE } from './consts'
import { printReceived } from './utils'
import dedent from 'dedent'
import { gray, blue } from 'picocolors'

const violationResolveHelpText = (violation: Pick<AxeCore.Result, 'helpUrl'>) => {
  return `You can find more information on this issue here: \n${blue(violation.helpUrl)}`
}

const expectedText = (node: AxeCore.NodeResult) => {
  const selector = node.target.join(', ')
  return `Expected the HTML found at $('${selector}') to have no violations:${LINE_BREAK}`
}

const violationErrorReport = ({ violation, node }: { violation: AxeCore.Result; node: AxeCore.NodeResult }) => {
  return dedent`
  ${expectedText(node) + gray(node.html)}

  Received:

  ${printReceived(`${violation.help} (${violation.id})`)}

  ${chalk.yellow(node.failureSummary)}

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
