<template>
  <div class="tw-layout-two">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<style scoped>
.tw-layout-two {
  min-height: 100vh;
  background: rgb(var(--p1));
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
