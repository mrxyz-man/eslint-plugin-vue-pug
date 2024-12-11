---
pageClass: rule-details
sidebarDepth: 0
title: vue-pug-more/pug-indent
description: enforce consistent indentation in <template lang="pug">
---
# vue-pug-more/pug-indent
# enforce consistent indentation in <template lang="pug"> (pug-indent)

This rule enforces a consistent indentation style in `<template lang="pug">`. The default style is 2 spaces.

## :book: Rule Details

This rule checks all tags and attributes in Pug templates.

```vue
<template lang="pug">
  <!-- ✓ GOOD -->
  v-container
    v-row(
      cols="12"
      md="6"
    )

  <!-- ✗ BAD -->
  v-container
     v-row(
    cols="12"
       md="6"
     )
</template>
