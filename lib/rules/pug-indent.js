/**
 * @fileoverview enforce consistent indentation in <template lang="pug">
 * @author [Your Name]
 */
'use strict'

const { parsePugTemplate } = require('../utils/pug-utils')

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce consistent indentation in <template lang="pug">',
      category: 'strongly-recommended',
      url: 'https://eslint.vuejs.org/rules/pug-indent.html'
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          baseIndent: { type: 'integer', minimum: 0 }
        },
        additionalProperties: false
      }
    ]
  },
  create(context) {
    const options = context.options[0] || {}
    const baseIndent = options.baseIndent || 0

    return {
      'VElement[name="template"][lang="pug"]'(node) {
        const pugCode = context.getSourceCode().getText(node.children[0])
        const tokens = parsePugTemplate(pugCode)

        tokens.forEach((token, index) => {
          if (index === 0) return // Skip the first line

          const expectedIndent = baseIndent * 2 // Assuming 2 spaces per indent level
          if (token.indent < expectedIndent) {
            context.report({
              node: node.children[0],
              loc: { line: token.line, column: 0 },
              message: `Expected indentation of at least ${expectedIndent} spaces`,
              fix(fixer) {
                const range = [
                  node.children[0].range[0] + token.start - token.col + 1,
                  node.children[0].range[0] + token.start
                ]
                return fixer.replaceTextRange(range, ' '.repeat(expectedIndent))
              }
            })
          }
        })
      }
    }
  }
}
