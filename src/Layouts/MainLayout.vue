<template>
  <Header />
  <router-view />
  <MainFooter />
</template>

<script setup lang="ts">
import Header from "../components/Shared/Header.vue";
import MainFooter from "../components/Shared/MainFooter.vue";
</script>
