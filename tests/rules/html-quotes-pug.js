/**
 * @fileoverview Tests for html-quotes-pug rule.
 * @author [Your Name]
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../lib/rules/html-quotes-pug')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  }
})

tester.run('html-quotes-pug', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '<template lang="pug">div(id="app")</template>'
    },
    {
      filename: 'test.vue',
      code: "<template lang=\"pug\">div(id='app')</template>",
      options: ['single']
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div(id="app" data-id=\'app\')</template>',
      options: ['double', { avoidEscape: true }]
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div(v-slot=`{ item }`)</template>',
      options: ['double', { ignoreBackticks: true }]
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div(:class="`${active ? \'active\' : \'\'}`")</template>',
      options: ['single', { ignoreBackticks: true }]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: "<template lang=\"pug\">div(id='app')</template>",
      output: '<template lang="pug">div(id="app")</template>',
      errors: [{ message: 'Expected to be enclosed by double quotes.' }]
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div(id="app")</template>',
      output: "<template lang=\"pug\">div(id='app')</template>",
      options: ['single'],
      errors: [{ message: 'Expected to be enclosed by single quotes.' }]
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div(v-slot=`{ item }`)</template>',
      output: '<template lang="pug">div(v-slot="{ item }")</template>',
      errors: [{ message: 'Expected to be enclosed by double quotes.' }]
    },
    {
      filename: 'test.vue',
      code: '<template lang="pug">div(:class="`active`")</template>',
      output: "<template lang=\"pug\">div(:class='active')</template>",
      options: ['single', { ignoreBackticks: false }],
      errors: [{ message: 'Expected to be enclosed by single quotes.' }]
    }
  ]
})
