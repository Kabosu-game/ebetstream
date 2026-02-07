<template>
  <DashBoard />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import DashBoard from '../components/Pages/Dashboard/DashBoard.vue';

const router = useRouter();

onMounted(() => {
  const token = localStorage.getItem("auth_token");
  const userRole = localStorage.getItem("user_role");
  
  if (!token) {
    // Redirige vers la page login si pas connecté
    router.push("/login");
    return;
  }
  
  // Rediriger les admins vers le dashboard admin
  if (userRole === 'admin') {
    router.push("/admin");
    return;
  }
});
</script>

<style scoped></style>
