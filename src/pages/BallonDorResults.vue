<template>
  <div class="page-content-with-space">
    <section class="ballon_dor_section py-6 position-relative overflow-hidden pb-120">
      <div class="container-fluid">
        <!-- Header -->
        <div class="row mb-5">
          <div class="col-12">
            <button class="btn_secondary mb-4" @click="$router.push('/ballon-dor')">
              <i class="fas fa-arrow-left me-2"></i>
              Retour au vote
            </button>
            <div class="defis_content text-center mb-4">
              <span class="hero_badge mb-3 d-inline-block" style="font-size: 1.2rem;">
                🏆 Résultats Ballon d'Or EBETSTREAM
              </span>
              <h2 class="hero_title mb-4">
                <span class="text_gradient">Les Gagnants de la Saison</span>
              </h2>
              <div v-if="season" class="d-flex justify-content-center">
                <span class="badge bg-primary px-4 py-2">
                  <i class="fas fa-calendar me-2"></i>{{ season.name }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <!-- Results -->
        <div v-else-if="results" class="row g-4">
          <!-- Winners -->
          <div class="col-12 mb-5">
            <h3 class="fw-bold text-white mb-4 text-center">
              <i class="fas fa-crown text-warning me-2"></i>
              Les Gagnants
            </h3>
            <div class="row g-4">
              <div 
                v-for="winner in winners" 
                :key="winner.id"
                class="col-md-4"
              >
                <div class="winner_card defi_card n11-bg rounded-8 p-4 text-center">
                  <div class="winner_badge mb-3" style="width: 100px; height: 100px; background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto; box-shadow: 0 10px 30px rgba(255, 215, 0, 0.5);">
                    <i class="fas fa-trophy fa-3x text-dark"></i>
                  </div>
                  <h4 class="fw-bold text-white mb-2">{{ getCategoryLabel(winner.category) }}</h4>
                  <h5 class="fw-bold text-warning mb-3">{{ winner.nominee_name }}</h5>
                  <div class="badge bg-primary mb-2">
                    {{ winner.vote_count }} vote{{ winner.vote_count > 1 ? 's' : '' }}
                  </div>
                  <p v-if="winner.description" class="text-white-50 small mt-3">
                    {{ winner.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Top 3 Players -->
          <div class="col-12">
            <div class="defi_card n11-bg rounded-8 p-4 p-lg-5 mb-4">
              <h3 class="fw-bold text-white mb-4">
                <i class="fas fa-trophy text-warning me-2"></i>
                Top 3 - Meilleurs Joueurs
              </h3>
              <div v-if="topPlayers && topPlayers.length > 0" class="row g-3">
                <div 
                  v-for="(player, index) in topPlayers" 
                  :key="player.id"
                  class="col-md-4"
                >
                  <div class="podium_card p-4 rounded-4 text-center" :class="getPodiumClass(index)">
                    <div class="podium_rank mb-3" style="font-size: 3rem; font-weight: bold; color: white;">
                      {{ index + 1 }}
                    </div>
                    <h5 class="fw-bold mb-2" :class="index === 0 ? 'text-dark' : 'text-white'">
                      {{ player.nominee_name }}
                    </h5>
                    <div class="badge bg-primary mb-2">
                      {{ player.vote_count }} vote{{ player.vote_count > 1 ? 's' : '' }}
                    </div>
                    <p v-if="player.description" class="small mt-2" :class="index === 0 ? 'text-dark' : 'text-white-50'">
                      {{ truncateText(player.description, 80) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Top 3 Clans -->
          <div class="col-12">
            <div class="defi_card n11-bg rounded-8 p-4 p-lg-5 mb-4">
              <h3 class="fw-bold text-white mb-4">
                <i class="fas fa-users text-primary me-2"></i>
                Top 3 - Meilleurs Clans
              </h3>
              <div v-if="topClans && topClans.length > 0" class="row g-3">
                <div 
                  v-for="(clan, index) in topClans" 
                  :key="clan.id"
                  class="col-md-4"
                >
                  <div class="podium_card p-4 rounded-4 text-center" :class="getPodiumClass(index)">
                    <div class="podium_rank mb-3" style="font-size: 3rem; font-weight: bold; color: white;">
                      {{ index + 1 }}
                    </div>
                    <h5 class="fw-bold mb-2" :class="index === 0 ? 'text-dark' : 'text-white'">
                      {{ clan.nominee_name }}
                    </h5>
                    <div class="badge bg-primary mb-2">
                      {{ clan.vote_count }} vote{{ clan.vote_count > 1 ? 's' : '' }}
                    </div>
                    <p v-if="clan.description" class="small mt-2" :class="index === 0 ? 'text-dark' : 'text-white-50'">
                      {{ truncateText(clan.description, 80) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Top 3 Teams -->
          <div class="col-12">
            <div class="defi_card n11-bg rounded-8 p-4 p-lg-5 mb-4">
              <h3 class="fw-bold text-white mb-4">
                <i class="fas fa-users-cog text-success me-2"></i>
                Top 3 - Meilleures Équipes
              </h3>
              <div v-if="topTeams && topTeams.length > 0" class="row g-3">
                <div 
                  v-for="(team, index) in topTeams" 
                  :key="team.id"
                  class="col-md-4"
                >
                  <div class="podium_card p-4 rounded-4 text-center" :class="getPodiumClass(index)">
                    <div class="podium_rank mb-3" style="font-size: 3rem; font-weight: bold; color: white;">
                      {{ index + 1 }}
                    </div>
                    <h5 class="fw-bold mb-2" :class="index === 0 ? 'text-dark' : 'text-white'">
                      {{ team.nominee_name }}
                    </h5>
                    <div class="badge bg-primary mb-2">
                      {{ team.vote_count }} vote{{ team.vote_count > 1 ? 's' : '' }}
                    </div>
                    <p v-if="team.description" class="small mt-2" :class="index === 0 ? 'text-dark' : 'text-white-50'">
                      {{ truncateText(team.description, 80) }}
                    </p>
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
import { ref, onMounted, computed } from "vue";
import apiClient from "@/utils/axios";

const season = ref<any>(null);
const results = ref<any>(null);
const loading = ref(false);
const error = ref("");

const winners = computed(() => {
  return results.value?.winners || [];
});

const topPlayers = computed(() => {
  return results.value?.top_players || [];
});

const topClans = computed(() => {
  return results.value?.top_clans || [];
});

const topTeams = computed(() => {
  return results.value?.top_teams || [];
});

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    player: "Ballon d'Or - Meilleur Joueur",
    clan: "Meilleur Clan",
    team: "Meilleure Équipe",
  };
  return labels[category] || category;
};

const getPodiumClass = (index: number) => {
  if (index === 0) return "bg-warning"; // Gold
  if (index === 1) return "bg-secondary"; // Silver
  return "n11-bg"; // Bronze
};

const truncateText = (text: string | null, maxLength: number) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const loadResults = async () => {
  try {
    loading.value = true;
    error.value = "";

    const response = await apiClient.get("/ballon-dor/results");

    if (response.data.success) {
      results.value = response.data.data;
      season.value = response.data.data.season;
    } else {
      error.value = response.data.message || "Error loading";
    }
  } catch (err: any) {
    console.error("Error loading results:", err);
    error.value = err.response?.data?.message || "Error loading results";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadResults();
});
</script>

<style scoped>
.ballon_dor_section {
  width: 100%;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 24px;
}

.winner_card {
  transition: transform 0.3s ease;
}

.winner_card:hover {
  transform: scale(1.05);
}

.podium_card {
  transition: transform 0.3s ease;
  min-height: 250px;
}

.podium_card:hover {
  transform: translateY(-10px);
}

.text_gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>

