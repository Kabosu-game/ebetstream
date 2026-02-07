<template>
  <div class="page-content-with-space">
    <Clans />
  </div>
</template>

<script setup lang="ts">
import Clans from '../components/Pages/Clans/Clans.vue';
</script>

<style scoped>
/* Espace visible en haut de la page */
.page-content-with-space {
  padding-top: 90px; /* ajuste selon la hauteur réelle du header */
}
/* responsive */
@media (max-width: 768px) {
  .page-content-with-space {
    padding-top: 60px;
  }
}
</style>
