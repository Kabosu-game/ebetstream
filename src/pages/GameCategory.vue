<template>
  <div class="page-content-with-space">
    <section class="defis_section py-6 position-relative overflow-hidden pb-120">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 gx-0 gx-lg-4">
            <div class="defis__main">
              <!-- Loading State -->
              <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <!-- Error State -->
              <div v-else-if="error" class="text-center py-5">
                <div class="alert alert-danger">
                  {{ error }}
                </div>
                <button class="btn_primary mt-3" @click="$router.push('/')">
                  <i class="fas fa-arrow-left me-2"></i>
                  Back to Home
                </button>
              </div>

              <!-- Category Content -->
              <div v-else-if="category">
                <!-- Header -->
                <div class="row mb-5">
                  <div class="col-12">
                    <button class="btn_secondary mb-4" @click="$router.push('/')">
                      <i class="fas fa-arrow-left me-2"></i>
                      Back
                    </button>

                    <div class="defis_content">
                      <div class="d-flex align-items-center gap-3 mb-3">
                        <div v-if="category.icon_url" class="category_icon_large rounded-circle overflow-hidden"
                             style="width: 60px; height: 60px; border: 2px solid rgba(255, 255, 255, 0.3);">
                          <img :src="category.icon_url" :alt="category.name" class="w-100 h-100" style="object-fit: cover;" />
                        </div>
                        <div>
                          <span class="hero_badge mb-3 d-inline-block">
                            <i class="fas fa-gamepad me-2"></i>Category
                          </span>
                          <h2 class="hero_title mb-4">
                            <span class="text_gradient">{{ category.name }}</span>
                          </h2>
                        </div>
                      </div>
                      <p v-if="category.description" class="hero_subtitle">
                        {{ category.description }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Games List -->
                <div v-if="games.length > 0" class="row g-4">
                  <div v-for="game in games" :key="game.id" class="col-12 col-md-6 col-lg-4">
                    <div class="defi_card n11-bg rounded-8 p-4 h-100 d-flex flex-column"
                         style="cursor: pointer;"
                         @click="viewGame(game.id)">
                      <div class="d-flex align-items-center gap-3 mb-3">
                        <div class="game_icon rounded-circle overflow-hidden d-flex align-items-center justify-content-center"
                             style="width: 60px; height: 60px; flex-shrink: 0; border: 2px solid rgba(255, 255, 255, 0.3); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                          <i :class="getGameIcon(game.name)" class="text-white fs-4"></i>
                        </div>
                        <div class="flex-grow-1">
                          <h5 class="fw-bold mb-1 text-white">{{ game.name }}</h5>
                        </div>
                      </div>
                      <div v-if="game.description" class="mb-3">
                        <p class="text-white small mb-0" style="opacity: 0.8; line-height: 1.5;">
                          {{ game.description }}
                        </p>
                      </div>
                      <button class="btn_primary btn-sm mt-auto align-self-start">
                        View Bets
                      </button>
                    </div>
                  </div>
                </div>
                <div v-else class="row mt-5">
                  <div class="col-12 text-center py-5">
                    <p class="text-white" style="opacity: 0.7;">No games available in this category at the moment.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/utils/axios';

const route = useRoute();
const router = useRouter();

interface Game {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon_url?: string;
  image_url?: string;
}

interface GameCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon_url?: string;
  games?: Game[];
}

const category = ref<GameCategory | null>(null);
const games = ref<Game[]>([]);
const loading = ref(false);
const error = ref('');

const loadCategory = async () => {
  try {
    loading.value = true;
    error.value = '';
    // Reset data before loading new category
    category.value = null;
    games.value = [];
    const categoryId = route.params.id;
    
    const response = await apiClient.get(`/game-categories/${categoryId}`);
    
    if (response.data.success) {
      category.value = response.data.data;
      games.value = category.value?.games || [];
    }
  } catch (err: any) {
    console.error('Error loading category:', err);
    error.value = err.response?.data?.message || 'Error loading category';
  } finally {
    loading.value = false;
  }
};

const viewGame = (gameId: number) => {
  // Navigate to game bets page
  router.push(`/games/${gameId}`);
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.style.display = 'none';
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

// Watch for route changes to reload category data
watch(() => route.params.id, (newId, oldId) => {
  if (newId !== oldId) {
    loadCategory();
  }
}, { immediate: false });

onMounted(() => {
  loadCategory();
});
</script>

<style scoped>
.defi_card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  transition: transform 0.3s ease;
}

.defi_card:hover {
  transform: translateY(-5px);
}
</style>



