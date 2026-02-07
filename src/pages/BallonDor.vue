<template>
  <div class="page-content-with-space">
    <!-- Section Ballon d'Or -->
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
                      🏆 Ballon d'Or EBETSTREAM
                    </span>
                    <h2 class="hero_title mb-4">
                      Vote for <span class="text_gradient">Season Awards</span><br />
                      and celebrate excellence!
                    </h2>
                    <p class="hero_subtitle mb-5">
                      Vote to reward the best players, clans and teams of the season.
                      Your voice matters to celebrate excellence on EBETSTREAM.
                    </p>
                    <div v-if="season" class="hero_actions d-flex flex-wrap gap-3 mb-3">
                      <span class="badge bg-primary px-4 py-2">
                        <i class="fas fa-calendar me-2"></i>{{ season.name }}
                      </span>
                      <span 
                        v-if="season && season.isVotingOpen && season.isVotingOpen()" 
                        class="badge bg-success px-4 py-2"
                      >
                        <i class="fas fa-vote-yea me-2"></i>Voting Open
                      </span>
                      <span 
                        v-else-if="season.status === 'completed'" 
                        class="badge bg-warning px-4 py-2"
                      >
                        <i class="fas fa-trophy me-2"></i>Season Completed
                      </span>
                      <span v-else class="badge bg-secondary px-4 py-2">
                        <i class="fas fa-clock me-2"></i>Voting Closed
                      </span>
                    </div>
                    <router-link 
                      v-if="season && season.status === 'completed'"
                      to="/ballon-dor/results"
                      class="btn_secondary text-decoration-none"
                    >
                      <i class="fas fa-chart-bar me-2"></i>
                      <span>View Results</span>
                    </router-link>
                  </div>
                </div>

                <!-- Colonne image / carte -->
                <div class="col-lg-6 col-md-5 d-none d-md-block">
                  <div class="defis_image" data-aos="fade-left">
                    <div class="floating_card card_defis">
                      <div class="card_icon">🏆</div>
                      <div class="card_content">
                        <span class="card_label">Awards</span>
                        <span class="card_value">Season End</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Loading State -->
              <div v-if="loading" class="row mt-5">
                <div class="col-12 text-center py-5">
                  <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>

              <!-- Error State -->
              <div v-else-if="error" class="row mt-5">
                <div class="col-12">
                  <div class="alert alert-warning text-center">
                    <i class="fas fa-exclamation-circle me-2"></i>{{ error }}
                  </div>
                </div>
              </div>

              <!-- Categories -->
              <div v-else-if="nominations" class="row mt-5 g-4">
                <!-- Ballon d'Or (Meilleur Joueur) -->
                <div class="col-12">
                  <div class="defi_card n11-bg rounded-8 p-4 p-lg-5 mb-4">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                      <h3 class="fw-bold text-white mb-0">
                        <i class="fas fa-trophy text-warning me-2"></i>
                        Ballon d'Or - Best Player
                      </h3>
                    </div>
                    
                    <div v-if="loadingNominations" class="text-center py-3">
                      <div class="spinner-border spinner-border-sm text-primary"></div>
                    </div>
                    
                    <div v-else-if="nominations.player && nominations.player.length > 0" class="row g-3">
                      <div 
                        v-for="(nomination, index) in nominations.player" 
                        :key="nomination.id"
                        class="col-md-6 col-lg-4"
                      >
                        <div 
                          class="defi_card p-4 rounded-4 h-100 d-flex flex-column"
                          :class="{
                            'bg-warning': nomination.is_winner,
                            'n11-bg': !nomination.is_winner
                          }"
                        >
                          <div class="d-flex align-items-center gap-3 mb-3">
                            <div class="rank_badge" style="width: 40px; height: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                              {{ index + 1 }}
                            </div>
                            <div class="flex-grow-1">
                              <h5 class="fw-bold mb-0" :class="nomination.is_winner ? 'text-dark' : 'text-white'">
                                {{ nomination.nominee_name }}
                              </h5>
                              <div class="d-flex align-items-center gap-2 mt-1">
                                <span 
                                  class="badge"
                                  :class="nomination.is_winner ? 'bg-dark' : 'bg-primary'"
                                >
                                  {{ nomination.vote_count }} vote{{ nomination.vote_count > 1 ? 's' : '' }}
                                </span>
                                <span v-if="nomination.is_winner" class="badge bg-success">
                                  <i class="fas fa-crown me-1"></i>Winner
                                </span>
                              </div>
                            </div>
                          </div>
                          <p v-if="nomination.description" class="small mb-2 flex-grow-1" :class="nomination.is_winner ? 'text-dark' : 'text-white-50'">
                            {{ truncateText(nomination.description, 100) }}
                          </p>
                          <button 
                            v-if="canVotePlayer && !hasVotedPlayer && season && season.isVotingOpen"
                            class="btn_primary w-100 py-2 mt-auto"
                            @click="voteForNomination(nomination.id, 'player')"
                            :disabled="voting"
                          >
                            <i class="fas fa-vote-yea me-2"></i>Vote
                          </button>
                          <div v-else-if="hasVotedPlayer && myVotes.player && myVotes.player.nomination_id === nomination.id" class="alert alert-success py-2 mb-0 mt-auto">
                            <i class="fas fa-check-circle me-2"></i>You voted
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="text-center py-5">
                      <p class="text-white-50">No nominations at the moment</p>
                    </div>
                  </div>
                </div>

                <!-- Meilleur Clan -->
                <div class="col-12">
                  <div class="defi_card n11-bg rounded-8 p-4 p-lg-5 mb-4">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                      <h3 class="fw-bold text-white mb-0">
                        <i class="fas fa-users text-primary me-2"></i>
                        Best Clan of the Season
                      </h3>
                    </div>
                    
                    <div v-if="loadingNominations" class="text-center py-3">
                      <div class="spinner-border spinner-border-sm text-primary"></div>
                    </div>
                    
                    <div v-else-if="nominations.clan && nominations.clan.length > 0" class="row g-3">
                      <div 
                        v-for="(nomination, index) in nominations.clan" 
                        :key="nomination.id"
                        class="col-md-6 col-lg-4"
                      >
                        <div 
                          class="defi_card p-4 rounded-4 h-100 d-flex flex-column"
                          :class="{
                            'bg-warning': nomination.is_winner,
                            'n11-bg': !nomination.is_winner
                          }"
                        >
                          <div class="d-flex align-items-center gap-3 mb-3">
                            <div class="rank_badge" style="width: 40px; height: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                              {{ index + 1 }}
                            </div>
                            <div class="flex-grow-1">
                              <h5 class="fw-bold mb-0" :class="nomination.is_winner ? 'text-dark' : 'text-white'">
                                {{ nomination.nominee_name }}
                              </h5>
                              <div class="d-flex align-items-center gap-2 mt-1">
                                <span 
                                  class="badge"
                                  :class="nomination.is_winner ? 'bg-dark' : 'bg-primary'"
                                >
                                  {{ nomination.vote_count }} vote{{ nomination.vote_count > 1 ? 's' : '' }}
                                </span>
                                <span v-if="nomination.is_winner" class="badge bg-success">
                                  <i class="fas fa-crown me-1"></i>Winner
                                </span>
                              </div>
                            </div>
                          </div>
                          <p v-if="nomination.description" class="small mb-2 flex-grow-1" :class="nomination.is_winner ? 'text-dark' : 'text-white-50'">
                            {{ truncateText(nomination.description, 100) }}
                          </p>
                          <button 
                            v-if="canVoteClan && !hasVotedClan && season && season.isVotingOpen"
                            class="btn_primary w-100 py-2 mt-auto"
                            @click="voteForNomination(nomination.id, 'clan')"
                            :disabled="voting"
                          >
                            <i class="fas fa-vote-yea me-2"></i>Vote
                          </button>
                          <div v-else-if="hasVotedClan && myVotes.clan && myVotes.clan.nomination_id === nomination.id" class="alert alert-success py-2 mb-0 mt-auto">
                            <i class="fas fa-check-circle me-2"></i>You voted
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="text-center py-5">
                      <p class="text-white-50">No nominations at the moment</p>
                    </div>
                  </div>
                </div>

                <!-- Meilleure Équipe -->
                <div class="col-12">
                  <div class="defi_card n11-bg rounded-8 p-4 p-lg-5 mb-4">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                      <h3 class="fw-bold text-white mb-0">
                        <i class="fas fa-users-cog text-success me-2"></i>
                        Best Team of the Season
                      </h3>
                    </div>
                    
                    <div v-if="loadingNominations" class="text-center py-3">
                      <div class="spinner-border spinner-border-sm text-primary"></div>
                    </div>
                    
                    <div v-else-if="nominations.team && nominations.team.length > 0" class="row g-3">
                      <div 
                        v-for="(nomination, index) in nominations.team" 
                        :key="nomination.id"
                        class="col-md-6 col-lg-4"
                      >
                        <div 
                          class="defi_card p-4 rounded-4 h-100 d-flex flex-column"
                          :class="{
                            'bg-warning': nomination.is_winner,
                            'n11-bg': !nomination.is_winner
                          }"
                        >
                          <div class="d-flex align-items-center gap-3 mb-3">
                            <div class="rank_badge" style="width: 40px; height: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                              {{ index + 1 }}
                            </div>
                            <div class="flex-grow-1">
                              <h5 class="fw-bold mb-0" :class="nomination.is_winner ? 'text-dark' : 'text-white'">
                                {{ nomination.nominee_name }}
                              </h5>
                              <div class="d-flex align-items-center gap-2 mt-1">
                                <span 
                                  class="badge"
                                  :class="nomination.is_winner ? 'bg-dark' : 'bg-primary'"
                                >
                                  {{ nomination.vote_count }} vote{{ nomination.vote_count > 1 ? 's' : '' }}
                                </span>
                                <span v-if="nomination.is_winner" class="badge bg-success">
                                  <i class="fas fa-crown me-1"></i>Winner
                                </span>
                              </div>
                            </div>
                          </div>
                          <p v-if="nomination.description" class="small mb-2 flex-grow-1" :class="nomination.is_winner ? 'text-dark' : 'text-white-50'">
                            {{ truncateText(nomination.description, 100) }}
                          </p>
                          <button 
                            v-if="canVoteTeam && !hasVotedTeam && season && season.isVotingOpen"
                            class="btn_primary w-100 py-2 mt-auto"
                            @click="voteForNomination(nomination.id, 'team')"
                            :disabled="voting"
                          >
                            <i class="fas fa-vote-yea me-2"></i>Vote
                          </button>
                          <div v-else-if="hasVotedTeam && myVotes.team && myVotes.team.nomination_id === nomination.id" class="alert alert-success py-2 mb-0 mt-auto">
                            <i class="fas fa-check-circle me-2"></i>You voted
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="text-center py-5">
                      <p class="text-white-50">No nominations at the moment</p>
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
import { ref, onMounted, computed } from "vue";
import apiClient from "@/utils/axios";

interface Season {
  id: number;
  name: string;
  status: string;
  isVotingOpen: () => boolean;
}

interface Nominations {
  player: any[];
  clan: any[];
  team: any[];
}

const season = ref<Season | null>(null);
const nominations = ref<Nominations | null>(null);
const myVotes = ref<any>({ player: null, clan: null, team: null });
const loading = ref(false);
const loadingNominations = ref(false);
const error = ref("");
const voting = ref(false);

const canVotePlayer = ref(false);
const canVoteClan = ref(false);
const canVoteTeam = ref(false);

const hasVotedPlayer = computed(() => myVotes.value.player !== null);
const hasVotedClan = computed(() => myVotes.value.clan !== null);
const hasVotedTeam = computed(() => myVotes.value.team !== null);

const truncateText = (text: string | null, maxLength: number) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const loadSeason = async () => {
  try {
    loading.value = true;
    error.value = "";

    const response = await apiClient.get("/ballon-dor/current-season");

    if (response.data.success) {
      season.value = response.data.data;
      // Add isVotingOpen method
      if (season.value) {
        season.value.isVotingOpen = () => {
          if (season.value?.status !== 'voting') return false;
          const now = new Date();
          const start = (season.value as any).voting_start_date ? new Date((season.value as any).voting_start_date) : null;
          const end = (season.value as any).voting_end_date ? new Date((season.value as any).voting_end_date) : null;
          if (start && now < start) return false;
          if (end && now > end) return false;
          return true;
        };
      }
    } else {
      error.value = "No current season";
    }
  } catch (err: any) {
    console.error("Error loading season:", err);
    if (err.response?.status !== 404) {
      error.value = err.response?.data?.message || "Error loading season";
    }
  } finally {
    loading.value = false;
  }
};

const loadNominations = async () => {
  if (!season.value) return;

  try {
    loadingNominations.value = true;
    const response = await apiClient.get("/ballon-dor/nominations");

    if (response.data.success) {
      nominations.value = response.data.data;
    }
  } catch (err: any) {
    console.error("Error loading nominations:", err);
  } finally {
    loadingNominations.value = false;
  }
};

const loadMyVotes = async () => {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    const response = await apiClient.get("/ballon-dor/my-votes");

    if (response.data.success) {
      myVotes.value = response.data.data;
    }
  } catch (err: any) {
    console.error("Error loading votes:", err);
  }
};

const checkCanVote = async () => {
  try {
    const [playerRes, clanRes, teamRes] = await Promise.all([
      apiClient.get("/ballon-dor/can-vote/player"),
      apiClient.get("/ballon-dor/can-vote/clan"),
      apiClient.get("/ballon-dor/can-vote/team"),
    ]);

    canVotePlayer.value = playerRes.data.can_vote || false;
    canVoteClan.value = clanRes.data.can_vote || false;
    canVoteTeam.value = teamRes.data.can_vote || false;
  } catch (err: any) {
    console.error("Error checking vote eligibility:", err);
  }
};

const voteForNomination = async (nominationId: number, category: string) => {
  if (!season.value) return;

  try {
    voting.value = true;

    const response = await apiClient.post("/ballon-dor/vote", {
      season_id: season.value.id,
      nomination_id: nominationId,
      category: category,
    });

    if (response.data.success) {
      alert("Vote recorded successfully!");
      await loadNominations();
      await loadMyVotes();
    } else {
      alert(response.data.message || "Error voting");
    }
  } catch (err: any) {
    console.error("Error voting:", err);
    alert(err.response?.data?.message || "Error voting");
  } finally {
    voting.value = false;
  }
};

onMounted(async () => {
  await loadSeason();
  if (season.value) {
    await Promise.all([
      loadNominations(),
      loadMyVotes(),
      checkCanVote(),
    ]);
  }
});
</script>

<style scoped>
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
