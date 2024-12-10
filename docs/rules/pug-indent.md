---
pageClass: rule-details
sidebarDepth: 0
title: vue-pug-more/pug-indent
description: enforce consistent indentation in <template lang="pug">
---
# vue-pug-more/pug-indent

> enforce consistent indentation in <template lang="pug">

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>
- :gear: This rule is included in all of `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

## :book: Rule Details

- `number` ... The number of spaces for each indentation level. Default is `2`. If this is a string `"tab"` then indentation will be one tab character.
- `baseIndent` ... The multiplier of indentation for top-level statements. Default is `0`.
- `attribute` ... The multiplier of indentation for attributes. Default is `1`.
- `closeBracket` ... The multiplier of indentation for line wrapping closing brackets. Default is `0`.
- `alignAttributesVertically` ... Condition for whether attributes should be vertically aligned. Default is `true`.
- `ignores` ... The selector to ignore nodes. The AST spec is [here](https://github.com/vuejs/vue-eslint-parser/blob/master/docs/ast.md). You can use [esquery](https://github.com/estools/esquery#readme) to select nodes. Default is an empty array.

`2, { baseIndent: 1 }`
```vue
<template lang="pug">
  div
    p Hello
    p
      | World
</template>
```

`2, { baseIndent: 1, attribute: 2, closeBracket: 1 }`
```vue
<template lang="pug">
  div(
      id="foo"
      class="bar"
    )
    p Hello
    p
      | World
</template>
```

## :wrench: Options

```json
{
  "vue/pug-indent": ["error", 2, {
    "baseIndent": 1,
    "attribute": 1,
    "closeBracket": 0,
    "alignAttributesVertically": true,
    "ignores": []
  }]
}

## :mag: Implementation

- [Rule source](https://github.com/rashfael/eslint-plugin-vue-pug/blob/main/lib/rules/pug-indent.js)
- [Test source](https://github.com/rashfael/eslint-plugin-vue-pug/blob/main/tests/lib/rules/pug-indent.js)
