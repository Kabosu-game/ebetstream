<template>
  <AdminDashBoard />
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import AdminDashBoard from '../components/Pages/Admin/AdminDashBoard.vue';

const router = useRouter();

onBeforeMount(() => {
  const token = localStorage.getItem("auth_token");
  const userRole = localStorage.getItem("user_role");
  
  console.log('AdminDashboard check:', { token, userRole });
  
  if (!token) {
    console.log('No token found, redirecting to login');
    router.push("/login");
    return;
  }
  
  // Vérifier si l'utilisateur est admin
  if (userRole !== 'admin') {
    console.log('User is not admin, role:', userRole);
    alert("Accès refusé. Vous devez être administrateur pour accéder à cette page.");
    router.push("/");
    return;
  }
  
  console.log('Admin access granted');
});
</script>

