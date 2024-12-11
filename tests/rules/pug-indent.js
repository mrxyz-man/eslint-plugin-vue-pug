/**
 * @fileoverview enforce consistent indentation in <template lang="pug">
 * @author [Your Name]
 */
'use strict'

const rule = require('../../lib/rules/pug-indent')
const RuleTester = require('eslint').RuleTester

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
    p
      | World
    v-row(
      cols="12"
      md="6"
    )
</template>
      `
    },
    {
      filename: 'test.vue',
      code: `
<template lang="pug">
\tdiv
\t\tp Hello
\t\tp
\t\t\t| World
\t\tv-row(
\t\t\tcols="12"
\t\t\tmd="6"
\t\t)
</template>
      `,
      options: ['tab']
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
<template lang="pug">
  div
   p Hello
     p
      | World
    v-row(
     cols="12"
       md="6"
    )
</template>
      `,
      output: `
<template lang="pug">
  div
    p Hello
    p
      | World
    v-row(
      cols="12"
      md="6"
    )
</template>
      `,
      errors: [
        { message: 'Expected indentation of 4 spaces but found 3.', line: 4 },
        { message: 'Expected indentation of 4 spaces but found 5.', line: 5 },
        { message: 'Expected indentation of 6 spaces but found 5.', line: 8 },
        { message: 'Expected indentation of 6 spaces but found 7.', line: 9 }
      ]
    }
  ]
})
