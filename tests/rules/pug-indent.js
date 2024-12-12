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
      options: [2]
    },
    {
      filename: 'test.vue',
      code: `
<template lang="pug">
  div
    p Hello
    p World
</template>
      `,
      options: [2, { baseIndent: 1 }]
    },
    {
      filename: 'test.vue',
      code: `
<template lang="pug">
div
    p Hello
    p World
</template>
      `,
      options: [4]
    },
    {
      filename: 'test.vue',
      code: `
<template lang="pug">
div
  p Hello
  if condition
    p Conditional
  p World
</template>
      `,
      options: [2]
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
      options: [2],
      errors: [
        {
          message: 'Expected indentation of 2 spaces but found 3.',
          line: 4
        },
        {
          message: 'Expected indentation of 2 spaces but found 1.',
          line: 5
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
<template lang="pug">
div
  p Hello
    p Nested
   p Misaligned
</template>
      `,
      output: `
<template lang="pug">
div
  p Hello
    p Nested
  p Misaligned
</template>
      `,
      options: [2],
      errors: [
        {
          message: 'Expected indentation of 2 spaces but found 3.',
          line: 6
        }
      ]
    },
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
      options: [2],
      errors: [
        {
          message: 'Expected indentation of 2 spaces but found 4.',
          line: 4
        }
      ]
    },
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
      options: [2, { baseIndent: 1 }],
      errors: [
        {
          message: 'Expected indentation of 2 spaces but found 0.',
          line: 3
        },
        {
          message: 'Expected indentation of 4 spaces but found 2.',
          line: 4
        },
        {
          message: 'Expected indentation of 4 spaces but found 1.',
          line: 5
        }
      ]
    }
  ]
})
