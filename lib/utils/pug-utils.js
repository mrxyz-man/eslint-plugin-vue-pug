const pugLexer = require('pug-lexer')

function parsePugTemplate(template) {
  const tokens = pugLexer(template)
  const lines = template.split('\n')

  return tokens.map((token) => ({
    ...token,
    line: lines[token.line - 1],
    indent: token.col - 1
  }))
}

module.exports = {
  parsePugTemplate
}
