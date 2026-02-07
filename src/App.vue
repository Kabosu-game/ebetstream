<script setup lang="ts">
import { RouterView } from "vue-router";
import MainLayout from "./Layouts/MainLayout.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// Si layout est false, on n'utilise pas de layout
const layoutComponent = computed(() => {
  if (!route?.meta) return MainLayout;
  if (route.meta.layout === false) {
    return null;
  }
  return route.meta.layout || MainLayout;
});
</script>

<template>
  <component v-if="layoutComponent" :is="layoutComponent">
    <RouterView />
  </component>
  <RouterView v-else />
</template>
