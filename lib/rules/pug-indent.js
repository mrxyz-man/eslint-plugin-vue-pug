/**
 * @fileoverview enforce consistent indentation in <template lang="pug">
 * @author Your Name
 */
'use strict'

const { processRule, parsePugContent } = require('../utils/pug-utils')

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce consistent indentation in <template lang="pug">',
      category: 'strongly-recommended',
      url: 'https://eslint-plugin-vue-pug.rash.codes/rules/pug-indent.html'
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          baseIndent: {
            type: 'integer',
            minimum: 0
          }
        },
        additionalProperties: false
      }
    ]
  },
  create(context) {
    const options = context.options[0] || {}
    const baseIndent = options.baseIndent || 0

    function checkIndentation(token, expectedIndent) {
      const { line, column } = token.loc.start
      const actualIndent = column

      if (actualIndent !== expectedIndent) {
        context.report({
          loc: { line, column: 0 },
          message: `Expected indentation of ${expectedIndent} spaces but found ${actualIndent}.`,
          fix(fixer) {
            const lineStartIndex = token.range[0] - actualIndent
            return fixer.replaceTextRange(
              [lineStartIndex, token.range[0]],
              ' '.repeat(expectedIndent)
            )
          }
        })
      }
    }

    return processRule(context, () => {
      const { tokens } = parsePugContent(context)
      const indentStack = [baseIndent * 2]

      return {
        '*'(token, { index }) {
          const tokenType = token.type

          if (
            [
              'tag',
              'dot',
              'interpolation',
              'code',
              'blockcode',
              'if',
              'else',
              'each',
              'case',
              'when'
            ].includes(tokenType)
          ) {
            const expectedIndent = indentStack[indentStack.length - 1]
            checkIndentation(token, expectedIndent)

            const nextToken = tokens[index + 1]
            if (nextToken && nextToken.type === 'indent') {
              indentStack.push(expectedIndent + 2)
            }
          } else if (tokenType === 'outdent') {
            indentStack.pop()
          } else if (
            tokenType === 'comment' ||
            tokenType === 'unbuffered_code'
          ) {
            const expectedIndent = indentStack[indentStack.length - 1]
            checkIndentation(token, expectedIndent)
          }
        }
      }
    })
  }
}
