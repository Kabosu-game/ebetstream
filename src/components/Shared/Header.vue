<script setup lang="ts">
import { IconAdjustmentsHorizontal, IconX } from "@tabler/icons-vue";
import { onBeforeUnmount, onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import NavItem from "./NavItem.vue";
import Language from "./Language.vue";
import SideNav from "./SideNav.vue";

import logo from "@/assets/images/logoebet.png";

const { t } = useI18n();

const router = useRouter();
const isCardExpanded = ref(false);
const isMiddleExpanded = ref(false);

// Check if user is authenticated
const isAuthenticated = computed(() => {
  const token = localStorage.getItem("auth_token");
  return !!token;
});

// Check if user is admin
const isAdmin = computed(() => {
  const userRole = localStorage.getItem("user_role");
  return userRole === 'admin';
});

const logout = () => {
  localStorage.removeItem("auth_token");
  router.push("/");
  // Reload to update the header
  window.location.reload();
};

const toggleCard = () => {
  isCardExpanded.value = !isCardExpanded.value;
};

const toggleMiddle = () => {
  isMiddleExpanded.value = !isMiddleExpanded.value;
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (isCardExpanded.value && !target.closest(".navbar-toggler")) {
    isCardExpanded.value = false;
  }
};

const handleClickOutsideMiddle = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (isMiddleExpanded.value && !target.closest(".left-nav-icon")) {
    isMiddleExpanded.value = false;
  }
};

onMounted(() => {
  document.body.addEventListener("click", handleClickOutside);
  document.body.addEventListener("click", handleClickOutsideMiddle);
});

onBeforeUnmount(() => {
  document.body.removeEventListener("click", handleClickOutside);
  document.body.removeEventListener("click", handleClickOutsideMiddle);
});
</script>

<template>
  <header class="header-section2 header-section">
    <nav
      class="navbar navbar-expand-lg position-relative py-md-3 py-lg-6 workready"
    >
      <div
        class="collapse navbar-collapse justify-content-between hide"
        :class="{ show: isCardExpanded }"
        id="navbar-content"
      >
        <ul
          class="navbar-nav2fixed navbar-nav d-flex align-items-lg-center gap-4 gap-sm-5 py-2 py-lg-0 align-self-center p2-bg"
        >
          <NavItem />

          <li v-if="!isAuthenticated" class="dropdown show-dropdown d-block d-sm-none">
            <div class="d-flex align-items-center flex-wrap gap-3">
              <router-link
                to="/login"
                class="cmn-btn second-alt px-xxl-11 rounded-2"
                >{{ $t('common.login') }}</router-link
              >
              <router-link to="/create-acount" class="cmn-btn px-xxl-11"
                >{{ $t('common.signUp') }}</router-link
              >
            </div>
          </li>
          <li v-else-if="!isAdmin" class="dropdown show-dropdown d-block d-sm-none">
            <div class="d-flex align-items-center flex-wrap gap-3">
              <router-link
                to="/dashboard"
                class="cmn-btn px-xxl-11 rounded-2"
                >{{ $t('common.dashboard') }}</router-link
              >
              <button
                @click="logout"
                class="cmn-btn second-alt px-xxl-11 rounded-2"
                >{{ $t('common.logout') }}</button
              >
            </div>
          </li>
          <li v-else class="dropdown show-dropdown d-block d-sm-none">
            <div class="d-flex align-items-center flex-wrap gap-3">
              <router-link
                to="/admin"
                class="cmn-btn px-xxl-11 rounded-2"
                >Admin</router-link
              >
              <button
                @click="logout"
                class="cmn-btn second-alt px-xxl-11 rounded-2"
                >Logout</button
              >
            </div>
          </li>
        </ul>
      </div>
      <div
        class="right-area custom-pos position-relative d-flex gap-0 gap-lg-7 align-items-center me-5 me-xl-10"
      >
        <Language />
        <template v-if="!isAuthenticated">
          <router-link
            to="/login"
            class="cmn-btn second-alt px-xxl-11 rounded-2 me-5 me-lg-0 d-none d-sm-block"
            >{{ $t('common.login') }}</router-link
          >
          <router-link
            to="/create-acount"
            class="cmn-btn d-none px-xxl-11 d-sm-block d-lg-none d-xl-block"
            >{{ $t('common.signUp') }}</router-link
          >
        </template>
        <template v-else-if="!isAdmin">
          <router-link
            to="/dashboard"
            class="cmn-btn px-xxl-11 rounded-2 me-5 me-lg-0 d-none d-sm-block"
            >{{ $t('common.dashboard') }}</router-link
          >
          <button
            @click="logout"
            class="cmn-btn second-alt px-xxl-11 rounded-2 d-none d-sm-block d-lg-none d-xl-block"
            >{{ $t('common.logout') }}</button
          >
        </template>
        <template v-else>
          <router-link
            to="/admin"
            class="cmn-btn px-xxl-11 rounded-2 me-5 me-lg-0 d-none d-sm-block"
            >Admin</router-link
          >
          <button
            @click="logout"
            class="cmn-btn second-alt px-xxl-11 rounded-2 d-none d-sm-block d-lg-none d-xl-block"
            >Logout</button
          >
        </template>
      </div>
      <button
        @click="toggleCard"
        class="navbar-toggler mt-1 mt-sm-2 mt-lg-0"
        type="button"
        data-bs-toggle="collapse"
        aria-label="Navbar Toggler"
        data-bs-target="#navbar-content"
        aria-expanded="true"
        id="nav-icon3"
      >
        <span></span><span></span><span></span><span></span>
      </button>
    </nav>
    <div id="div10" class="navigation left-nav-area box3 position-fixed">
      <div
        class="logo-area slide-toggle3 trader-list position-fixed top-0 d-flex align-items-center justify-content-center pt-6 pt-md-8 gap-sm-4 gap-md-5 gap-lg-7 px-4 px-lg-8"
      >
        <router-link
          class="navbar-brand d-center text-center gap-1 gap-lg-2 ms-lg-4"
          to="/"
        >
          <img class="logo" width="180" height="46" :src="logo" alt="logoebet" />
        </router-link>
      </div>
      <div
        class="nav_aside px-5 p2-bg hide"
        :class="{ show: isMiddleExpanded }"
      >
        <div class="nav-clsoeicon d-flex justify-content-end">
          <IconX
            @click="toggleMiddle"
            width="32"
            height="32"
            class="ti ti-x left-nav-icon n8-color order-2 order-lg-0 d-block d-lg-none fs-three"
          />
        </div>
        <SideNav />
      </div>
    </div>
  </header>
  <button
    @click="toggleMiddle"
    type="button"
    class="middle-iconfixed position-fixed top-50 start-0 left-nav-icon"
  >
    <IconAdjustmentsHorizontal
      width="38"
      height="38"
      class="ti ti-adjustments-horizontal n8-color d-block d-lg-none fs-two"
    />
  </button>
</template>

<style scoped></style>
