'use strict'

const pugLexer = require('pug-lexer')
const pugParser = require('pug-parser')

/**
 * @typedef {Object} PugToken
 * @property {string} type - Type of the token
 * @property {number} line - Line number
 * @property {number} col - Column number
 * @property {string} val - Token value
 */

/**
 * @typedef {Object} ParsedPugTemplate
 * @property {PugToken[]} tokens - Array of Pug tokens
 * @property {Object} ast - Abstract Syntax Tree
 * @property {string[]} lines - Array of template lines
 * @property {Map<number, PugToken[]>} tokensByLine - Map of tokens grouped by line
 */

/**
 * Parse a Pug template and return detailed information about its structure
 * @param {string} template - The Pug template string to parse
 * @returns {ParsedPugTemplate}
 * @throws {Error} If template parsing fails
 */
function parsePugTemplate(template) {
  try {
    // Remove BOM if present
    const cleanTemplate = template.replace(/^\uFEFF/, '')

    // Split template into lines for easier processing
    const lines = cleanTemplate.split(/\r?\n/)

    // Get tokens and AST
    const tokens = pugLexer(cleanTemplate)
    const ast = pugParser(tokens)

    // Group tokens by line for efficient access
    const tokensByLine = new Map()
    tokens.forEach((token) => {
      if (!tokensByLine.has(token.line)) {
        tokensByLine.set(token.line, [])
      }
      tokensByLine.get(token.line).push(token)
    })

    return {
      tokens,
      ast,
      lines,
      tokensByLine
    }
  } catch (error) {
    // Enhance error message with more context
    throw new Error(`Failed to parse Pug template: ${error.message}\nTemplate:\n${template}`)
  }
}

/**
 * Get the indentation level of a line
 * @param {string} line - The line to check
 * @returns {number} The number of spaces at the start of the line
 */
function getLineIndentation(line) {
  const match = line.match(/^[ \t]*/)
  return match ? match[0].length : 0
}

/**
 * Check if a line is empty or contains only whitespace
 * @param {string} line - The line to check
 * @returns {boolean}
 */
function isEmptyLine(line) {
  return /^\s*$/.test(line)
}

/**
 * Get all attributes from a tag token
 * @param {PugToken[]} tokens - Array of tokens
 * @param {number} tagIndex - Index of the tag token
 * @returns {PugToken[]} Array of attribute tokens
 */
function getTagAttributes(tokens, tagIndex) {
  const attributes = []
  let i = tagIndex + 1

  while (i < tokens.length && tokens[i].type === 'attribute') {
    attributes.push(tokens[i])
    i++
  }

  return attributes
}

/**
 * Check if a token represents a Pug mixin
 * @param {PugToken} token - The token to check
 * @returns {boolean}
 */
function isMixin(token) {
  return token.type === 'mixin'
}

/**
 * Get the parent node of a given node in the AST
 * @param {Object} ast - The full AST
 * @param {Object} node - The node to find the parent for
 * @returns {Object|null} The parent node or null if not found
 */
function findParentNode(ast, node) {
  let parent = null

  function traverse(current, target, currentParent) {
    if (current === target) {
      parent = currentParent
      return true
    }

    if (current.nodes) {
      for (const child of current.nodes) {
        if (traverse(child, target, current)) {
          return true
        }
      }
    }
    return false
  }

  traverse(ast, node, null)
  return parent
}

module.exports = {
  parsePugTemplate,
  getLineIndentation,
  isEmptyLine,
  getTagAttributes,
  isMixin,
  findParentNode
}
