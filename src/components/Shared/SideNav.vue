<template>
  <div class="tw-sidenav">
    <!-- Main nav links -->
    <div class="tw-nav-section">
      <router-link to="/" class="tw-nav-item" exact-active-class="active" @click="$emit('nav-click')">
        <i class="fas fa-home"></i>
        <span>{{ $t('common.home') }}</span>
      </router-link>
      <router-link to="/streams" class="tw-nav-item" active-class="active" @click="$emit('nav-click')">
        <i class="fas fa-video"></i>
        <span>{{ $t('nav.live_streams') }}</span>
      </router-link>
      <router-link to="/championships" class="tw-nav-item" active-class="active" @click="$emit('nav-click')">
        <i class="fas fa-trophy"></i>
        <span>{{ $t('nav.championships') }}</span>
      </router-link>
      <router-link to="/challenges" class="tw-nav-item" active-class="active" @click="$emit('nav-click')">
        <i class="fas fa-fist-raised"></i>
        <span>{{ $t('nav.challenges') }}</span>
      </router-link>
      <router-link to="/arena" class="tw-nav-item" active-class="active" @click="$emit('nav-click')">
        <i class="fas fa-gamepad"></i>
        <span>{{ $t('nav.ebetstream_arena') }}</span>
      </router-link>
      <router-link to="/events" class="tw-nav-item" active-class="active" @click="$emit('nav-click')">
        <i class="fas fa-calendar-day"></i>
        <span>{{ $t('nav.events') }}</span>
      </router-link>
      <router-link to="/clans" class="tw-nav-item" active-class="active" @click="$emit('nav-click')">
        <i class="fas fa-users"></i>
        <span>{{ $t('nav.clans') }}</span>
      </router-link>
    </div>

    <div class="tw-divider"></div>

    <!-- Secondary links -->
    <div class="tw-nav-section">
      <p class="tw-nav-section__label">{{ $t('nav.more') }}</p>
      <router-link v-if="isAgent" to="/agent-dashboard" class="tw-nav-item" active-class="active" @click="$emit('nav-click')">
        <i class="fas fa-user-shield"></i>
        <span>{{ $t('nav.espace_agent') }}</span>
      </router-link>
      <router-link to="/ambassadors" class="tw-nav-item" active-class="active" @click="$emit('nav-click')">
        <i class="fas fa-star"></i>
        <span>{{ $t('nav.ambassadors') }}</span>
      </router-link>
      <router-link to="/promotions" class="tw-nav-item" active-class="active" @click="$emit('nav-click')">
        <i class="fas fa-gift"></i>
        <span>{{ $t('nav.promotions') }}</span>
      </router-link>
      <router-link to="/monetisation" class="tw-nav-item" active-class="active" @click="$emit('nav-click')">
        <i class="fas fa-coins"></i>
        <span>{{ $t('ui.mon_tisation') }}</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { computed } from 'vue';

defineEmits(["nav-click"]);

const isAgent = computed(() => localStorage.getItem('user_role') === 'agent');
</script>

<style scoped>
.tw-sidenav {
  padding-bottom: 16px;
}
</style>
