---
pageClass: rule-details
sidebarDepth: 0
title: vue-pug/html-quotes-pug
description: xxx
---
# vue-pug/html-quotes-pug
# enforce quotes style of HTML attributes (html-quotes)

This rule enforces the usage of double quotes or single quotes in HTML attributes.

## :book: Rule Details

This rule aims to enforce a consistent use of quotes in HTML attributes.

<eslint-code-block :rules="{'vue/html-quotes': ['error']}">

```vue
<template>
  <!-- ✓ GOOD -->
  <img src="path/to/image.png">

  <!-- ✗ BAD -->
  <img src='path/to/image.png'>
</template>
