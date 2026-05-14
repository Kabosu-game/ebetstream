<template>
  <Header />
  <!-- Main content area: offset by sidebar (240px) + top bar (50px) -->
  <main class="tw-main-content">
    <router-view />
    <MainFooter />
  </main>
</template>

<script setup lang="ts">
import Header from "../components/Shared/Header.vue";
import MainFooter from "../components/Shared/MainFooter.vue";
</script>

<style scoped>
.tw-main-content {
  margin-left: 240px;
  margin-top: 50px;
  min-height: calc(100vh - 50px);
  padding: 0 20px;

  @media (max-width: 991px) {
    margin-left: 60px;
    padding: 0 16px;
  }

  @media (max-width: 575px) {
    margin-left: 0;
    padding: 0 12px;
  }
}
</style>
