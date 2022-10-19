<template lang="pug">
.app
  el-menu.app__el-menu(
    :default-active="activeIndex"
    mode="horizontal"
    :ellipsis="false"
    :router="true"
  )
    el-menu-item( index="/")
      IconHouse
      
  RouterView
</template>
<script setup lang="ts">
import IconHouse from "@/components/icons/IconHouse.vue";

import { ref } from "vue";

const activeIndex = ref("/");
</script>

<style lang="scss" scoped>
.app {
  &__el-menu {
    height: 55px;
    background-color: aliceblue;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

a.router-link-exact-active {
  color: var(--color-text);
}

a.router-link-exact-active:hover {
  background-color: transparent;
}

a {
  text-decoration: none;
}

a:first-of-type {
  border: 0;
}
</style>
