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

              <!-- Game Content -->
              <div v-else-if="game">
                <!-- Redirect to game detail page -->
                <div class="text-center py-5">
                  <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Redirection...</span>
                  </div>
                  <p class="mt-3 text-white">Redirecting to {{ game.name }}...</p>
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
  description?: string;
  icon_url?: string;
  image_url?: string;
  category?: {
    id: number;
    name: string;
  };
}

const game = ref<Game | null>(null);
const loading = ref(false);
const error = ref('');

// Map des noms de jeux depuis l'URL vers les noms dans la base de données
const gameNameMap: Record<string, string> = {
  'pubg-mobile': 'PUBG Mobile',
  'garena-free-fire': 'Garena Free Fire',
  'mobile-legends': 'Mobile Legends: Bang Bang',
  'mobile-legends-bang-bang': 'Mobile Legends: Bang Bang',
};

const loadGame = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    // Récupérer le slug depuis le path de la route (enlever le /)
    const path = route.path.replace(/^\//, '');
    const gameSlug = path;
    
    // Utiliser le mapping ou convertir le slug en nom
    let gameName = gameNameMap[gameSlug];
    
    if (!gameName) {
      // Convertir le slug en nom (ex: "pubg-mobile" -> "PUBG Mobile")
      gameName = gameSlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }
    
    console.log('Searching for game:', gameName);
    
    // Rechercher le jeu par nom
        const response = await apiClient.get('/games', {
      params: {
        name: gameName,
        active_only: true
      }
    });
    
    if (response.data.success && response.data.data.length > 0) {
      // Prendre le premier résultat (le plus proche)
      game.value = response.data.data[0];
      console.log('Game found:', game.value);
      // Rediriger vers la page de détail du jeu
      if (game.value) {
        router.replace(`/games/${game.value.id}`);
      }
    } else {
      error.value = `Game "${gameName}" not found. Please make sure the game exists in the database with this exact name.`;
    }
  } catch (err: any) {
    console.error('Error loading game:', err);
    error.value = err.response?.data?.message || 'Error loading game';
  } finally {
    loading.value = false;
  }
};

watch(() => route.path, () => {
  loadGame();
});

onMounted(() => {
  loadGame();
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

