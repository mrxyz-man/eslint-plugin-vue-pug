/**
 * @fileoverview enforce consistent indentation in <template lang="pug">
 * @author [Your Name]
 */
'use strict'

const utils = require('eslint-plugin-vue/lib/utils')

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
        anyOf: [
          { type: 'integer', minimum: 1 },
          { enum: ['tab'] }
        ]
      },
      {
        type: 'object',
        properties: {
          attribute: { type: 'integer', minimum: 0 },
          baseIndent: { type: 'integer', minimum: 0 },
          closeBracket: {
            anyOf: [
              { type: 'integer', minimum: 0 },
              { enum: ['tag', 'line'] }
            ]
          },
          switchCase: { type: 'integer', minimum: 0 },
          alignAttributesVertically: { type: 'boolean' }
        },
        additionalProperties: false
      }
    ]
  },
  /** @param {RuleContext} context */
  create(context) {
    const options = context.options[0]
    const baseIndent = context.options[1] && context.options[1].baseIndent || 0
    const indentSize = typeof options === 'number' ? options : 2
    const indentChar = typeof options === 'string' ? '\t' : ' '

    const sourceCode = context.getSourceCode()
    const template = context.parserServices.getTemplateBodyTokenStore &&
                     context.parserServices.getTemplateBodyTokenStore()

    /**
     * @param {number} expectedIndent
     * @param {Token} token
     */
    function report(expectedIndent, token) {
      const line = token.loc.start.line
      const currentIndent = token.loc.start.column

      context.report({
        loc: {
          start: { line, column: 0 },
          end: { line, column: currentIndent }
        },
        message: 'Expected indentation of {{expectedIndent}} {{units}} but found {{currentIndent}}.',
        data: {
          expectedIndent,
          currentIndent,
          units: indentChar === '\t' ? 'tab' : 'space'
        },
        fix(fixer) {
          const range = [token.range[0] - currentIndent, token.range[0]]
          const newIndent = indentChar.repeat(expectedIndent)
          return fixer.replaceTextRange(range, newIndent)
        }
      })
    }

    /**
     * @param {VElement} node
     */
    function checkIndentation(node) {
      if (node.loc.start.line === node.loc.end.line) {
        // Skip single-line elements
        return
      }

      const expectedBaseIndent = baseIndent * indentSize
      const childExpectedIndent = expectedBaseIndent + indentSize

      // Check the indentation of the opening tag
      const openToken = template.getFirstToken(node)
      if (openToken.loc.start.column !== expectedBaseIndent) {
        report(expectedBaseIndent, openToken)
      }

      // Check the indentation of attributes and children
      node.children.forEach(child => {
        if (child.type === 'VElement') {
          const childToken = template.getFirstToken(child)
          if (childToken.loc.start.column !== childExpectedIndent) {
            report(childExpectedIndent, childToken)
          }
          checkIndentation(child)
        } else if (child.type === 'VText') {
          const lines = child.value.split('\n')
          lines.forEach((line, index) => {
            if (index > 0 && line.trim()) {
              const lineToken = sourceCode.getTokenByRangeStart(child.range[0] + child.value.indexOf(line))
              if (lineToken && lineToken.loc.start.column !== childExpectedIndent) {
                report(childExpectedIndent, lineToken)
              }
            }
          })
        }
      })

      // Check the indentation of attributes
      node.startTag.attributes.forEach(attr => {
        const attrToken = template.getFirstToken(attr)
        if (attrToken.loc.start.line !== node.loc.start.line &&
            attrToken.loc.start.column !== childExpectedIndent) {
          report(childExpectedIndent, attrToken)
        }
      })
    }

    return utils.defineTemplateBodyVisitor(context, {
      "VElement[name='template'][lang='pug']"(node) {
        node.children.forEach(child => {
          if (child.type === 'VElement') {
            checkIndentation(child)
          }
        })
      }
    })
  }
}
