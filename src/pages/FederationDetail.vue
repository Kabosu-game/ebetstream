<template>
  <div class="page-content-with-space">
    <section class="defis_section py-6 position-relative overflow-hidden pb-120">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 gx-0 gx-lg-4">
            <div class="defis__main">
              <!-- Header -->
              <div class="row mb-5">
                <div class="col-12">
                  <button class="btn_secondary mb-4" @click="$router.push('/federations')">
                    <i class="fas fa-arrow-left me-2"></i>
                    Retour aux fédérations
                  </button>

                  <div v-if="loading" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>

                  <div v-else-if="error" class="alert alert-danger">
                    <i class="fas fa-exclamation-circle me-2"></i>{{ error }}
                  </div>

                  <div v-else-if="federation" class="defis_content">
                    <div class="row align-items-center mb-4">
                      <div class="col-md-3 text-center mb-3 mb-md-0">
                        <img 
                          v-if="federation.logo_url" 
                          :src="federation.logo_url" 
                          :alt="federation.name"
                          class="rounded-circle"
                          style="width: 150px; height: 150px; object-fit: cover;"
                        />
                        <div 
                          v-else
                          class="rounded-circle d-inline-flex align-items-center justify-content-center"
                          style="width: 150px; height: 150px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"
                        >
                          <i class="fas fa-building fa-4x text-white"></i>
                        </div>
                      </div>
                      <div class="col-md-9">
                        <div class="d-flex align-items-center gap-3 mb-3 flex-wrap">
                          <span class="hero_badge d-inline-block">
                            🏆 {{ federation.name }}
                          </span>
                          <span 
                            :class="['badge', getStatusClass(federation.status)]"
                          >
                            {{ getStatusLabel(federation.status) }}
                          </span>
                        </div>
                        <h2 class="hero_title mb-3">
                          {{ federation.name }}
                        </h2>
                        <p v-if="federation.description" class="hero_subtitle mb-3">
                          {{ federation.description }}
                        </p>
                        <div class="d-flex flex-wrap gap-4 mb-3">
                          <div v-if="federation.country">
                            <i class="fas fa-map-marker-alt text-warning me-2"></i>
                            <strong>Localisation:</strong> {{ federation.country }}
                            <span v-if="federation.city">, {{ federation.city }}</span>
                          </div>
                          <div v-if="federation.tournaments && federation.tournaments.length">
                            <i class="fas fa-trophy text-primary me-2"></i>
                            <strong>Championnats:</strong> {{ federation.tournaments.length }}
                          </div>
                        </div>
                        <div v-if="federation.website || federation.email || federation.phone" class="d-flex flex-wrap gap-3">
                          <a 
                            v-if="federation.website" 
                            :href="federation.website" 
                            target="_blank"
                            class="btn btn-sm btn-outline-primary"
                          >
                            <i class="fas fa-globe me-2"></i>Site web
                          </a>
                          <a 
                            v-if="federation.email" 
                            :href="`mailto:${federation.email}`"
                            class="btn btn-sm btn-outline-primary"
                          >
                            <i class="fas fa-envelope me-2"></i>Email
                          </a>
                          <a 
                            v-if="federation.phone" 
                            :href="`tel:${federation.phone}`"
                            class="btn btn-sm btn-outline-primary"
                          >
                            <i class="fas fa-phone me-2"></i>Téléphone
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tabs -->
              <div v-if="federation" class="row">
                <div class="col-12">
                  <ul class="nav nav-tabs mb-4 border-0">
                    <li class="nav-item">
                      <button 
                        class="nav-link"
                        :class="{ active: activeTab === 'tournaments' }"
                        @click="activeTab = 'tournaments'"
                      >
                        <i class="fas fa-trophy me-2"></i>Championnats
                      </button>
                    </li>
                    <li class="nav-item">
                      <button 
                        class="nav-link"
                        :class="{ active: activeTab === 'info' }"
                        @click="activeTab = 'info'"
                      >
                        <i class="fas fa-info-circle me-2"></i>Informations
                      </button>
                    </li>
                  </ul>

                  <!-- Tournaments Tab -->
                  <div v-if="activeTab === 'tournaments'" class="tab-content">
                    <div v-if="loadingTournaments" class="text-center py-5">
                      <div class="spinner-border spinner-border-sm text-primary"></div>
                    </div>
                    <div v-else-if="tournaments.length > 0">
                      <!-- Division 1 -->
                      <div v-if="tournamentsByDivision['1'] && tournamentsByDivision['1'].length > 0" class="mb-5">
                        <h4 class="text-white mb-4 fw-bold">
                          <i class="fas fa-trophy text-warning me-2"></i>
                          Division 1
                        </h4>
                        <div class="row g-4">
                          <div 
                            v-for="tournament in tournamentsByDivision['1']" 
                            :key="tournament.id"
                            class="col-md-6 col-lg-4"
                          >
                            <div class="defi_card n11-bg rounded-8 p-4">
                              <h5 class="fw-bold text-white mb-2">{{ tournament.title || tournament.name }}</h5>
                              <div class="mb-3">
                                <span class="badge bg-primary me-2">{{ tournament.game }}</span>
                                <span class="badge bg-warning me-2">Div. 1</span>
                                <span 
                                  :class="['badge', getTournamentStatusClass(tournament.status)]"
                                >
                                  {{ getTournamentStatusLabel(tournament.status) }}
                                </span>
                              </div>
                              <div class="text-white-50 small mb-2">
                                <i class="fas fa-calendar me-2"></i>
                                {{ formatDate(tournament.start_at || tournament.starts_at) }}
                              </div>
                              <div class="text-white-50 small mb-3">
                                <i class="fas fa-users me-2"></i>
                                Type: {{ tournament.type === 'team' ? 'Par équipes' : 'Individuel' }}
                              </div>
                              <div v-if="tournament.entry_fee" class="text-warning mb-3">
                                <i class="fas fa-coins me-2"></i>
                                Frais d'inscription: {{ tournament.entry_fee }} EBT
                              </div>
                              <div v-if="tournament.reward" class="text-success mb-3">
                                <i class="fas fa-trophy me-2"></i>
                                Récompense: {{ tournament.reward }} EBT
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Division 2 -->
                      <div v-if="tournamentsByDivision['2'] && tournamentsByDivision['2'].length > 0" class="mb-5">
                        <h4 class="text-white mb-4 fw-bold">
                          <i class="fas fa-trophy text-info me-2"></i>
                          Division 2
                        </h4>
                        <div class="row g-4">
                          <div 
                            v-for="tournament in tournamentsByDivision['2']" 
                            :key="tournament.id"
                            class="col-md-6 col-lg-4"
                          >
                            <div class="defi_card n11-bg rounded-8 p-4">
                              <h5 class="fw-bold text-white mb-2">{{ tournament.title || tournament.name }}</h5>
                              <div class="mb-3">
                                <span class="badge bg-primary me-2">{{ tournament.game }}</span>
                                <span class="badge bg-info me-2">Div. 2</span>
                                <span 
                                  :class="['badge', getTournamentStatusClass(tournament.status)]"
                                >
                                  {{ getTournamentStatusLabel(tournament.status) }}
                                </span>
                              </div>
                              <div class="text-white-50 small mb-2">
                                <i class="fas fa-calendar me-2"></i>
                                {{ formatDate(tournament.start_at || tournament.starts_at) }}
                              </div>
                              <div class="text-white-50 small mb-3">
                                <i class="fas fa-users me-2"></i>
                                Type: {{ tournament.type === 'team' ? 'Par équipes' : 'Individuel' }}
                              </div>
                              <div v-if="tournament.entry_fee" class="text-warning mb-3">
                                <i class="fas fa-coins me-2"></i>
                                Frais d'inscription: {{ tournament.entry_fee }} EBT
                              </div>
                              <div v-if="tournament.reward" class="text-success mb-3">
                                <i class="fas fa-trophy me-2"></i>
                                Récompense: {{ tournament.reward }} EBT
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Division 3 -->
                      <div v-if="tournamentsByDivision['3'] && tournamentsByDivision['3'].length > 0">
                        <h4 class="text-white mb-4 fw-bold">
                          <i class="fas fa-trophy text-secondary me-2"></i>
                          Division 3
                        </h4>
                        <div class="row g-4">
                          <div 
                            v-for="tournament in tournamentsByDivision['3']" 
                            :key="tournament.id"
                            class="col-md-6 col-lg-4"
                          >
                            <div class="defi_card n11-bg rounded-8 p-4">
                              <h5 class="fw-bold text-white mb-2">{{ tournament.title || tournament.name }}</h5>
                              <div class="mb-3">
                                <span class="badge bg-primary me-2">{{ tournament.game }}</span>
                                <span class="badge bg-secondary me-2">Div. 3</span>
                                <span 
                                  :class="['badge', getTournamentStatusClass(tournament.status)]"
                                >
                                  {{ getTournamentStatusLabel(tournament.status) }}
                                </span>
                              </div>
                              <div class="text-white-50 small mb-2">
                                <i class="fas fa-calendar me-2"></i>
                                {{ formatDate(tournament.start_at || tournament.starts_at) }}
                              </div>
                              <div class="text-white-50 small mb-3">
                                <i class="fas fa-users me-2"></i>
                                Type: {{ tournament.type === 'team' ? 'Par équipes' : 'Individuel' }}
                              </div>
                              <div v-if="tournament.entry_fee" class="text-warning mb-3">
                                <i class="fas fa-coins me-2"></i>
                                Frais d'inscription: {{ tournament.entry_fee }} EBT
                              </div>
                              <div v-if="tournament.reward" class="text-success mb-3">
                                <i class="fas fa-trophy me-2"></i>
                                Récompense: {{ tournament.reward }} EBT
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="text-center py-5">
                      <div class="alert alert-info">
                        <i class="fas fa-info-circle fa-2x mb-3 d-block"></i>
                        <p class="mb-0">Aucun championnat disponible pour le moment</p>
                      </div>
                    </div>
                  </div>

                  <!-- Info Tab -->
                  <div v-if="activeTab === 'info'" class="tab-content">
                    <div class="defi_card n11-bg rounded-8 p-4">
                      <h5 class="fw-bold text-white mb-4">Informations détaillées</h5>
                      <div class="row g-3">
                        <div v-if="federation.address" class="col-md-6">
                          <div class="info_item p-3 rounded-3" style="background: rgba(102, 126, 234, 0.1);">
                            <span class="text-white-50 small d-block mb-1">Adresse</span>
                            <span class="fw-bold text-white">{{ federation.address }}</span>
                          </div>
                        </div>
                        <div v-if="federation.country" class="col-md-6">
                          <div class="info_item p-3 rounded-3" style="background: rgba(102, 126, 234, 0.1);">
                            <span class="text-white-50 small d-block mb-1">Pays</span>
                            <span class="fw-bold text-white">{{ federation.country }}</span>
                          </div>
                        </div>
                        <div v-if="federation.city" class="col-md-6">
                          <div class="info_item p-3 rounded-3" style="background: rgba(102, 126, 234, 0.1);">
                            <span class="text-white-50 small d-block mb-1">Ville</span>
                            <span class="fw-bold text-white">{{ federation.city }}</span>
                          </div>
                        </div>
                        <div v-if="federation.user" class="col-md-6">
                          <div class="info_item p-3 rounded-3" style="background: rgba(102, 126, 234, 0.1);">
                            <span class="text-white-50 small d-block mb-1">Responsable</span>
                            <span class="fw-bold text-white">{{ federation.user.username }}</span>
                          </div>
                        </div>
                        <div v-if="federation.created_at" class="col-md-6">
                          <div class="info_item p-3 rounded-3" style="background: rgba(102, 126, 234, 0.1);">
                            <span class="text-white-50 small d-block mb-1">Date de création</span>
                            <span class="fw-bold text-white">{{ formatDate(federation.created_at) }}</span>
                          </div>
                        </div>
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
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import apiClient from "@/utils/axios";

const route = useRoute();

interface Federation {
  id: number;
  name: string;
  description: string | null;
  logo_url?: string;
  website: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
  status: string;
  user?: any;
  tournaments?: any[];
  created_at: string;
}

const federation = ref<Federation | null>(null);
const tournaments = ref<any[]>([]);
const tournamentsByDivision = ref<any>({
  '1': [],
  '2': [],
  '3': [],
});
const loading = ref(false);
const loadingTournaments = ref(false);
const error = ref("");
const activeTab = ref("tournaments");

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: "En attente",
    approved: "Approuvée",
    rejected: "Rejetée",
    suspended: "Suspendue",
  };
  return labels[status] || status;
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: "bg-warning",
    approved: "bg-success",
    rejected: "bg-danger",
    suspended: "bg-secondary",
  };
  return classes[status] || "bg-secondary";
};

const getTournamentStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    upcoming: "Upcoming",
    ongoing: "Ongoing",
    finished: "Finished",
  };
  return labels[status] || status;
};

const getTournamentStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    upcoming: "bg-info",
    ongoing: "bg-success",
    finished: "bg-secondary",
  };
  return classes[status] || "bg-secondary";
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const loadFederation = async () => {
  try {
    loading.value = true;
    error.value = "";

    const federationId = route.params.id;
    const response = await apiClient.get(`/federations/${federationId}`);

    if (response.data.success) {
      federation.value = response.data.data;
      if (federation.value?.tournaments) {
        tournaments.value = federation.value.tournaments;
      }
    } else {
      error.value = response.data.message || "Fédération non trouvée";
    }
  } catch (err: any) {
    console.error("Error loading federation:", err);
    if (err.response?.status === 404) {
      error.value = "Fédération non trouvée";
    } else {
      error.value = err.response?.data?.message || "Error loading";
    }
  } finally {
    loading.value = false;
  }
};

const loadTournaments = async () => {
  if (!federation.value) return;

  try {
    loadingTournaments.value = true;
    const response = await apiClient.get(`/federations/${federation.value.id}/tournaments`, {
      params: {
        group_by_division: true
      }
    });

    if (response.data.success) {
      if (response.data.grouped_by_division) {
        tournamentsByDivision.value = response.data.data || { '1': [], '2': [], '3': [] };
        // Flatten for backward compatibility
        tournaments.value = [
          ...(tournamentsByDivision.value['1'] || []),
          ...(tournamentsByDivision.value['2'] || []),
          ...(tournamentsByDivision.value['3'] || []),
        ];
      } else {
        tournaments.value = response.data.data.data || response.data.data || [];
      }
    }
  } catch (err: any) {
    console.error("Error loading tournaments:", err);
  } finally {
    loadingTournaments.value = false;
  }
};

onMounted(() => {
  loadFederation();
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

.nav-tabs .nav-link {
  color: rgba(255, 255, 255, 0.7);
  border: none;
  background: transparent;
}

.nav-tabs .nav-link.active {
  color: white;
  background: rgba(102, 126, 234, 0.2);
  border-bottom: 2px solid #667eea;
}

/* Espace visible en haut de la page */
.page-content-with-space {
  padding-top: 90px; /* ajuste selon la hauteur réelle du header */
}
/* responsive */
@media (max-width: 768px) {
  .page-content-with-space {
    padding-top: 60px;
  }
}
</style>

