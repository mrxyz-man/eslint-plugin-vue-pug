---
pageClass: rule-details
sidebarDepth: 0
title: vue-pug-more/html-quotes-pug
description: enforce quotes style of HTML attributes
---
# vue-pug-more/html-quotes-pug

> enforce quotes style of HTML attributes

- :exclamation: <badge text="This rule has not been released yet." vertical="middle" type="error"> ***This rule has not been released yet.*** </badge>
- :gear: This rule is included in all of `"plugin:vue/vue3-strongly-recommended"`, `"plugin:vue/strongly-recommended"`, `"plugin:vue/vue3-recommended"` and `"plugin:vue/recommended"`.
- :wrench: The `--fix` option on the [command line](https://eslint.org/docs/user-guide/command-line-interface#fixing-problems) can automatically fix some of the problems reported by this rule.

This rule enforces the usage of double quotes or single quotes in HTML attributes.

## :book: Rule Details

This rule aims to enforce a consistent use of quotes in HTML attributes.

## :wrench: Options

```js
{
  "vue/html-quotes": ["error", "double" | "single", {
    "avoidEscape": boolean,
    "ignoreBackticks": boolean
  }]
}
```

- `"double"` (default) ... requires double quotes
- `"single"` ... requires single quotes
- `avoidEscape` ... if `true`, allows strings to use single-quotes or double-quotes so long as the string contains a quote that would have to be escaped otherwise. Default is `false`.
- `ignoreBackticks` ... if `true`, ignores backtick quotes in attributes. This is useful for template literals and multi-line attributes. Default is `false`.

## double

```vue
<template>
  <!-- ✓ GOOD -->
  <img src="path/to/image.png">

  <!-- ✗ BAD -->
  <img src='path/to/image.png'>
</template>
```

## single

```vue
<template>
  <!-- ✓ GOOD -->
  <img src='path/to/image.png'>

  <!-- ✗ BAD -->
  <img src="path/to/image.png">
</template>
```

## avoidEscape

```vue
<template>
  <!-- ✓ GOOD -->
  <img src="path/to/image.png">
  <img src='a "double" quoted inside'>

  <!-- ✗ BAD -->
  <img src='path/to/image.png'>
</template>
```

## ignoreBackticks

```vue
<template>
  <!-- ✓ GOOD -->
  <img src="path/to/image.png">
  <div v-slot=`{ item }`></div>
  <div :class="`${active ? 'active' : ''}`"></div>
  <server-data
    ref="list"
    v-model="items"
    :method="method"
    :serialize-data="serializeData"
    v-slot=`{
      query,
      hasMore,
      loading,
      queryList,
      pagination,
      isInitialized,
      loadMoreItems,
    }`
  ></server-data>

  <!-- ✗ BAD -->
  <img src='path/to/image.png'>
</template>
```
