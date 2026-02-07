<template>
  <div>
    <HeroSection />
    <Defie />
    <GameCategoriesSection 
      title="PUBG Mobile" 
      categoryName="PUBG Mobile"
      :limit="4"
    />
    <UpcomingMatchesSection />
    <GameCategoriesSection 
      title="Garena Free Fire" 
      categoryName="Garena Free Fire"
      :limit="4"
    />
    <GameCategoriesSection 
      title="Mobile Legends: Bang Bang" 
      categoryName="Mobile Legends"
      :limit="4"
    />
    <EventsSection />
    <Blog />
    <CallToAction />
  </div>
</template>

<script setup lang="ts">
import HeroSection from "../components/Pages/Home/HeroSection.vue";
import EventsSection from "../components/Pages/Home/EventsSection.vue";
import CallToAction from "../components/Pages/Home/CallToAction.vue";
import Blog from "../components/Pages/Home/Blog.vue";
import Defie from "../components/Pages/Home/Defie.vue";
import GameCategoriesSection from "../components/Pages/Home/GameCategoriesSection.vue";
import UpcomingMatchesSection from "../components/Pages/Home/UpcomingMatchesSection.vue";
</script>
