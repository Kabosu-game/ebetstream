<template>
  <div class="page-content-with-space">
    <!-- Top Players Section -->
    <section class="defis_section py-6 position-relative overflow-hidden pb-120">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 gx-0 gx-lg-4">
            <div class="defis__main">
              <!-- Header Section -->
              <div class="row h-100 align-items-center mb-5">
                <div class="col-lg-6 col-md-7">
                  <div class="defis_content" data-aos="fade-right">
                    <span class="hero_badge mb-3 d-inline-block">
                      <i class="fas fa-trophy me-2"></i>Top Players
                    </span>
                    <h2 class="hero_title mb-4">
                      Top <span class="text_gradient">Players</span><br />
                      this week
                    </h2>
                    <p class="hero_subtitle mb-5">
                      Discover the ranking of the most performing players and get inspired for your next bets.
                    </p>
                  </div>
                </div>

                <!-- Colonne image / carte -->
                <div class="col-lg-6 col-md-5 d-none d-md-block">
                  <div class="defis_image" data-aos="fade-left">
                    <div class="floating_card card_defis">
                      <div class="card_icon">🏆</div>
                      <div class="card_content">
                        <span class="card_label">Top 10</span>
                        <span class="card_value">{{ players.length }} Players</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Filters -->
              <div class="d-flex gap-3 mb-5 flex-wrap justify-content-center">
                <button 
                  class="btn_primary"
                  :class="{ 'active': filterPeriod === 'week' }"
                  @click="filterPeriod = 'week'; loadPlayers()"
                >
                  This Week
                </button>
                <button 
                  class="btn_secondary"
                  :class="{ 'active': filterPeriod === 'month' }"
                  @click="filterPeriod = 'month'; loadPlayers()"
                >
                  This Month
                </button>
                <button 
                  class="btn_secondary"
                  :class="{ 'active': filterPeriod === 'all' }"
                  @click="filterPeriod = 'all'; loadPlayers()"
                >
                  All Time
                </button>
              </div>

              <!-- Players List -->
              <div v-if="loading" class="row mt-5">
                <div class="col-12 text-center py-5">
                  <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
              <div v-else-if="error" class="row mt-5">
                <div class="col-12">
                  <div class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>{{ error }}
                  </div>
                </div>
              </div>
              <div v-else-if="players.length > 0" class="row mt-5 g-4">
                <div v-for="(player, index) in players" :key="player.id" class="col-12 col-md-6 col-lg-4">
                  <div class="defi_card n11-bg rounded-8 p-4 h-100 d-flex flex-column" 
                       style="cursor: pointer;" 
                       @click="viewPlayer(player.id)">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <span class="fw-bold" style="font-size: 1.5rem; color: #FFD700;">
                        #{{ index + 1 }}
                      </span>
                      <span class="badge bg-warning text-dark px-3 py-2 fw-bold">
                        {{ player.score }} pts
                      </span>
                    </div>
                    
                    <div class="d-flex align-items-center gap-3 mb-3">
                      <div class="rounded-circle overflow-hidden" 
                           style="width: 60px; height: 60px; border: 2px solid rgba(255, 255, 255, 0.3); flex-shrink: 0;">
                        <img 
                          v-if="player.avatar_url" 
                          :src="correctAvatarUrl(player.avatar_url)" 
                          :alt="player.name"
                          class="w-100 h-100"
                          style="object-fit: cover;"
                          @error="handleImageError($event)"
                        />
                        <div v-else class="w-100 h-100 d-flex align-items-center justify-content-center" 
                             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                          <i class="fas fa-user text-white fs-4"></i>
                        </div>
                      </div>
                      <div class="flex-grow-1">
                        <h5 class="fw-bold mb-1 text-white">
                          {{ player.name }}
                          <span v-if="player.certifications && player.certifications.includes('Ebetstream')" class="badge bg-success ms-2" style="font-size: 0.7rem;">
                            <i class="fas fa-certificate me-1"></i>Certifié
                          </span>
                        </h5>
                        <p class="text-white small mb-0" style="opacity: 0.8;">
                          @{{ player.username }}
                          <span v-if="player.certifications && player.certifications.includes('Ebetstream')" class="badge bg-success ms-2" style="font-size: 0.65rem;">
                            <i class="fas fa-certificate me-1"></i>Certifié
                          </span>
                        </p>
                      </div>
                    </div>

                    <div v-if="player.country" class="mb-3">
                      <span class="text-white small" style="opacity: 0.8;">
                        <i class="fas fa-map-marker-alt me-1"></i>{{ player.country }}
                      </span>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-auto">
                      <div>
                        <span class="text-white small" style="opacity: 0.8;">
                          <i class="fas fa-trophy me-1 text-warning"></i>{{ player.wins || 0 }} Victoires
                        </span>
                      </div>
                      <div>
                        <span class="text-white small" style="opacity: 0.8;">
                          Ratio: {{ (player.ratio || 0).toFixed(2) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="row mt-5">
                <div class="col-12 text-center py-5">
                  <p class="text-white" style="opacity: 0.7;">Aucun joueur disponible pour le moment.</p>
                </div>
              </div>
              <!-- /Players List -->
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/utils/axios';
import { fixImageUrl } from '@/utils/imageFixer';

interface Player {
  id: number;
  name: string;
  username: string;
  score: number;
  avatar_url?: string;
  country?: string | null;
  wins?: number;
  losses?: number;
  ratio?: number;
  certifications?: string[] | null;
}

const router = useRouter();
const players = ref<Player[]>([]);
const loading = ref(false);
const error = ref('');
const filterPeriod = ref('week');

// Fonction pour corriger les URLs d'avatar
const correctAvatarUrl = (url: string): string => {
  return fixImageUrl(url);
};

const loadPlayers = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    const response = await apiClient.get('/top-players', {
      params: { limit: 100, period: filterPeriod.value }
    });

    if (response.data.success) {
      players.value = response.data.data || [];
    } else {
      error.value = 'Error loading players';
    }
  } catch (err: any) {
    console.error('Error loading players:', err);
    
    // Gestion d'erreur améliorée
    if (err.isNetworkError || err.code === 'ERR_NETWORK') {
      error.value = 'Impossible de se connecter à l\'API. Vérifiez que le serveur est démarré.';
    } else if (err.response?.status === 404) {
      error.value = 'Route API introuvable. Vérifiez la configuration de l\'API.';
    } else if (err.response?.data?.message) {
      error.value = err.response.data.message;
    } else {
      error.value = 'Error loading players';
    }
  } finally {
    loading.value = false;
  }
};

const viewPlayer = (id: number) => {
  router.push(`/players/${id}`);
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  // Remplacer par un avatar par défaut si l'image ne charge pas
  const playerName = img.alt || 'User';
  img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(playerName)}&background=667eea&color=fff&size=200`;
};

onMounted(() => {
  loadPlayers();
});
</script>

<style scoped>
.defis_section {
  width: 100%;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 24px;
}

.text_gradient {
  background: linear-gradient(90deg, #FF9F00, #FF9F00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn_primary {
  background-color: #FF9F00;
  color: #000;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  transition: 0.3s;
  cursor: pointer;
}
.btn_primary:hover {
  background-color: #FF9F00;
  transform: translateY(-2px);
}
.btn_primary.active {
  background-color: #FF9F00;
  box-shadow: 0 4px 15px rgba(255, 159, 0, 0.4);
}

.btn_secondary {
  background: transparent;
  border: 2px solid #FF9F00;
  color: #FF9F00;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  transition: 0.3s;
  cursor: pointer;
}
.btn_secondary:hover {
  background-color: #FF9F00;
  color: #000;
}
.btn_secondary.active {
  background-color: #FF9F00;
  color: #000;
}

.floating_card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.card_icon {
  font-size: 3rem;
}

.card_content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card_label {
  font-size: 0.9rem;
  opacity: 0.9;
  font-weight: 500;
}

.card_value {
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
}

.defi_card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.defi_card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 159, 0, 0.3);
}

.hero_badge {
  background: rgba(255, 159, 0, 0.2);
  color: #FF9F00;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.hero_title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  line-height: 1.2;
}

.hero_subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

.page-content-with-space {
  padding-top: 90px;
}

@media (max-width: 768px) {
  .page-content-with-space {
    padding-top: 60px;
  }
  
  .hero_title {
    font-size: 1.8rem;
  }
}
</style>

