/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('eslint-plugin-vue/lib/utils')

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce quotes style of HTML attributes',
      categories: ['vue3-strongly-recommended', 'strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/html-quotes.html'
    },
    fixable: 'code',
    schema: [
      { enum: ['double', 'single'] },
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
    const sourceCode = context.getSourceCode()
    const double = context.options[0] !== 'single'
    const options = context.options[1] || {}
    const avoidEscape = options.avoidEscape === true
    const ignoreBackticks = options.ignoreBackticks === true
    const quoteChar = double ? '"' : "'"
    const quoteName = double ? 'double quotes' : 'single quotes'
    /** @type {boolean} */
    let hasInvalidEOF

    return utils.defineTemplateBodyVisitor(
      context,
      {
        'VAttribute[value!=null]'(node) {
          if (hasInvalidEOF) {
            return
          }

          const text = sourceCode.getText(node.value)
          const firstChar = text[0]
          const lastChar = text[text.length - 1]

          if (ignoreBackticks && (firstChar === '`' || lastChar === '`')) {
            return
          }

          if (firstChar !== quoteChar || lastChar !== quoteChar) {
            const quoted = (firstChar === "'" && lastChar === "'") || (firstChar === '"' && lastChar === '"')
            if (avoidEscape && quoted) {
              const contentText = text.slice(1, -1)
              if (contentText.includes(quoteChar)) {
                return
              }
            }

            context.report({
              node: node.value,
              loc: node.value.loc,
              message: 'Expected to be enclosed by {{kind}}.',
              data: { kind: quoteName },
              fix(fixer) {
                const contentText = quoted ? text.slice(1, -1) : text

                let fixToDouble = double
                if (avoidEscape && !quoted && contentText.includes(quoteChar)) {
                  fixToDouble = double
                    ? contentText.includes("'")
                    : !contentText.includes('"')
                }

                const quotePattern = fixToDouble ? /"/g : /'/g
                const quoteEscaped = fixToDouble ? '&quot;' : '&apos;'
                const fixQuoteChar = fixToDouble ? '"' : "'"

                const replacement =
                  fixQuoteChar +
                  contentText.replace(quotePattern, quoteEscaped) +
                  fixQuoteChar
                return fixer.replaceText(node.value, replacement)
              }
            })
          }
        }
      },
      {
        Program(node) {
          hasInvalidEOF = utils.hasInvalidEOF(node)
        }
      }
    )
  }
}
