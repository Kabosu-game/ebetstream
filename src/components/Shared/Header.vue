<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import Language from "./Language.vue";
import SideNav from "./SideNav.vue";

import logo from "@/assets/images/logoebet.png";

const { t } = useI18n();
const router = useRouter();

const sidebarOpen = ref(false);
const userMenuOpen = ref(false);
const searchQuery = ref("");

const isAuthenticated = computed(() => !!localStorage.getItem("auth_token"));
const isAdmin = computed(() => localStorage.getItem("user_role") === "admin");
const isAgent = computed(() => localStorage.getItem("user_role") === "agent");
const username = computed(() => localStorage.getItem("username") || "Me");
const userInitial = computed(() => (username.value[0] || "U").toUpperCase());

const logout = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_role");
  localStorage.removeItem("username");
  window.location.href = "/";
};

const toggleSidebar = () => { sidebarOpen.value = !sidebarOpen.value; };
const closeSidebar  = () => { sidebarOpen.value = false; };
const toggleUserMenu = (e: Event) => { e.stopPropagation(); userMenuOpen.value = !userMenuOpen.value; };
const closeUserMenu  = () => { userMenuOpen.value = false; };

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: "/streams", query: { q: searchQuery.value.trim() } });
    closeSidebar();
  }
};

const handleOutside = (e: MouseEvent) => {
  const el = e.target as HTMLElement;
  if (sidebarOpen.value && !el.closest(".left-nav-area") && !el.closest(".tw-mobile-toggle"))
    sidebarOpen.value = false;
  if (userMenuOpen.value && !el.closest(".hdr-user"))
    userMenuOpen.value = false;
};

onMounted(() => document.body.addEventListener("click", handleOutside));
onBeforeUnmount(() => document.body.removeEventListener("click", handleOutside));
</script>

<template>
  <!-- ===== SIDEBAR ===== -->
  <aside class="left-nav-area" :class="{ 'mobile-open': sidebarOpen }">
    <div class="logo-area">
      <router-link class="navbar-brand" to="/" @click="closeSidebar">
        <img class="logo" :src="logo" alt="eBetStream" />
      </router-link>
    </div>
    <div class="nav_aside">
      <div class="nav-clsoeicon">
        <button class="tw-icon-btn" @click="closeSidebar" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <SideNav @nav-click="closeSidebar" />
    </div>
  </aside>

  <div v-if="sidebarOpen" class="sidebar-overlay" @click="closeSidebar"></div>

  <!-- ===== TOP BAR ===== -->
  <header class="header-section2">
    <nav class="navbar">

      <!-- Hamburger (mobile) -->
      <button class="navbar-toggler tw-mobile-toggle" @click.stop="toggleSidebar" aria-label="Menu">
        <i class="fas fa-bars"></i>
      </button>

      <!-- Search -->
      <div class="tw-search">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('common.search', 'Search…')"
          @keyup.enter="handleSearch"
        />
        <i class="ti ti-search search-icon"></i>
      </div>

      <!-- Right actions -->
      <div class="right-area">

        <!-- Language (hidden on very small) -->
        <Language class="hdr-lang" />

        <!-- NOT authenticated -->
        <template v-if="!isAuthenticated">
          <router-link to="/login" class="cmn-btn second-alt hdr-btn-text">
            {{ t('common.login') }}
          </router-link>
          <router-link to="/create-account" class="cmn-btn hdr-btn-text">
            {{ t('common.signUp') }}
          </router-link>
          <!-- Mobile: icon-only login -->
          <router-link to="/login" class="hdr-icon-btn hdr-btn-icon-only" aria-label="Login">
            <i class="fas fa-user"></i>
          </router-link>
        </template>

        <!-- Authenticated user -->
        <template v-else>
          <!-- Desktop buttons -->
          <router-link
            v-if="isAgent"
            to="/agent-dashboard"
            class="cmn-btn hdr-btn-text"
          >Espace Agent</router-link>
          <router-link
            v-else-if="!isAdmin"
            to="/dashboard"
            class="cmn-btn hdr-btn-text"
          >{{ t('common.dashboard') }}</router-link>
          <router-link
            v-else
            to="/admin"
            class="cmn-btn hdr-btn-text"
          >Admin</router-link>

          <button class="cmn-btn second-alt hdr-btn-text" @click="logout">
            {{ t('common.logout') }}
          </button>

          <!-- Mobile/tablet: compact avatar + dropdown -->
          <div class="hdr-user" @click.stop="toggleUserMenu">
            <div class="hdr-user__avatar">{{ userInitial }}</div>
            <!-- Dropdown -->
            <div class="hdr-user__dropdown" :class="{ open: userMenuOpen }">
              <router-link
                v-if="isAgent"
                to="/agent-dashboard"
                class="hdr-user__item"
                @click="closeUserMenu"
              >
                <i class="fas fa-user-shield"></i>
                <span>Espace Agent</span>
              </router-link>
              <router-link
                v-else-if="!isAdmin"
                to="/dashboard"
                class="hdr-user__item"
                @click="closeUserMenu"
              >
                <i class="fas fa-th-large"></i>
                <span>{{ t('common.dashboard') }}</span>
              </router-link>
              <router-link
                v-else
                to="/admin"
                class="hdr-user__item"
                @click="closeUserMenu"
              >
                <i class="fas fa-shield-alt"></i>
                <span>Admin</span>
              </router-link>
              <div class="hdr-user__divider"></div>
              <button class="hdr-user__item hdr-user__item--danger" @click="logout">
                <i class="fas fa-sign-out-alt"></i>
                <span>{{ t('common.logout') }}</span>
              </button>
            </div>
          </div>
        </template>
      </div>
    </nav>
  </header>
</template>

<style scoped>
/* Desktop buttons visible, avatar hidden */
.hdr-btn-text      { display: inline-flex; }
.hdr-btn-icon-only { display: none; }
.hdr-user          { display: none; }

/* Tablet (≤900px): hide text buttons, show avatar dropdown */
@media (max-width: 900px) {
  .hdr-btn-text      { display: none !important; }
  .hdr-btn-icon-only { display: none !important; }
  .hdr-user          { display: block; position: relative; cursor: pointer; }
}

/* Mobile (≤575px): same but also icon-only login */
@media (max-width: 575px) {
  .hdr-lang          { display: none !important; }
  .hdr-btn-icon-only { display: inline-flex; }
}

/* User avatar circle */
.hdr-user__avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgb(var(--g1));
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(var(--g1), 0.4);
  transition: border-color 0.2s;
  user-select: none;
}

.hdr-user:hover .hdr-user__avatar,
.hdr-user .open + .hdr-user__avatar {
  border-color: rgb(var(--g1));
}

/* Dropdown panel */
.hdr-user__dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 200px;
  background: rgb(var(--p2));
  border: 1px solid rgb(var(--n2));
  border-radius: 8px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.45);
  z-index: 999;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-6px);
  transition: opacity 0.18s ease, transform 0.18s ease, visibility 0.18s;

  &.open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
}

/* Dropdown items */
.hdr-user__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 500;
  color: rgb(var(--n5));
  text-decoration: none;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: rgba(var(--n8), 0.07);
    color: rgb(var(--n8));
  }

  svg { flex-shrink: 0; color: rgb(var(--n3)); }
}

.hdr-user__item--danger {
  color: rgb(var(--r1));
  &:hover { background: rgba(var(--r1), 0.08); color: rgb(var(--r1)); }
  svg { color: rgb(var(--r1)); }
}

.hdr-user__divider {
  height: 1px;
  background: rgb(var(--n2));
  margin: 2px 0;
}

/* Icon-only login button */
.hdr-icon-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(var(--n8), 0.08);
  color: rgb(var(--n8));
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: background 0.15s;
  border: 1px solid rgba(var(--n8), 0.15);

  &:hover { background: rgba(var(--n8), 0.15); }
}
</style>
