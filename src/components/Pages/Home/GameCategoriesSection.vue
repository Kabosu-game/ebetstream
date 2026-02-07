<template>
  <section class="top_matches">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 gx-0 gx-lg-4">
          <div class="top_matches__main">
            <div class="row w-100">
              <div class="col-12">
                <div class="top_matches__title d-flex align-items-center gap-2 mb-4 mb-md-6">
                  <i class="ti ti-gamepad fs-three n5-color"></i>
                  <h3>{{ title }}</h3>
                </div>
                
                <!-- Loading State -->
                <div v-if="loading" class="text-center py-5">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>

                <!-- Games Grid -->
                <div class="top_matches__content" v-else-if="games.length > 0">
                  <div 
                    class="top_matches__cmncard p2-bg p-4 rounded-3 mb-4"
                    v-for="game in games" 
                    :key="game.id"
                    style="cursor: pointer;"
                    @click="viewGame(game.id)"
                  >
                    <div class="row gx-0 gy-xl-0 gy-7">
                      <div class="col-xl-5 col-xxl-4">
                        <div class="top_matches__clubname">
                          <div class="d-flex align-items-center gap-3 mb-3">
                            <div 
                              class="rounded-circle overflow-hidden d-flex align-items-center justify-content-center"
                              style="width: 60px; height: 60px; flex-shrink: 0; border: 2px solid rgba(255, 159, 0, 0.3); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"
                            >
                              <i :class="getGameIcon(game.name)" class="text-white fs-four"></i>
                            </div>
                            <div class="flex-grow-1">
                              <h5 class="fw-bold mb-1 n10-color">{{ game.name }}</h5>
                              <p v-if="game.category" class="fs-eight cpoint mb-0">
                                {{ game.category.name }}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-xl-7 col-xxl-8">
                        <div class="top_matches__cmncard-left">
                          <div v-if="game.description" class="mb-3">
                            <p class="fs-eight cpoint mb-0" style="line-height: 1.5;">
                              {{ game.description.length > 120 ? game.description.substring(0, 120) + '...' : game.description }}
                            </p>
                          </div>
                          <div class="d-flex align-items-center gap-2">
                            <button class="cmn-btn px-4 py-2">
                              View Bets
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Empty State -->
                <div class="top_matches__content" v-else>
                  <div class="text-center py-5">
                    <p class="fs-eight cpoint">No games available in this category.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/utils/axios';

interface Game {
  id: number;
  name: string;
  description?: string;
  icon_url?: string;
  category?: {
    id: number;
    name: string;
  };
}

const props = defineProps<{
  categoryId?: number;
  categoryName?: string;
  title: string;
  limit?: number;
}>();

const router = useRouter();
const games = ref<Game[]>([]);
const loading = ref(false);

const loadGames = async () => {
  try {
    loading.value = true;
    
    // Si un categoryId est fourni, utiliser directement
    if (props.categoryId) {
      const params: any = {
        category_id: props.categoryId,
        active_only: true
      };
      
      const response = await apiClient.get('/games', { params });
      
      if (response.data.success) {
        let gamesList = response.data.data;
        
        // Limiter le nombre de jeux affichés
        if (props.limit) {
          gamesList = gamesList.slice(0, props.limit);
        }
        
        games.value = gamesList;
      }
    } 
    // If a category name is provided, search for the category first
    else if (props.categoryName) {
      // Load all categories
      const categoriesResponse = await apiClient.get('/game-categories');
      
      if (categoriesResponse.data.success) {
        // Find the category that matches the name
        const category = categoriesResponse.data.data.find((cat: any) => 
          cat.name.toLowerCase().includes(props.categoryName!.toLowerCase()) ||
          props.categoryName!.toLowerCase().includes(cat.name.toLowerCase())
        );
        
        if (category) {
          // Load games from this category
          const gamesResponse = await apiClient.get('/games', {
            params: {
              category_id: category.id,
              active_only: true
            }
          });
          
          if (gamesResponse.data.success) {
            let gamesList = gamesResponse.data.data;
            
            // Limit the number of games displayed
            if (props.limit) {
              gamesList = gamesList.slice(0, props.limit);
            }
            
            games.value = gamesList;
          }
        } else {
          // If category is not found, search by game name
          const gamesResponse = await apiClient.get('/games', {
            params: {
              name: props.categoryName,
              active_only: true
            }
          });
          
          if (gamesResponse.data.success) {
            let gamesList = gamesResponse.data.data;
            
            // Limit the number of games displayed
            if (props.limit) {
              gamesList = gamesList.slice(0, props.limit);
            }
            
            games.value = gamesList;
          }
        }
      }
    } 
    // Otherwise, load all active games
    else {
      const response = await apiClient.get('/games', {
        params: { active_only: true }
      });
      
      if (response.data.success) {
        let gamesList = response.data.data;
        
        // Limiter le nombre de jeux affichés
        if (props.limit) {
          gamesList = gamesList.slice(0, props.limit);
        }
        
        games.value = gamesList;
      }
    }
  } catch (err: any) {
    console.error('Error loading games:', err);
  } finally {
    loading.value = false;
  }
};

const viewGame = (gameId: number) => {
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

onMounted(() => {
  loadGames();
});
</script>

<style scoped>
.top_matches__cmncard {
  transition: all 0.3s ease;
  cursor: pointer;
}

.top_matches__cmncard:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255, 159, 0, 0.15);
}
</style>

