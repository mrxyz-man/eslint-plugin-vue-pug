// AUTOGENERATED FROM https://github.com/vuejs/eslint-plugin-vue/blob/35bf1009d9b85d88b558d1739ddaadf665bb17dd/tests/lib/rules/no-child-content.js
/**
 * @author Flo Edelmann
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../eslint-plugin-vue/lib/rules/no-child-content')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------
const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2015,
    templateTokenizer: { pug: 'vue-eslint-parser-template-tokenizer-pug' }
  }
})

ruleTester.run('no-child-content', rule, {
  valid: [
    {
      // element without directive
      filename: 'test.vue',
      code: `<template lang="pug">div foo</template>`
    },
    {
      // element with unknown directive
      filename: 'test.vue',
      code: `<template lang="pug">div(v-foo="bar")</template>`
    },
    {
      // self-closing element with v-html directive
      filename: 'test.vue',
      code: `<template lang="pug">div(v-html="foo")</template>`
    },
    {
      // self-closing element with v-text directive
      filename: 'test.vue',
      code: `<template lang="pug">div(v-text="foo")</template>`
    },
    {
      // v-html directive and whitespace-only text content with newline
      filename: 'test.vue',
      code: `
        <template lang="pug">div(v-html="foo")</template>`
    },
    {
      // self-closing element with v-t directive
      filename: 'test.vue',
      options: [{ additionalDirectives: ['t'] }],
      code: `<template lang="pug">div(v-t="foo")</template>`
    },
    {
      // self-closing element with v-html directive and sibling comment element
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-html="foo")
// bar
</template>`
    }
  ],
  invalid: [
    {
      // v-html directive and text content
      filename: 'test.vue',
      code: `<template lang="pug">div(v-html="foo") bar</template>`,
      errors: [
        {
          message:
            'Child content is disallowed because it will be overwritten by the v-html directive.',
          column: 40,
          endColumn: 43,
          suggestions: [
            { output: `<template lang="pug">div(v-html="foo") </template>` }
          ]
        }
      ]
    },
    {
      // v-html directive and text expression content
      filename: 'test.vue',
      code: `<template lang="pug">div(v-html="foo") {{ bar }}</template>`,
      errors: [
        {
          message:
            'Child content is disallowed because it will be overwritten by the v-html directive.',
          column: 40,
          endColumn: 49,
          suggestions: [
            { output: `<template lang="pug">div(v-html="foo") </template>` }
          ]
        }
      ]
    },
    {
      // v-html directive and child element
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-html="foo")
  span
</template>`,
      errors: [
        {
          message:
            'Child content is disallowed because it will be overwritten by the v-html directive.',
          column: 3,
          endColumn: 1,
          suggestions: [
            {
              output: `<template lang="pug">
div(v-html="foo")
  </template>`
            }
          ]
        }
      ]
    },
    {
      // v-html directive and child comment element
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-html="foo")
  // bar
</template>`,
      errors: [
        {
          message:
            'Child content is disallowed because it will be overwritten by the v-html directive.',
          column: 3,
          endColumn: 9,
          suggestions: [
            {
              output: `<template lang="pug">
div(v-html="foo")
  
</template>`
            }
          ]
        }
      ]
    },
    {
      // v-html directive and multiple child elements
      filename: 'test.vue',
      code: `<template lang="pug">
div(v-html="foo")
  // this is a test
  span foo
  | bar
</template>`,
      errors: [
        {
          message:
            'Child content is disallowed because it will be overwritten by the v-html directive.',
          line: 3,
          column: 3,
          endLine: 5,
          endColumn: 8,
          suggestions: [
            {
              output: `<template lang="pug">
div(v-html="foo")
  
  | 
</template>`
            }
          ]
        }
      ]
    },
    {
      // v-text directive and text content
      filename: 'test.vue',
      code: `<template lang="pug">div(v-text="foo") bar</template>`,
      errors: [
        {
          message:
            'Child content is disallowed because it will be overwritten by the v-text directive.',
          column: 40,
          endColumn: 43,
          suggestions: [
            { output: `<template lang="pug">div(v-text="foo") </template>` }
          ]
        }
      ]
    },
    {
      // v-t directive and text content
      filename: 'test.vue',
      options: [{ additionalDirectives: ['t'] }],
      code: `<template lang="pug">div(v-t="foo") bar</template>`,
      errors: [
        {
          message:
            'Child content is disallowed because it will be overwritten by the v-t directive.',
          column: 37,
          endColumn: 40,
          suggestions: [
            { output: `<template lang="pug">div(v-t="foo") </template>` }
          ]
        }
      ]
    },
    {
      // v-html directive and text content while v-t directive is configured
      filename: 'test.vue',
      options: [{ additionalDirectives: ['t'] }],
      code: `<template lang="pug">div(v-html="foo") baz</template>`,
      errors: [
        {
          message:
            'Child content is disallowed because it will be overwritten by the v-html directive.',
          column: 40,
          endColumn: 43,
          suggestions: [
            { output: `<template lang="pug">div(v-html="foo") </template>` }
          ]
        }
      ]
    }
  ]
})