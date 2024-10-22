import type { OptionsReceived } from '@vitest/pretty-format'
import { format as prettyFormat, plugins as prettyFormatPlugins } from '@vitest/pretty-format'
import { DIM_COLOR, EXPECTED_COLOR, MAX_RESULT_LENGTH, RECEIVED_COLOR, SPACE_SYMBOL } from './consts'

const { AsymmetricMatcher, DOMCollection, DOMElement, Immutable, ReactElement, ReactTestComponent } = prettyFormatPlugins

const PLUGINS = [ReactTestComponent, ReactElement, DOMElement, DOMCollection, Immutable, AsymmetricMatcher]

type MatcherHintColor = (arg: string) => string // subset of Chalk type

export type MatcherHintOptions = {
  comment?: string
  expectedColor?: MatcherHintColor
  isDirectExpectCall?: boolean
  isNot?: boolean
  promise?: string
  receivedColor?: MatcherHintColor
  secondArgument?: string
  secondArgumentColor?: MatcherHintColor
}

const stringify = (object: unknown, maxDepth = 10, maxWidth = 10): string => {
  const formatOptions = {
    maxDepth,
    maxWidth,
    min: true,
    plugins: PLUGINS
  } as const satisfies OptionsReceived

  const tryFormat = (options: object): string => {
    try {
      return prettyFormat(object, options)
    } catch {
      return prettyFormat(object, { ...options, callToJSON: false })
    }
  }

  const result = tryFormat(formatOptions)

  if (result.length >= MAX_RESULT_LENGTH) {
    if (maxDepth > 1) {
      return stringify(object, Math.floor(maxDepth / 2), maxWidth)
    }
    if (maxWidth > 1) {
      return stringify(object, maxDepth, Math.floor(maxWidth / 2))
    }
  }

  return result
}

/**
 * Instead of inverse highlight which now implies a change, replace common spaces with middle dot at the end of any line.
 * @param text
 */
const replaceTrailingSpaces = (text: string): string => {
  return text.replace(/\s+$/gm, (spaces) => SPACE_SYMBOL.repeat(spaces.length))
}

export const printReceived = (object: unknown): string => {
  return RECEIVED_COLOR(replaceTrailingSpaces(stringify(object)))
}

export const printExpected = (value: unknown): string => {
  return EXPECTED_COLOR(replaceTrailingSpaces(stringify(value)))
}

// Display assertion for the report when a test fails.
// New format: rejects/resolves, not, and matcher name have black color
// Old format: matcher name has dim color
export const matcherHint = (
  matcherName: string,
  received = 'received',
  expected = 'expected',
  options: MatcherHintOptions = {}
): string => {
  const {
    comment = '',
    expectedColor = EXPECTED_COLOR,
    isDirectExpectCall = false, // seems redundant with received === ''
    isNot = false,
    promise = '',
    receivedColor = RECEIVED_COLOR,
    secondArgument = '',
    secondArgumentColor = EXPECTED_COLOR
  } = options
  const hintParts: string[] = []
  let dimString = 'expect' // 連続するdim部分文字列を連結

  if (!isDirectExpectCall && received !== '') {
    hintParts.push(DIM_COLOR(`${dimString}(`) + receivedColor(received))
    dimString = ')'
  }

  if (promise !== '') {
    hintParts.push(DIM_COLOR(`${dimString}.`) + promise)
    dimString = ''
  }

  if (isNot) {
    hintParts.push(`${DIM_COLOR(`${dimString}.`)}not`)
    dimString = ''
  }

  if (matcherName.includes('.')) {
    // 古いフォーマット: 後方互換性のため、
    // 特にpromiseやisNotオプションがない場合に対応
    dimString += matcherName
  } else {
    // 新しいフォーマット: matcherName引数からピリオドを省略
    hintParts.push(DIM_COLOR(`${dimString}.`) + matcherName)
    dimString = ''
  }

  if (expected === '') {
    dimString += '()'
  } else {
    let expectedPart = DIM_COLOR(`${dimString}(`) + expectedColor(expected)
    if (secondArgument) {
      expectedPart += DIM_COLOR(', ') + secondArgumentColor(secondArgument)
    }
    hintParts.push(expectedPart)
    dimString = ')'
  }

  if (comment !== '') {
    dimString += ` // ${comment}`
  }

  if (dimString !== '') {
    hintParts.push(DIM_COLOR(dimString))
  }

  return hintParts.join('')
}

/**
 * Checks that the HTML parameter provided is a string that contains HTML.
 * @param html a HTML element or a HTML string
 */
export const isHTMLString = (html: unknown): html is string => {
  return typeof html === 'string' && /(<([^>]+)>)/i.test(html)
}

/**
 * Checks if the HTML parameter provided is a HTML element.
 * @param html a HTML element or a HTML string
 */
export const isHTMLElement = (html: unknown): html is HTMLElement => {
  return html instanceof HTMLElement
}
