/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../lib/rules/html-quotes-pug')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2015
  }
})

tester.run('html-quotes', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '<template><div id="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div id=\'foo\'></div></template>',
      options: ['single']
    },
    {
      filename: 'test.vue',
      code: '<template><div id="foo" data-id=\'foo\'></div></template>',
      options: ['double', { avoidEscape: true }]
    },
    {
      filename: 'test.vue',
      code: '<template><div id=\'foo\' data-id="foo"></div></template>',
      options: ['single', { avoidEscape: true }]
    },
    {
      filename: 'test.vue',
      code: '<template><div :id="foo + \'bar\'"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div :id=\'foo + "bar"\'></div></template>',
      options: ['single']
    },
    {
      filename: 'test.vue',
      code: '<template><div v-slot=`{ item }`></div></template>',
      options: ['double', { ignoreBackticks: true }]
    },
    {
      filename: 'test.vue',
      code: '<template><div :class="`${active ? \'active\' : \'\'}`"></div></template>',
      options: ['double', { ignoreBackticks: true }]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div id=\'foo\'></div></template>',
      output: '<template><div id="foo"></div></template>',
      errors: ['Expected to be enclosed by double quotes.']
    },
    {
      filename: 'test.vue',
      code: '<template><div id="foo"></div></template>',
      output: '<template><div id=\'foo\'></div></template>',
      options: ['single'],
      errors: ['Expected to be enclosed by single quotes.']
    },
    {
      filename: 'test.vue',
      code: '<template><div id="foo" data-id=\'foo\'></div></template>',
      output: '<template><div id="foo" data-id="foo"></div></template>',
      errors: ['Expected to be enclosed by double quotes.']
    },
    {
      filename: 'test.vue',
      code: '<template><div v-slot=`{ item }`></div></template>',
      output: '<template><div v-slot="{ item }"></div></template>',
      errors: ['Expected to be enclosed by double quotes.']
    },
    {
      filename: 'test.vue',
      code: '<template><div :class="`active`"></div></template>',
      output: '<template><div :class="active"></div></template>',
      errors: ['Expected to be enclosed by double quotes.']
    }
  ]
})
