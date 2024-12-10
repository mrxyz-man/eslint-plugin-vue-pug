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

<eslint-code-block fix :rules="{'vue/html-quotes': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <img src="path/to/image.png">

  <!-- ✗ BAD -->
  <img src='path/to/image.png'>
</template>

## :mag: Implementation

- [Rule source](https://github.com/rashfael/eslint-plugin-vue-pug/blob/main/lib/rules/html-quotes-pug.js)
- [Test source](https://github.com/rashfael/eslint-plugin-vue-pug/blob/main/tests/lib/rules/html-quotes-pug.js)
