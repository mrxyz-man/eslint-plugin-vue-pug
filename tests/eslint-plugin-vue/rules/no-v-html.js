// AUTOGENERATED FROM https://github.com/vuejs/eslint-plugin-vue/blob/35bf1009d9b85d88b558d1739ddaadf665bb17dd/tests/lib/rules/no-v-html.js
/**
 * @fileoverview Restrict or warn use of v-html to prevent XSS attack
 * @author Nathan Zeplowitz
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../eslint-plugin-vue/lib/rules/no-v-html')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------
const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 , templateTokenizer: { pug: 'vue-eslint-parser-template-tokenizer-pug'}}
})

ruleTester.run('no-v-html', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: `<template></template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">div(v-if="foo")</template>`
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">div(v-if="foo", v-bind="bar")</template>`
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `<template lang="pug">div(v-html="foo")</template>`,
      errors: ["'v-html' directive can lead to XSS attack."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">ul(v-html:aaa="userHTML")</template>`,
      errors: ["'v-html' directive can lead to XSS attack."]
    },
    {
      filename: 'test.vue',
      code: `<template lang="pug">section(v-html)</template>`,
      errors: ["'v-html' directive can lead to XSS attack."]
    }
  ]
})