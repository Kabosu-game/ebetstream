<template>
  <div class="page-content-with-space">
    <!-- Section Détails Ambassadeur -->
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
                <button class="btn_primary mt-3" @click="$router.push('/ambassadors')">
                  <i class="fas fa-arrow-left me-2"></i>
                  Back to Ambassadors
                </button>
              </div>

              <!-- Ambassador Details -->
              <div v-else-if="ambassador">
                <!-- Header -->
                <div class="row mb-5">
                  <div class="col-12">
                    <button class="btn_secondary mb-4" @click="$router.push('/ambassadors')">
                      <i class="fas fa-arrow-left me-2"></i>
                      Retour
                    </button>
                    
                    <div class="defis_content">
                      <span class="hero_badge mb-3 d-inline-block">
                        <i class="fas fa-user-tie me-2"></i>Profil Ambassadeur
                      </span>
                      <h2 class="hero_title mb-4">
                        <span class="text_gradient">{{ ambassador.name }}</span>
                      </h2>
                      <p class="hero_subtitle">
                        @{{ ambassador.username }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Main Content -->
                <div class="row g-4">
                  <!-- Left Column - Ambassador Info -->
                  <div class="col-lg-8">
                    <div class="defi_card n11-bg rounded-8 p-4 p-lg-6 mb-4">
                      <!-- Rank and Score -->
                      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                        <div class="d-flex align-items-center gap-3">
                          <div class="ambassador_avatar_large rounded-circle overflow-hidden" 
                               style="width: 100px; height: 100px; flex-shrink: 0; border: 3px solid rgba(255, 255, 255, 0.3);">
                            <img 
                              v-if="ambassador.avatar_url" 
                              :src="ambassador.avatar_url" 
                              :alt="ambassador.name"
                              class="w-100 h-100"
                              style="object-fit: cover;"
                            />
                            <div v-else class="w-100 h-100 d-flex align-items-center justify-content-center" 
                                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                              <i class="fas fa-user text-white" style="font-size: 3rem;"></i>
                            </div>
                          </div>
                          <div>
                            <h3 class="fw-bold text-white mb-2">{{ ambassador.name }}</h3>
                            <p class="text-white mb-1" style="opacity: 0.8;">@{{ ambassador.username }}</p>
                            <p v-if="ambassador.country" class="text-white small mb-0" style="opacity: 0.8;">
                              <i class="fas fa-map-marker-alt me-1"></i>{{ ambassador.country }}
                            </p>
                          </div>
                        </div>
                        <div class="text-center">
                          <div class="badge bg-warning text-dark px-4 py-3 mb-2" style="font-size: 1.2rem;">
                            {{ ambassador.score }} pts
                          </div>
                          <p class="text-white small mb-0" style="opacity: 0.8;">Score cette semaine</p>
                        </div>
                      </div>

                      <!-- Bio Section -->
                      <div v-if="ambassador.bio" class="mb-4">
                        <h4 class="fw-bold mb-3 text-white">
                          <i class="fas fa-info-circle me-2"></i>À propos
                        </h4>
                        <p class="text-white" style="opacity: 0.9; line-height: 1.8; font-size: 1.05rem;">
                          {{ ambassador.bio }}
                        </p>
                      </div>

                      <!-- Stats Section -->
                      <div class="row g-3 mt-4">
                        <div class="col-md-4">
                          <div class="stat_card p-3 rounded-4 text-center">
                            <div class="stat_icon mb-2">
                              <i class="fas fa-trophy text-warning" style="font-size: 2rem;"></i>
                            </div>
                            <div class="stat_value fw-bold text-white fs-4">{{ ambassador.score }}</div>
                            <div class="stat_label text-white small" style="opacity: 0.8;">Points</div>
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="stat_card p-3 rounded-4 text-center">
                            <div class="stat_icon mb-2">
                              <i class="fas fa-star text-warning" style="font-size: 2rem;"></i>
                            </div>
                            <div class="stat_value fw-bold text-white fs-4">Ambassadeur</div>
                            <div class="stat_label text-white small" style="opacity: 0.8;">Statut</div>
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="stat_card p-3 rounded-4 text-center">
                            <div class="stat_icon mb-2">
                              <i class="fas fa-globe text-warning" style="font-size: 2rem;"></i>
                            </div>
                            <div class="stat_value fw-bold text-white fs-6">{{ ambassador.country || 'N/A' }}</div>
                            <div class="stat_label text-white small" style="opacity: 0.8;">Pays</div>
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
                        <div class="text-white small mb-1" style="opacity: 0.7;">Nom complet</div>
                        <div class="text-white fw-semibold">{{ ambassador.name }}</div>
                      </div>

                      <div class="info_item mb-3">
                        <div class="text-white small mb-1" style="opacity: 0.7;">Nom d'utilisateur</div>
                        <div class="text-white fw-semibold">@{{ ambassador.username }}</div>
                      </div>

                      <div v-if="ambassador.country" class="info_item mb-3">
                        <div class="text-white small mb-1" style="opacity: 0.7;">Pays</div>
                        <div class="text-white fw-semibold">
                          <i class="fas fa-map-marker-alt me-1"></i>{{ ambassador.country }}
                        </div>
                      </div>

                      <div class="info_item mb-3">
                        <div class="text-white small mb-1" style="opacity: 0.7;">Score</div>
                        <div class="text-warning fw-bold fs-5">{{ ambassador.score }} pts</div>
                      </div>
                    </div>

                    <div class="defi_card n11-bg rounded-8 p-4">
                      <h5 class="fw-bold mb-4 text-white">
                        <i class="fas fa-crown me-2"></i>Classement
                      </h5>
                      <div class="text-center">
                        <div class="rank_display mb-3">
                          <span class="rank_number" style="font-size: 4rem; color: #FFD700; font-weight: 800;">
                            #{{ ambassadorRank }}
                          </span>
                        </div>
                        <p class="text-white small" style="opacity: 0.8;">
                          Position in ambassadors ranking
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
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import apiClient from '@/utils/axios';

interface Ambassador {
  id: number;
  name: string;
  username: string;
  score: number;
  avatar?: string | null;
  avatar_url?: string;
  country?: string | null;
  bio?: string | null;
  position?: number;
}

const route = useRoute();
const ambassador = ref<Ambassador | null>(null);
const allAmbassadors = ref<Ambassador[]>([]);
const loading = ref(false);
const error = ref('');

const ambassadorRank = computed(() => {
  if (!ambassador.value || allAmbassadors.value.length === 0) return 0;
  
  // Trier par score décroissant et trouver la position
  const sorted = [...allAmbassadors.value].sort((a, b) => b.score - a.score);
  const index = sorted.findIndex(a => a.id === ambassador.value!.id);
  return index + 1;
});

const loadAmbassador = async () => {
  try {
    loading.value = true;
    error.value = '';
    const ambassadorId = route.params.id;

    // Charger l'ambassadeur spécifique
    const response = await apiClient.get(`/ambassadors/${ambassadorId}`);

    if (response.data.success) {
      ambassador.value = response.data.data;
    }

    // Charger tous les ambassadeurs pour calculer le rang
    const allResponse = await apiClient.get('/ambassadors', {
      params: { limit: 100 }
    });

    if (allResponse.data.success) {
      allAmbassadors.value = allResponse.data.data;
    }
  } catch (err: any) {
    console.error('Error loading ambassador:', err);
    if (err.response?.status === 404) {
      error.value = 'Ambassadeur non trouvé';
    } else {
      error.value = 'Erreur lors du chargement de l\'ambassadeur';
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadAmbassador();
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

