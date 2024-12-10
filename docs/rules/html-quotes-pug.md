---
pageClass: rule-details
sidebarDepth: 0
title: vue-pug/html-quotes-pug
description: xxx
---
# vue-pug/html-quotes-pug
# enforce quotes style of HTML attributes in Pug templates (html-quotes-pug)

This rule enforces the usage of double quotes or single quotes in Pug templates for Vue.js.

## :book: Rule Details

This rule aims to enforce a consistent use of quotes in Pug templates.

<eslint-code-block :rules="{'vue-pug/html-quotes-pug': ['error']}">

```vue
<template lang="pug">
<!-- ✓ GOOD -->
div(id="foo")
input(type="text")

<!-- ✗ BAD -->
div(id='foo')
input(type='text')
</template>
