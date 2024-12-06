const RuleTester = require('eslint').RuleTester
const rule = require('../../lib/rules/pug-indent')

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
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
           p
             | World
        </template>
      `,
      output: `
        <template lang="pug">
        div
          p Hello
          p
            | World
        </template>
      `,
      options: [2],
      errors: [
        {
          message: 'Expected indentation of 2 spaces but found 1.',
          line: 4
        },
        {
          message: 'Expected indentation of 2 spaces but found 3.',
          line: 5
        },
        {
          message: 'Expected indentation of 4 spaces but found 5.',
          line: 6
        }
      ]
    }
  ]
})
