/**
 * @fileoverview enforce consistent indentation in <template lang="pug">
 * @author Your Name
 */
'use strict'

const { processRule } = require('../utils/pug-utils')

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
    const baseIndent = options.baseIndent || 2

    return processRule(context, () => {
      return {
        'VElement[name=template][lang=pug]'() {
          const pugCode = context.getSourceCode().getText(this.children[0])
          const indent = pugCode.match(/^ +/)?.[0].length || 0
          const lines = pugCode.split('\n')
          for (const line of lines) {
            if (line.startsWith(' ') && line.length > indent) {
              context.report({
                node: this.children[0],
                message: 'Expected indentation of {{baseIndent}} spaces but found {{actualIndent}} spaces.',
                data: {
                  baseIndent,
                  actualIndent: line.length - indent
                }
              })
            }
          }
        }
      }
    })
  }
}
