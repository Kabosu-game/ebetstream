<template>
  <header class="admin-header">
    <div class="container-fluid">
      <div class="row align-items-center">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center py-3">
            <div class="d-flex align-items-center gap-3">
              <router-link to="/admin" class="text-decoration-none">
                <h4 class="text-white mb-0 fw-bold d-flex align-items-center">
                  <IconShield :size="24" class="me-2 text-warning" />
                  Admin Dashboard
                </h4>
              </router-link>
            </div>
            <div class="d-flex align-items-center gap-3">
              <router-link to="/" class="btn btn-sm btn-outline-light d-flex align-items-center">
                <IconHome :size="16" class="me-1" />
                Site
              </router-link>
              <button class="btn btn-sm btn-outline-danger d-flex align-items-center" @click="logout">
                <IconLogout :size="16" class="me-1" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { IconShield, IconHome, IconLogout } from '@tabler/icons-vue';

const router = useRouter();

const logout = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_role');
  router.push('/login');
};
</script>

<style scoped>
.admin-header {
  background: rgba(26, 31, 58, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 0;
  margin: 0;
  width: 100%;
  max-width: 100%;
}

.admin-header .container-fluid {
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (max-width: 768px) {
  .admin-header .container-fluid {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}
</style>

