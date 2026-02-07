<template>
  <div>
    <ul
      class="secend-actives bg1-color rounded-5 d-flex flex-column gap-5 mb-5"
    >
      <li class="active">
        <router-link to="/" class="d-flex align-items-center gap-2"
          ><i class="ti ti-brand-google-home n5-color fs-five"></i>
          Home</router-link
        >
      </li>
      <li class="active">
        <router-link to="/streams" class="d-flex align-items-center gap-2"
          ><i class="ti ti-video n5-color fs-five"></i>
          Streaming Live</router-link
        >
      </li>
    </ul>
    <hr class="py-0 my-0" />
    <h5 class="mb-4 mb-md-6 mt-4 mt-md-6">Game Categories</h5>
    <div v-if="loadingGames" class="text-center py-3">
      <div class="spinner-border spinner-border-sm text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <ul v-else class="aside_namelist d-flex flex-column gap-2 mb-15">
      <li
        v-for="game in allGames"
        :key="game.id"
        class="d-flex align-items-center justify-content-between px-3 py-2 rounded-3 gap-5"
        :class="path == `/games/${game.id}` && 'n11-bg'"
      >
        <router-link
          :to="`/games/${game.id}`"
          class="d-flex align-items-center gap-2"
        >
          <i :class="getGameIcon(game.name)" class="n5-color fs-five"></i>
          {{ game.name }}
        </router-link>

        <button
          v-if="path === `/games/${game.id}`"
          type="button"
          class="g1-color"
        >
          <IconStarFilled
            width="16"
            height="16"
            class="ti ti-star navinStyleClass navinstyle"
          />
        </button>
      </li>
      <li v-if="allGames.length === 0" class="text-white-50 text-center py-2">
        No games available
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { IconStarFilled } from "@tabler/icons-vue";
import { computed, ref, onMounted } from "vue";
import apiClient from "@/utils/axios";

const route = useRoute();
const path = computed(() => route.path);

interface Game {
  id: number;
  name: string;
  slug: string;
  icon_url?: string;
  game_category_id: number;
  position: number;
}

const allGames = ref<Game[]>([]);
const loadingGames = ref(false);

const loadGames = async () => {
  try {
    loadingGames.value = true;
    const response = await apiClient.get('/games?active_only=true');
    if (response.data.success) {
      // Trier les jeux par position puis par nom
      allGames.value = response.data.data
        .sort((a: Game, b: Game) => {
          if (a.position !== b.position) {
            return a.position - b.position;
          }
          return a.name.localeCompare(b.name);
        });
    }
  } catch (err: any) {
    console.error('Error loading games:', err);
    // Don't show error to user for sidebar games, just log it
    if (err.isTimeout || err.isNetworkError) {
      console.warn('Games could not be loaded due to connection issue');
    }
  } finally {
    loadingGames.value = false;
  }
};

const getGameIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('pubg')) return 'ti ti-device-gamepad-2';
  if (lower.includes('free fire') || lower.includes('garena')) return 'ti ti-flame';
  if (lower.includes('mobile legends') || lower.includes('mlbb')) return 'ti ti-swords';
  if (lower.includes('football') || lower.includes('soccer')) return 'ti ti-ball-football';
  if (lower.includes('basketball')) return 'ti ti-ball-basketball';
  if (lower.includes('baseball')) return 'ti ti-ball-baseball';
  if (lower.includes('tennis')) return 'ti ti-ball-tennis';
  if (lower.includes('volleyball')) return 'ti ti-ball-volleyball';
  if (lower.includes('hockey')) return 'ti ti-ball-ice';
  if (lower.includes('cricket')) return 'ti ti-cricket';
  if (lower.includes('rugby')) return 'ti ti-ball-rugby';
  if (lower.includes('boxing') || lower.includes('mma') || lower.includes('fighting')) return 'ti ti-box';
  if (lower.includes('cycling')) return 'ti ti-bike';
  if (lower.includes('darts')) return 'ti ti-target';
  if (lower.includes('handball')) return 'ti ti-ball-handball';
  if (lower.includes('kabaddi')) return 'ti ti-users';
  if (lower.includes('squash')) return 'ti ti-ball-tennis';
  if (lower.includes('wrestling')) return 'ti ti-arm-wrestling';
  if (lower.includes('penalty')) return 'ti ti-ball-football';
  if (lower.includes('futsal')) return 'ti ti-ball-football';
  if (lower.includes('floorball')) return 'ti ti-ball-ice';
  if (lower.includes('bandy')) return 'ti ti-ball-ice';
  if (lower.includes('aussie')) return 'ti ti-ball-rugby';
  if (lower.includes('nba')) return 'ti ti-ball-basketball';
  if (lower.includes('nfl')) return 'ti ti-ball-football';
  if (lower.includes('fifa') || lower.includes('volta')) return 'ti ti-ball-football';
  if (lower.includes('rocket league')) return 'ti ti-car';
  if (lower.includes('shooter') || lower.includes('cod')) return 'ti ti-gun';
  if (lower.includes('ecricket')) return 'ti ti-cricket';
  if (lower.includes('efighting')) return 'ti ti-box';
  if (lower.includes('erocket')) return 'ti ti-car';
  if (lower.includes('eshooter')) return 'ti ti-gun';
  return 'ti ti-gamepad';
};

onMounted(() => {
  loadGames();
});
</script>

<style scoped></style>
