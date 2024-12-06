const utils = require('eslint-plugin-vue/lib/utils')

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce consistent indentation in <template lang="pug">',
      categories: ['vue3-strongly-recommended', 'strongly-recommended'],
      url: 'https://eslint-plugin-vue-pug.rash.codes/rules/pug-indent.html'
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
            minimum: 1
          }
        ]
      },
      {
        type: 'object',
        properties: {
          attribute: {
            type: 'integer',
            minimum: 0
          },
          baseIndent: {
            type: 'integer',
            minimum: 0
          },
          closeBracket: {
            type: 'integer'
          },
          alignAttributesVertically: {
            type: 'boolean'
          },
          ignores: {
            type: 'array',
            items: {
              type: 'string'
            },
            uniqueItems: true,
            additionalItems: false
          }
        },
        additionalProperties: false
      }
    ]
  },

  create(context) {
    const options = context.options[0]
    const indentSize = typeof options === 'number' ? options : 2

    const sourceCode = context.getSourceCode()

    function report(node, loc, message) {
      context.report({
        node,
        loc,
        message,
        fix(fixer) {
          return fixer.replaceTextRange(
            [loc.start.offset, loc.end.offset],
            ' '.repeat(loc.expectedIndent)
          )
        }
      })
    }

    function checkIndent(node, indent) {
      const lineIndent = sourceCode
        .getLines()
        [node.loc.start.line - 1].match(/^\s*/)[0]
      const expectedIndent = ' '.repeat(indent)

      if (lineIndent !== expectedIndent) {
        report(
          node,
          {
            start: node.loc.start,
            end: { line: node.loc.start.line, column: lineIndent.length },
            expectedIndent: indent
          },
          `Expected indentation of ${indent} spaces but found ${lineIndent.length}.`
        )
      }
    }

    function isFirstNodeInLine(node) {
      const token = sourceCode.getTokenBefore(node)
      return !token || token.loc.end.line < node.loc.start.line
    }

    return utils.defineTemplateBodyVisitor(context, {
      VElement(node) {
        if (node.parent.type !== 'VElement' || !utils.isPugTemplate(node))
          return

        const parentIndent = node.parent.loc.start.column
        const indent = parentIndent + indentSize

        if (isFirstNodeInLine(node)) {
          checkIndent(node, indent)
        }

        node.children.forEach((child) => {
          if (child.type === 'VElement' && isFirstNodeInLine(child)) {
            checkIndent(child, indent + indentSize)
          }
        })
      }
    })
  }
}
