<template>
  <div class="admin-layout">
    <AdminHeader />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import AdminHeader from "../components/Shared/AdminHeader.vue";
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: #0a0e27;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  margin-left: 0 !important;
  padding-left: 0 !important;
}

/* Masquer complètement le sidebar s'il existe */
.admin-layout :deep(.left-nav-area),
.admin-layout :deep(.navigation),
.admin-layout :deep(#div10) {
  display: none !important;
  visibility: hidden !important;
  width: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* Annuler toutes les marges à gauche des styles globaux */
.admin-layout :deep(.pay_method__paymethod),
.admin-layout :deep(.defi_card),
.admin-layout :deep(.row),
.admin-layout :deep(.col-md-6),
.admin-layout :deep(.col-lg-4),
.admin-layout :deep(.col-xl-3) {
  margin-left: 0 !important;
}

.admin-layout :deep(.container-fluid),
.admin-layout :deep(.container) {
  margin-left: 0 !important;
  padding-left: 0 !important;
}

/* Annuler les marges spécifiques des styles globaux */
.admin-layout :deep(*) {
  margin-left: 0 !important;
}

.admin-layout :deep([style*="margin-left"]),
.admin-layout :deep([style*="margin:"]),
.admin-layout :deep([style*="padding-left"]) {
  margin-left: 0 !important;
}

@media (min-width: 768px) {
  .admin-layout :deep(.container-fluid) {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
}

@media (max-width: 768px) {
  .admin-layout :deep(.container-fluid) {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
  }
}
</style>


