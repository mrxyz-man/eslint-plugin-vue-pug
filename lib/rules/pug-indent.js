/**
 * @fileoverview enforce consistent indentation in <template lang="pug">
 * @author Your Name
 */
'use strict'

const utils = require('eslint-plugin-vue/lib/utils')
const { parsePugTemplate, getLineIndentation, isEmptyLine } = require('../utils/pug-utils')

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
        oneOf: [
          {
            enum: ['tab']
          },
          {
            type: 'integer',
            minimum: 0
          }
        ]
      },
      {
        type: 'object',
        properties: {
          baseIndent: {
            type: 'integer',
            minimum: 0
          },
          attribute: {
            type: 'integer',
            minimum: 0
          },
          closeBracket: {
            oneOf: [
              {
                type: 'integer',
                minimum: 0
              },
              {
                enum: ['nonzero']
              }
            ]
          },
          switchCase: {
            type: 'integer',
            minimum: 0
          },
          alignAttributesVertically: {
            type: 'boolean'
          },
          ignores: {
            type: 'array',
            items: {
              allOf: [
                { type: 'string' },
                { not: { type: 'string', pattern: ':exit$' } },
                { not: { type: 'string', pattern: '^\\s*$' } }
              ]
            },
            uniqueItems: true,
            additionalItems: false
          }
        },
        additionalProperties: false
      }
    ]
  },

  /** @param {RuleContext} context */
  create(context) {
    const options = context.options[0]
    const userOptions = context.options[1] || {}
    const indentType = typeof options === 'string' ? options === 'tab' ? '\t' : ' ' : ' '
    const indentSize = typeof options === 'number' ? options : 2
    const baseIndent = userOptions.baseIndent || 0
    const attributeIndent = userOptions.attribute || 1
    const closeBracketIndent = userOptions.closeBracket || 0
    const switchCaseIndent = userOptions.switchCase || 0
    const alignAttributesVertically = userOptions.alignAttributesVertically || false

    /** @type {Map<string, { baseIndent: number }>} */
    const templateIndentCache = new Map()

    /**
     * @param {number} expectedIndent
     * @param {number} actualIndent
     * @param {number} startOffset
     * @param {string} line
     * @param {RuleContext} context
     * @param {VElement} node
     */
    function reportIndentationError(expectedIndent, actualIndent, startOffset, line, context, node) {
      const diff = actualIndent - expectedIndent
      const loc = {
        start: { line: startOffset, column: 0 },
        end: { line: startOffset, column: actualIndent }
      }

      context.report({
        node,
        loc,
        message: diff > 0
          ? 'Expected indentation of {{expectedIndent}} {{unit}}{{plural}} but found {{actualIndent}} {{unit}}{{plural}}.'
          : 'Expected indentation of {{expectedIndent}} {{unit}}{{plural}} but found {{actualIndent}}.',
        data: {
          expectedIndent,
          actualIndent,
          unit: indentType === '\t' ? 'tab' : 'space',
          plural: expectedIndent === 1 ? '' : 's'
        },
        fix(fixer) {
          return fixer.replaceTextRange(
            [node.range[0] + loc.start.column, node.range[0] + loc.end.column],
            indentType.repeat(expectedIndent)
          )
        }
      })
    }

    return utils.defineTemplateBodyVisitor(context, {
      /** @param {VElement} node */
      'VElement[name="template"][lang="pug"]'(node) {
        const pugCode = context.getSourceCode().getText(node)
        const { lines, tokensByLine } = parsePugTemplate(pugCode)

        let expectedBaseIndent = baseIndent * indentSize

        lines.forEach((line, index) => {
          if (isEmptyLine(line)) return

          const lineNumber = index + 1
          const actualIndent = getLineIndentation(line)
          const tokens = tokensByLine.get(lineNumber) || []

          if (tokens.length === 0) return

          const firstToken = tokens[0]

          // Check if it's a top-level element (directly under <template>)
          if (firstToken.type === 'tag' && firstToken.col === 1) {
            const expectedIndent = expectedBaseIndent
            if (actualIndent !== expectedIndent) {
              reportIndentationError(expectedIndent, actualIndent, lineNumber, line, context, node)
            }
          } else {
            // For nested elements, calculate the expected indent based on nesting level
            const expectedIndent = expectedBaseIndent + (firstToken.col - 1) * indentSize
            if (actualIndent !== expectedIndent) {
              reportIndentationError(expectedIndent, actualIndent, lineNumber, line, context, node)
            }
          }
        })
      }
    })
  }
}
