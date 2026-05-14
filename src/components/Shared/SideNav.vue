<template>
  <div class="tw-sidenav">
    <!-- Main nav links -->
    <div class="tw-nav-section">
      <router-link to="/" class="tw-nav-item" exact-active-class="active" @click="$emit('nav-click')">
        <i class="fas fa-home"></i>
        <span>Home</span>
      </router-link>
      <router-link to="/streams" class="tw-nav-item" active-class="active" @click="$emit('nav-click')">
        <i class="fas fa-video"></i>
        <span>Live Streams</span>
      </router-link>
      <router-link to="/championships" class="tw-nav-item" active-class="active" @click="$emit('nav-click')">
        <i class="fas fa-trophy"></i>
        <span>Championships</span>
      </router-link>
      <router-link to="/challenges" class="tw-nav-item" active-class="active" @click="$emit('nav-click')">
        <i class="fas fa-fist-raised"></i>
        <span>Challenges</span>
      </router-link>
      <router-link to="/arena" class="tw-nav-item" active-class="active" @click="$emit('nav-click')">
        <i class="fas fa-gamepad"></i>
        <span>EBETSTREAM Arena</span>
      </router-link>
      <router-link to="/events" class="tw-nav-item" active-class="active" @click="$emit('nav-click')">
        <i class="fas fa-calendar-day"></i>
        <span>Events</span>
      </router-link>
      <router-link to="/clans" class="tw-nav-item" active-class="active" @click="$emit('nav-click')">
        <i class="fas fa-users"></i>
        <span>Clans</span>
      </router-link>
    </div>

    <div class="tw-divider"></div>

    <!-- Secondary links -->
    <div class="tw-nav-section">
      <p class="tw-nav-section__label">More</p>
      <router-link v-if="isAgent" to="/agent-dashboard" class="tw-nav-item" active-class="active" @click="$emit('nav-click')">
        <i class="fas fa-user-shield"></i>
        <span>Espace Agent</span>
      </router-link>
      <router-link to="/ambassadors" class="tw-nav-item" active-class="active" @click="$emit('nav-click')">
        <i class="fas fa-star"></i>
        <span>Ambassadors</span>
      </router-link>
      <router-link to="/promotions" class="tw-nav-item" active-class="active" @click="$emit('nav-click')">
        <i class="fas fa-gift"></i>
        <span>Promotions</span>
      </router-link>
      <router-link to="/monetisation" class="tw-nav-item" active-class="active" @click="$emit('nav-click')">
        <i class="fas fa-coins"></i>
        <span>Monétisation</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineEmits(["nav-click"]);

const isAgent = computed(() => localStorage.getItem('user_role') === 'agent');
</script>

<style scoped>
.tw-sidenav {
  padding-bottom: 16px;
}
</style>
