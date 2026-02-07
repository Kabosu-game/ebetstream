<template>
  <HeaderTwo />
  <router-view />
  <MainFooter />
</template>

<script setup lang="ts">
import HeaderTwo from "../components/Shared/HeaderTwo.vue";
import MainFooter from "../components/Shared/MainFooter.vue";
</script>
