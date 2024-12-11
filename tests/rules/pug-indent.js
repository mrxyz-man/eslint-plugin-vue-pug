/**
 * @fileoverview enforce consistent indentation in <template lang="pug">
 * @author [Your Name]
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../lib/rules/pug-indent')

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})

ruleTester.run('pug-indent', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
<template lang="pug">
  div
    p Hello
    p World
</template>
      `,
      options: [{ baseIndent: 1 }]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
<template lang="pug">
div
  p Hello
p World
</template>
      `,
      output: `
<template lang="pug">
  div
    p Hello
  p World
</template>
      `,
      options: [{ baseIndent: 1 }],
      errors: [
        { message: 'Expected indentation of at least 2 spaces', line: 3 },
        { message: 'Expected indentation of at least 2 spaces', line: 5 }
      ]
    }
  ]
})
