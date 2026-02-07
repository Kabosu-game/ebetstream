<template>
  <div class="page-content-with-space">
    <Ebetstart />
  </div>
</template>

<script setup lang="ts">
import Ebetstart from '../components/Pages/ebetstart/Ebetstart.vue';
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
