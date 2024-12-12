/**
 * @fileoverview enforce consistent indentation in <template lang="pug">
 * @author [Your Name]
 */
'use strict'

const { RuleTester } = require('eslint')
const rule = require('../../lib/rules/pug-indent')

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  }
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
  ul
    li Item 1
    li Item 2
  .class-name
    span Nested content
</template>
      `,
      options: [{ baseIndent: 0 }]
    },
    {
      filename: 'test.vue',
      code: `
<template lang="pug">
  div
    p Hello
    p World
    ul
      li Item 1
      li Item 2
    .class-name
      span Nested content
</template>
      `,
      options: [{ baseIndent: 1 }]
    },
    {
      filename: 'test.vue',
      code: `
<template lang="pug">
div
  p Hello
  //- Comment
  if condition
    p Conditional content
  else
    p Alternative content
</template>
      `,
      options: [{ baseIndent: 0 }]
    },
    {
      filename: 'test.vue',
      code: `
<template lang="pug">
div
  p Hello
  = variable
  - const x = 5
  each item in items
    li= item
</template>
      `,
      options: [{ baseIndent: 0 }]
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
  ul
      li Item 1
    li Item 2
 .class-name
   span Nested content
</template>
      `,
      output: `
<template lang="pug">
div
  p Hello
  p World
  ul
    li Item 1
    li Item 2
  .class-name
    span Nested content
</template>
      `,
      options: [{ baseIndent: 0 }],
      errors: [
        { message: 'Expected indentation of 2 spaces but found 1.', line: 4 },
        { message: 'Expected indentation of 2 spaces but found 3.', line: 5 },
        { message: 'Expected indentation of 4 spaces but found 6.', line: 7 },
        { message: 'Expected indentation of 2 spaces but found 1.', line: 9 },
        { message: 'Expected indentation of 4 spaces but found 3.', line: 10 }
      ]
    },
    {
      filename: 'test.vue',
      code: `
<template lang="pug">
div
  p Hello
 p World
   ul
     li Item 1
      li Item 2
  .class-name
 span Nested content
</template>
      `,
      output: `
<template lang="pug">
  div
    p Hello
    p World
    ul
      li Item 1
      li Item 2
    .class-name
      span Nested content
</template>
      `,
      options: [{ baseIndent: 1 }],
      errors: [
        { message: 'Expected indentation of 2 spaces but found 0.', line: 3 },
        { message: 'Expected indentation of 4 spaces but found 2.', line: 4 },
        { message: 'Expected indentation of 4 spaces but found 1.', line: 5 },
        { message: 'Expected indentation of 4 spaces but found 3.', line: 6 },
        { message: 'Expected indentation of 6 spaces but found 5.', line: 7 },
        { message: 'Expected indentation of 6 spaces but found 6.', line: 8 },
        { message: 'Expected indentation of 4 spaces but found 2.', line: 9 },
        { message: 'Expected indentation of 6 spaces but found 1.', line: 10 }
      ]
    },
    {
      filename: 'test.vue',
      code: `
<template lang="pug">
div
 if condition
   p Conditional content
 else
  p Alternative content
</template>
      `,
      output: `
<template lang="pug">
div
  if condition
    p Conditional content
  else
    p Alternative content
</template>
      `,
      options: [{ baseIndent: 0 }],
      errors: [
        { message: 'Expected indentation of 2 spaces but found 1.', line: 4 },
        { message: 'Expected indentation of 4 spaces but found 3.', line: 5 },
        { message: 'Expected indentation of 2 spaces but found 1.', line: 6 },
        { message: 'Expected indentation of 4 spaces but found 2.', line: 7 }
      ]
    },
    {
      filename: 'test.vue',
      code: `
<template lang="pug">
div
 p Hello
  = variable
   - const x = 5
 each item in items
  li= item
</template>
      `,
      output: `
<template lang="pug">
div
  p Hello
  = variable
  - const x = 5
  each item in items
    li= item
</template>
      `,
      options: [{ baseIndent: 0 }],
      errors: [
        { message: 'Expected indentation of 2 spaces but found 1.', line: 4 },
        { message: 'Expected indentation of 2 spaces but found 2.', line: 5 },
        { message: 'Expected indentation of 2 spaces but found 3.', line: 6 },
        { message: 'Expected indentation of 2 spaces but found 1.', line: 7 },
        { message: 'Expected indentation of 4 spaces but found 2.', line: 8 }
      ]
    }
  ]
})
