<template>
  <div class="tw-home">
    <HeroSection />
    <UpcomingMatchesSection />
    <Defie />
    <Top10 />
    <EventsSection />
  </div>
</template>

<script setup lang="ts">
import HeroSection from '@/components/Pages/Home/HeroSection.vue';
import UpcomingMatchesSection from '@/components/Pages/Home/UpcomingMatchesSection.vue';
import Defie from '@/components/Pages/Home/Defie.vue';
import Top10 from '@/components/Pages/Home/Top10.vue';
import EventsSection from '@/components/Pages/Home/EventsSection.vue';
</script>

<style scoped>
.tw-home {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
