<template>
  <div class="tw-page">

    <div v-if="loading" class="tw-empty">
      <div class="spinner"></div>
    </div>

    <div v-else-if="error" class="tw-empty">
      <div class="tw-empty__icon"><i class="fas fa-exclamation-triangle"></i></div>
      <p class="tw-empty__title">{{ error }}</p>
      <button class="tw-btn tw-btn--primary" @click="$router.push('/ambassadors')">
        <i class="fas fa-arrow-left"></i> Retour aux ambassadeurs
      </button>
    </div>

    <template v-else-if="ambassador">
      <button class="tw-btn tw-btn--secondary tw-detail-back" @click="$router.push('/ambassadors')">
        <i class="fas fa-arrow-left"></i> Retour
      </button>

      <div class="tw-page-hero">
        <p class="tw-page-hero__eyebrow">
          <i class="fas fa-user-tie"></i> Profil Ambassadeur
        </p>
        <h1 class="tw-page-hero__title">{{ ambassador.name }}</h1>
        <p class="tw-page-hero__sub">@{{ ambassador.username }}</p>
      </div>

      <div class="tw-grid-2">
        <div class="tw-content-block">
          <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div class="d-flex align-items-center gap-3">
              <div class="tw-detail-avatar">
                <img
                  v-if="ambassador.avatar_url"
                  :src="ambassador.avatar_url"
                  :alt="ambassador.name"
                  class="w-100 h-100"
                  style="object-fit: cover;"
                />
                <div v-else class="w-100 h-100 d-flex align-items-center justify-content-center">
                  <i class="fas fa-user" style="font-size: 2.5rem; color: rgb(var(--n3));"></i>
                </div>
              </div>
              <div>
                <h3 class="mb-2">{{ ambassador.name }}</h3>
                <p class="tw-muted mb-1">@{{ ambassador.username }}</p>
                <p v-if="ambassador.country" class="tw-muted mb-0">
                  <i class="fas fa-map-marker-alt me-1"></i>{{ ambassador.country }}
                </p>
              </div>
            </div>
            <div class="text-center">
              <span class="tw-badge tw-badge--ongoing" style="font-size: 1rem; padding: 8px 16px;">
                {{ ambassador.score }} pts
              </span>
              <p class="tw-muted mt-2 mb-0">Score cette semaine</p>
            </div>
          </div>

          <div v-if="ambassador.bio" class="mb-4">
            <h4 class="mb-3"><i class="fas fa-info-circle me-2 tw-accent"></i>À propos</h4>
            <p style="line-height: 1.8;">{{ ambassador.bio }}</p>
          </div>

          <div class="tw-grid-3">
            <div class="tw-stat-card">
              <span class="tw-stat-card__value">{{ ambassador.score }}</span>
              <span class="tw-stat-card__label">Points</span>
            </div>
            <div class="tw-stat-card">
              <span class="tw-stat-card__value" style="font-size: 18px;">Ambassadeur</span>
              <span class="tw-stat-card__label">Statut</span>
            </div>
            <div class="tw-stat-card">
              <span class="tw-stat-card__value" style="font-size: 18px;">{{ ambassador.country || 'N/A' }}</span>
              <span class="tw-stat-card__label">Pays</span>
            </div>
          </div>
        </div>

        <div>
          <div class="tw-content-block mb-4">
            <h5 class="mb-4"><i class="fas fa-info-circle me-2 tw-accent"></i>Informations</h5>
            <div class="tw-detail-info">
              <div class="tw-detail-info__label">Nom complet</div>
              <div class="tw-detail-info__value">{{ ambassador.name }}</div>
            </div>
            <div class="tw-detail-info">
              <div class="tw-detail-info__label">Nom d'utilisateur</div>
              <div class="tw-detail-info__value">@{{ ambassador.username }}</div>
            </div>
            <div v-if="ambassador.country" class="tw-detail-info">
              <div class="tw-detail-info__label">Pays</div>
              <div class="tw-detail-info__value">
                <i class="fas fa-map-marker-alt me-1"></i>{{ ambassador.country }}
              </div>
            </div>
            <div class="tw-detail-info">
              <div class="tw-detail-info__label">Score</div>
              <div class="tw-detail-info__value tw-accent">{{ ambassador.score }} pts</div>
            </div>
          </div>

          <div class="tw-content-block">
            <h5 class="mb-4"><i class="fas fa-crown me-2 tw-accent"></i>Classement</h5>
            <div class="text-center">
              <div class="tw-detail-rank mb-3">#{{ ambassadorRank }}</div>
              <p class="tw-muted">Position in ambassadors ranking</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
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
  const sorted = [...allAmbassadors.value].sort((a, b) => b.score - a.score);
  const index = sorted.findIndex(a => a.id === ambassador.value!.id);
  return index + 1;
});

const loadAmbassador = async () => {
  try {
    loading.value = true;
    error.value = '';
    const ambassadorId = route.params.id;

    const response = await apiClient.get(`/ambassadors/${ambassadorId}`);
    if (response.data.success) {
      ambassador.value = response.data.data;
    }

    const allResponse = await apiClient.get('/ambassadors', { params: { limit: 100 } });
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
