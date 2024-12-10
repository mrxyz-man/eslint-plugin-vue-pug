/**
 * @fileoverview enforce quotes style of HTML attributes
 * @author Yosuke Ota
 * Modified for Pug support
 */
'use strict'

const utils = require('eslint-plugin-vue/lib/utils')

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce quotes style of HTML attributes in Pug templates',
      categories: ['vue3-strongly-recommended', 'strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/html-quotes.html'
    },
    fixable: 'code',
    schema: [
      {
        enum: ['double', 'single']
      },
      {
        type: 'object',
        properties: {
          avoidEscape: {
            type: 'boolean'
          },
          ignoreBackticks: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ]
  },
  /** @param {RuleContext} context */
  create(context) {
    const double = context.options[0] !== 'single'
    const options = context.options[1] || {}
    const avoidEscape = options.avoidEscape !== false
    const ignoreBackticks = options.ignoreBackticks === true

    return utils.defineTemplateBodyVisitor(context, {
      /** @param {VAttribute} node */
      'VAttribute'(node) {
        if (!node.value || !node.value.value) {
          return
        }

        const text = node.value.value
        const firstChar = text[0]

        // Skip if using backticks and ignoreBackticks is true
        if (ignoreBackticks && firstChar === '`') {
          return
        }

        if (firstChar !== '"' && firstChar !== '\'' && firstChar !== '`') {
          return
        }

        const quoted = firstChar === '"'
        if (double === quoted) {
          return
        }

        // If avoidEscape is true, check if the opposite quote exists in text
        if (avoidEscape) {
          const oppositeQuote = double ? '"' : '\''
          if (text.indexOf(oppositeQuote) >= 0) {
            return
          }
        }

        context.report({
          node: node.value,
          loc: node.value.loc,
          message: double
            ? 'Expected to be enclosed by double quotes.'
            : 'Expected to be enclosed by single quotes.',
          fix(fixer) {
            const quote = double ? '"' : '\''
            return fixer.replaceText(
              node.value,
              quote + text.slice(1, -1) + quote
            )
          }
        })
      }
    })
  }
}
