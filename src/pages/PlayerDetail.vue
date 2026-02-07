<template>
  <div class="page-content-with-space">
    <!-- Player Details Section -->
    <section class="defis_section py-6 position-relative overflow-hidden pb-120">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 gx-0 gx-lg-4">
            <div class="defis__main">
              
              <!-- Loading State -->
              <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                  <span class="visually-hidden">Chargement...</span>
                </div>
              </div>

              <!-- Error State -->
              <div v-else-if="error" class="text-center py-5">
                <div class="alert alert-danger">
                  {{ error }}
                </div>
                <button class="btn_primary mt-3" @click="$router.push('/players')">
                  <i class="fas fa-arrow-left me-2"></i>
                  Back to Players
                </button>
              </div>

              <!-- Player Details -->
              <div v-else-if="player">
                <!-- Header -->
                <div class="row mb-5">
                  <div class="col-12">
                    <button class="btn_secondary mb-4" @click="$router.push('/players')">
                      <i class="fas fa-arrow-left me-2"></i>
                      Retour
                    </button>
                    
                    <div class="defis_content">
                      <span class="hero_badge mb-3 d-inline-block">
                        <i class="fas fa-trophy me-2"></i>Profil Joueur
                      </span>
                      <h2 class="hero_title mb-4">
                        <span class="text_gradient">{{ player.name }}</span>
                      </h2>
                      <p class="hero_subtitle">
                        @{{ player.username }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Main Content -->
                <div class="row g-4">
                  <!-- Left Column - Player Info -->
                  <div class="col-lg-8">
                    <div class="defi_card n11-bg rounded-8 p-4 p-lg-6 mb-4">
                      <!-- Rank and Score -->
                      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                        <div class="d-flex align-items-center gap-3">
                          <div class="player_avatar_large rounded-circle overflow-hidden" 
                               style="width: 100px; height: 100px; flex-shrink: 0; border: 3px solid rgba(255, 255, 255, 0.3);">
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
                              <i class="fas fa-user text-white" style="font-size: 3rem;"></i>
                            </div>
                          </div>
                          <div>
                            <h3 class="fw-bold text-white mb-2">
                              {{ player.name }}
                              <span v-if="player.certifications && player.certifications.includes('Ebetstream')" class="badge bg-success ms-2">
                                <i class="fas fa-certificate me-1"></i>Certifié
                              </span>
                            </h3>
                            <p class="text-white mb-1" style="opacity: 0.8;">
                              @{{ player.username }}
                              <span v-if="player.certifications && player.certifications.includes('Ebetstream')" class="badge bg-success ms-2" style="font-size: 0.7rem;">
                                <i class="fas fa-certificate me-1"></i>Certifié
                              </span>
                            </p>
                            <p v-if="player.country" class="text-white small mb-0" style="opacity: 0.8;">
                              <i class="fas fa-map-marker-alt me-1"></i>{{ player.country }}
                            </p>
                          </div>
                        </div>
                        <div class="text-center">
                          <div class="badge bg-warning text-dark px-4 py-3 mb-2" style="font-size: 1.2rem;">
                            {{ player.score }} pts
                          </div>
                          <p class="text-white small mb-0" style="opacity: 0.8;">Score cette semaine</p>
                        </div>
                      </div>

                      <!-- Bio Section -->
                      <div v-if="player.bio" class="mb-4">
                        <h4 class="fw-bold mb-3 text-white">
                          <i class="fas fa-info-circle me-2"></i>À propos
                        </h4>
                        <p class="text-white" style="opacity: 0.9; line-height: 1.8; font-size: 1.05rem;">
                          {{ player.bio }}
                        </p>
                      </div>

                      <!-- Stats Section -->
                      <div class="row g-3 mt-4">
                        <div class="col-md-4">
                          <div class="stat_card p-3 rounded-4 text-center">
                            <div class="stat_icon mb-2">
                              <i class="fas fa-trophy text-warning" style="font-size: 2rem;"></i>
                            </div>
                            <div class="stat_value fw-bold text-white fs-4">{{ player.wins || 0 }}</div>
                            <div class="stat_label text-white small" style="opacity: 0.8;">Victoires</div>
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="stat_card p-3 rounded-4 text-center">
                            <div class="stat_icon mb-2">
                              <i class="fas fa-times-circle text-danger" style="font-size: 2rem;"></i>
                            </div>
                            <div class="stat_value fw-bold text-white fs-4">{{ player.losses || 0 }}</div>
                            <div class="stat_label text-white small" style="opacity: 0.8;">Losses</div>
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="stat_card p-3 rounded-4 text-center">
                            <div class="stat_icon mb-2">
                              <i class="fas fa-chart-line text-success" style="font-size: 2rem;"></i>
                            </div>
                            <div class="stat_value fw-bold text-white fs-4">{{ (player.ratio || 0).toFixed(2) }}</div>
                            <div class="stat_label text-white small" style="opacity: 0.8;">Ratio</div>
                          </div>
                        </div>
                      </div>

                      <!-- Challenges Stats -->
                      <div v-if="player.stats" class="mt-4">
                        <h4 class="fw-bold mb-3 text-white">
                          <i class="fas fa-gamepad me-2"></i>Challenge Statistics
                        </h4>
                        <div class="row g-3">
                          <div class="col-md-4">
                            <div class="stat_card p-3 rounded-4 text-center">
                              <div class="stat_value fw-bold text-white fs-5">{{ player.stats.total_challenges || 0 }}</div>
                              <div class="stat_label text-white small" style="opacity: 0.8;">Total Challenges</div>
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div class="stat_card p-3 rounded-4 text-center">
                              <div class="stat_value fw-bold text-success fs-5">{{ player.stats.won_challenges || 0 }}</div>
                              <div class="stat_label text-white small" style="opacity: 0.8;">Won Challenges</div>
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div class="stat_card p-3 rounded-4 text-center">
                              <div class="stat_value fw-bold text-danger fs-5">{{ player.stats.lost_challenges || 0 }}</div>
                              <div class="stat_label text-white small" style="opacity: 0.8;">Lost Challenges</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Right Column - Additional Info -->
                  <div class="col-lg-4">
                    <div class="defi_card n11-bg rounded-8 p-4 mb-4">
                      <h5 class="fw-bold mb-4 text-white">
                        <i class="fas fa-info-circle me-2"></i>Informations
                      </h5>
                      
                      <div class="info_item mb-3">
                        <div class="text-white small mb-1" style="opacity: 0.7;">Nom</div>
                        <div class="text-white fw-semibold">{{ player.name }}</div>
                      </div>

                      <div class="info_item mb-3">
                        <div class="text-white small mb-1" style="opacity: 0.7;">Nom d'utilisateur</div>
                        <div class="text-white fw-semibold">@{{ player.username }}</div>
                      </div>

                      <div v-if="player.country" class="info_item mb-3">
                        <div class="text-white small mb-1" style="opacity: 0.7;">Pays</div>
                        <div class="text-white fw-semibold">
                          <i class="fas fa-map-marker-alt me-1"></i>{{ player.country }}
                        </div>
                      </div>

                      <div class="info_item mb-3">
                        <div class="text-white small mb-1" style="opacity: 0.7;">Score</div>
                        <div class="text-warning fw-bold fs-5">{{ player.score }} pts</div>
                      </div>

                      <div class="info_item mb-3">
                        <div class="text-white small mb-1" style="opacity: 0.7;">Score Global</div>
                        <div class="text-white fw-semibold">{{ player.global_score || 0 }} pts</div>
                      </div>
                    </div>

                    <div class="defi_card n11-bg rounded-8 p-4">
                      <h5 class="fw-bold mb-4 text-white">
                        <i class="fas fa-trophy me-2"></i>Classement
                      </h5>
                      <div class="text-center">
                        <div class="rank_display mb-3">
                          <span class="rank_number" style="font-size: 4rem; color: #FFD700; font-weight: 800;">
                            #{{ player.rank || 'N/A' }}
                          </span>
                        </div>
                        <p class="text-white small" style="opacity: 0.8;">
                          Position dans le classement
                        </p>
                      </div>
                    </div>
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
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import apiClient from '@/utils/axios';
import { fixImageUrl } from '@/utils/imageFixer';

interface Player {
  id: number;
  name: string;
  username: string;
  score: number;
  avatar_url?: string;
  country?: string | null;
  bio?: string | null;
  wins?: number;
  losses?: number;
  ratio?: number;
  global_score?: number;
  rank?: number;
  certifications?: string[] | null;
  stats?: {
    total_challenges: number;
    won_challenges: number;
    lost_challenges: number;
  };
}

const route = useRoute();
const player = ref<Player | null>(null);
const loading = ref(false);
const error = ref('');

// Fonction pour corriger les URLs d'avatar
const correctAvatarUrl = (url: string): string => {
  return fixImageUrl(url);
};

const loadPlayer = async () => {
  try {
    loading.value = true;
    error.value = '';
    const playerId = route.params.id;

    const response = await apiClient.get(`/top-players/${playerId}`);

    if (response.data.success) {
      player.value = response.data.data;
    }
  } catch (err: any) {
    console.error('Error loading player:', err);
    if (err.response?.status === 404) {
      error.value = 'Joueur non trouvé';
    } else {
      error.value = 'Erreur lors du chargement du joueur';
    }
  } finally {
    loading.value = false;
  }
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  // Remplacer par un avatar par défaut si l'image ne charge pas
  const playerName = img.alt || 'User';
  img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(playerName)}&background=667eea&color=fff&size=200`;
};

onMounted(() => {
  loadPlayer();
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

.defi_card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
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

.stat_card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease;
}

.stat_card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.1);
}

.info_item {
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info_item:last-child {
  border-bottom: none;
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
  
  .container-fluid {
    margin-left: 0 !important;
  }
  
  .defis__main {
    margin-left: 0 !important;
  }
}
</style>

