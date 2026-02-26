<template>
  <!-- Section EBETSTREAM Championship - Scheduled Matches -->
  <section class="top10_section py-6 position-relative overflow-hidden">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 gx-0 gx-lg-4">
          <div class="top10__main">
            <div class="row w-100">
              <div class="col-12">
                <div class="row h-100 align-items-center">
                  <!-- Colonne texte -->
                  <div class="col-lg-6 col-md-7">
                    <div class="top10_content" data-aos="fade-right">
                      <span class="hero_badge mb-3 d-inline-block">
                        <i class="fas fa-calendar-alt me-2"></i>Upcoming Matches
                      </span>
                      <h2 class="hero_title mb-4">
                        Structured championships by <span class="text_gradient">divisions</span><br />
                        Play. Challenge. Rise.
                      </h2>
                      <p class="hero_subtitle mb-5">
                        Follow the upcoming matches across all divisions. Watch the best teams compete and see who will rise to the top.
                      </p>
                      <div class="hero_actions d-flex flex-wrap gap-3">
                        <router-link to="/championships" class="btn_primary text-decoration-none">
                          <span>View All Championships</span>
                          <i class="fas fa-arrow-right ms-2"></i>
                        </router-link>
                      </div>
                    </div>
                  </div>

                  <!-- Colonne image / illustration -->
                  <div class="col-lg-6 col-md-5 d-none d-md-block">
                    <div class="top10_image" data-aos="fade-left">
                      <div class="floating_card card_top10">
                        <div class="card_icon">🏆</div>
                        <div class="card_content">
                          <span class="card_label">Scheduled</span>
                          <span class="card_value">Matches</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Tabs and Match List -->
                  <div class="col-12 mt-5">
                    <div v-if="loading" class="text-center py-5">
                      <div class="spinner-border text-warning" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                    <div v-else-if="error" class="alert alert-warning" role="alert">
                      {{ error }}
                    </div>
                    <div v-else-if="allMatches.length === 0" class="text-center py-5">
                      <p class="text-muted mb-2">No scheduled matches available at the moment.</p>
                      <p class="text-muted small">Matches are scheduled by administrators and will appear here once programmed.</p>
                    </div>
                    <div v-else>
                      <!-- Tabs Navigation -->
                      <ul class="nav nav-tabs mb-4 border-0 championships-tabs">
                        <li class="nav-item">
                          <button 
                            class="nav-link"
                            :class="{ 'active': activeTab === 'division1' }"
                            @click="activeTab = 'division1'"
                          >
                            <i class="fas fa-trophy me-2"></i>
                            Division 1
                            <span class="badge bg-warning text-dark ms-2" v-if="division1Matches.length > 0">{{ division1Matches.length }}</span>
                          </button>
                        </li>
                        <li class="nav-item">
                          <button 
                            class="nav-link"
                            :class="{ 'active': activeTab === 'division2' }"
                            @click="activeTab = 'division2'"
                          >
                            <i class="fas fa-medal me-2"></i>
                            Division 2
                            <span class="badge bg-secondary ms-2" v-if="division2Matches.length > 0">{{ division2Matches.length }}</span>
                          </button>
                        </li>
                        <li class="nav-item">
                          <button 
                            class="nav-link"
                            :class="{ 'active': activeTab === 'division3' }"
                            @click="activeTab = 'division3'"
                          >
                            <i class="fas fa-award me-2"></i>
                            Division 3
                            <span class="badge bg-warning text-dark ms-2" v-if="division3Matches.length > 0">{{ division3Matches.length }}</span>
                          </button>
                        </li>
                      </ul>

                      <!-- Tab Content -->
                      <!-- Division 1 Tab -->
                      <div v-if="activeTab === 'division1'" class="tab-content">
                        <div v-if="division1Matches.length === 0" class="text-center py-5">
                          <p class="text-muted">No scheduled matches available in Division 1 at the moment.</p>
                        </div>
                        <div v-else class="top10_list row g-4">
                          <div 
                            v-for="match in division1Matches" 
                            :key="match.id"
                            class="col-lg-6 col-xl-4"
                          >
                            <div class="player_card p-4" 
                                 style="cursor: pointer;" 
                                 @click="viewChampionship(match.championship_id)">
                              <div class="match_game_badge mb-3">
                                <span class="badge bg-warning text-dark">{{ match.championship?.game || 'Game' }}</span>
                                <span class="match_date_small ms-2">
                                  <i class="fas fa-clock me-1"></i>
                                  {{ formatDate(match.scheduled_at) }}
                                </span>
                              </div>
                              <div class="match_teams_compact mb-3">
                                <div class="team_compact">
                                  <div class="team_avatar_mini">
                                    <img 
                                      v-if="match.player1?.team_logo" 
                                      :src="getTeamLogoUrl(match.player1.team_logo)" 
                                      :alt="match.player1?.user?.username || match.player1?.player_username || match.player1?.team_name"
                                    />
                                    <i v-else class="fas fa-users"></i>
                                  </div>
                                  <div class="team_info_small">
                                    <div class="team_name_small">{{ match.player1?.team_name || 'Team 1' }}</div>
                                    <div class="player_username_small">
                                      @{{ match.player1?.user?.username || match.player1?.player_username || 'player1' }}
                                    </div>
                                  </div>
                                </div>
                                <div class="vs_small">VS</div>
                                <div class="team_compact">
                                  <div class="team_avatar_mini">
                                    <img 
                                      v-if="match.player2?.team_logo" 
                                      :src="getTeamLogoUrl(match.player2.team_logo)" 
                                      :alt="match.player2?.user?.username || match.player2?.player_username || match.player2?.team_name"
                                    />
                                    <i v-else class="fas fa-users"></i>
                                  </div>
                                  <div class="team_info_small">
                                    <div class="team_name_small">{{ match.player2?.team_name || 'Team 2' }}</div>
                                    <div class="player_username_small">
                                      @{{ match.player2?.user?.username || match.player2?.player_username || 'player2' }}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <!-- Betting Options - Only show when match is ongoing -->
                              <div v-if="match.status === 'ongoing'" class="match_betting_options mb-3">
                                <div class="betting_buttons d-flex gap-2 justify-content-center">
                                  <button 
                                    class="btn_bet_option"
                                    @click.stop="selectBet(match, 'player1_win', getOddsNumber(match.player1_odds))"
                                    :disabled="!isAuthenticated"
                                  >
                                    <span class="bet_team_name">{{ match.player1?.team_name || 'Team 1' }}</span>
                                    <span class="bet_odds">{{ formatOdds(match.player1_odds) }}x</span>
                                  </button>
                                  <button 
                                    v-if="match.draw_odds"
                                    class="btn_bet_option"
                                    @click.stop="selectBet(match, 'draw', getOddsNumber(match.draw_odds, 3.00))"
                                    :disabled="!isAuthenticated"
                                  >
                                    <span class="bet_team_name">Draw</span>
                                    <span class="bet_odds">{{ formatOdds(match.draw_odds, 3.00) }}x</span>
                                  </button>
                                  <button 
                                    class="btn_bet_option"
                                    @click.stop="selectBet(match, 'player2_win', getOddsNumber(match.player2_odds))"
                                    :disabled="!isAuthenticated"
                                  >
                                    <span class="bet_team_name">{{ match.player2?.team_name || 'Team 2' }}</span>
                                    <span class="bet_odds">{{ formatOdds(match.player2_odds) }}x</span>
                                  </button>
                                </div>
                              </div>
                              <div class="match_info_footer">
                                <span class="match_round_badge">Round {{ match.round_number }}</span>
                                <span class="match_championship_name">{{ match.championship?.name }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Division 2 Tab -->
                      <div v-if="activeTab === 'division2'" class="tab-content">
                        <div v-if="division2Matches.length === 0" class="text-center py-5">
                          <p class="text-muted">No scheduled matches available in Division 2 at the moment.</p>
                        </div>
                        <div v-else class="top10_list row g-4">
                          <div 
                            v-for="match in division2Matches" 
                            :key="match.id"
                            class="col-lg-6 col-xl-4"
                          >
                            <div class="player_card p-4" 
                                 style="cursor: pointer;" 
                                 @click="viewChampionship(match.championship_id)">
                              <div class="match_game_badge mb-3">
                                <span class="badge bg-warning text-dark">{{ match.championship?.game || 'Game' }}</span>
                                <span class="match_date_small ms-2">
                                  <i class="fas fa-clock me-1"></i>
                                  {{ formatDate(match.scheduled_at) }}
                                </span>
                              </div>
                              <div class="match_teams_compact mb-3">
                                <div class="team_compact">
                                  <div class="team_avatar_mini">
                                    <img 
                                      v-if="match.player1?.team_logo" 
                                      :src="getTeamLogoUrl(match.player1.team_logo)" 
                                      :alt="match.player1?.user?.username || match.player1?.player_username || match.player1?.team_name"
                                    />
                                    <i v-else class="fas fa-users"></i>
                                  </div>
                                  <div class="team_info_small">
                                    <div class="team_name_small">{{ match.player1?.team_name || 'Team 1' }}</div>
                                    <div class="player_username_small">
                                      @{{ match.player1?.user?.username || match.player1?.player_username || 'player1' }}
                                    </div>
                                  </div>
                                </div>
                                <div class="vs_small">VS</div>
                                <div class="team_compact">
                                  <div class="team_avatar_mini">
                                    <img 
                                      v-if="match.player2?.team_logo" 
                                      :src="getTeamLogoUrl(match.player2.team_logo)" 
                                      :alt="match.player2?.user?.username || match.player2?.player_username || match.player2?.team_name"
                                    />
                                    <i v-else class="fas fa-users"></i>
                                  </div>
                                  <div class="team_info_small">
                                    <div class="team_name_small">{{ match.player2?.team_name || 'Team 2' }}</div>
                                    <div class="player_username_small">
                                      @{{ match.player2?.user?.username || match.player2?.player_username || 'player2' }}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <!-- Betting Options - Only show when match is ongoing -->
                              <div v-if="match.status === 'ongoing'" class="match_betting_options mb-3">
                                <div class="betting_buttons d-flex gap-2 justify-content-center">
                                  <button 
                                    class="btn_bet_option"
                                    @click.stop="selectBet(match, 'player1_win', getOddsNumber(match.player1_odds))"
                                    :disabled="!isAuthenticated"
                                  >
                                    <span class="bet_team_name">{{ match.player1?.team_name || 'Team 1' }}</span>
                                    <span class="bet_odds">{{ formatOdds(match.player1_odds) }}x</span>
                                  </button>
                                  <button 
                                    v-if="match.draw_odds"
                                    class="btn_bet_option"
                                    @click.stop="selectBet(match, 'draw', getOddsNumber(match.draw_odds, 3.00))"
                                    :disabled="!isAuthenticated"
                                  >
                                    <span class="bet_team_name">Draw</span>
                                    <span class="bet_odds">{{ formatOdds(match.draw_odds, 3.00) }}x</span>
                                  </button>
                                  <button 
                                    class="btn_bet_option"
                                    @click.stop="selectBet(match, 'player2_win', getOddsNumber(match.player2_odds))"
                                    :disabled="!isAuthenticated"
                                  >
                                    <span class="bet_team_name">{{ match.player2?.team_name || 'Team 2' }}</span>
                                    <span class="bet_odds">{{ formatOdds(match.player2_odds) }}x</span>
                                  </button>
                                </div>
                              </div>
                              <div class="match_info_footer">
                                <span class="match_round_badge">Round {{ match.round_number }}</span>
                                <span class="match_championship_name">{{ match.championship?.name }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Division 3 Tab -->
                      <div v-if="activeTab === 'division3'" class="tab-content">
                        <div v-if="division3Matches.length === 0" class="text-center py-5">
                          <p class="text-muted">No scheduled matches available in Division 3 at the moment.</p>
                        </div>
                        <div v-else class="top10_list row g-4">
                          <div 
                            v-for="match in division3Matches" 
                            :key="match.id"
                            class="col-lg-6 col-xl-4"
                          >
                            <div class="player_card p-4" 
                                 style="cursor: pointer;" 
                                 @click="viewChampionship(match.championship_id)">
                              <div class="match_game_badge mb-3">
                                <span class="badge bg-warning text-dark">{{ match.championship?.game || 'Game' }}</span>
                                <span class="match_date_small ms-2">
                                  <i class="fas fa-clock me-1"></i>
                                  {{ formatDate(match.scheduled_at) }}
                                </span>
                              </div>
                              <div class="match_teams_compact mb-3">
                                <div class="team_compact">
                                  <div class="team_avatar_mini">
                                    <img 
                                      v-if="match.player1?.team_logo" 
                                      :src="getTeamLogoUrl(match.player1.team_logo)" 
                                      :alt="match.player1?.user?.username || match.player1?.player_username || match.player1?.team_name"
                                    />
                                    <i v-else class="fas fa-users"></i>
                                  </div>
                                  <div class="team_info_small">
                                    <div class="team_name_small">{{ match.player1?.team_name || 'Team 1' }}</div>
                                    <div class="player_username_small">
                                      @{{ match.player1?.user?.username || match.player1?.player_username || 'player1' }}
                                    </div>
                                  </div>
                                </div>
                                <div class="vs_small">VS</div>
                                <div class="team_compact">
                                  <div class="team_avatar_mini">
                                    <img 
                                      v-if="match.player2?.team_logo" 
                                      :src="getTeamLogoUrl(match.player2.team_logo)" 
                                      :alt="match.player2?.user?.username || match.player2?.player_username || match.player2?.team_name"
                                    />
                                    <i v-else class="fas fa-users"></i>
                                  </div>
                                  <div class="team_info_small">
                                    <div class="team_name_small">{{ match.player2?.team_name || 'Team 2' }}</div>
                                    <div class="player_username_small">
                                      @{{ match.player2?.user?.username || match.player2?.player_username || 'player2' }}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <!-- Betting Options - Only show when match is ongoing -->
                              <div v-if="match.status === 'ongoing'" class="match_betting_options mb-3">
                                <div class="betting_buttons d-flex gap-2 justify-content-center">
                                  <button 
                                    class="btn_bet_option"
                                    @click.stop="selectBet(match, 'player1_win', getOddsNumber(match.player1_odds))"
                                    :disabled="!isAuthenticated"
                                  >
                                    <span class="bet_team_name">{{ match.player1?.team_name || 'Team 1' }}</span>
                                    <span class="bet_odds">{{ formatOdds(match.player1_odds) }}x</span>
                                  </button>
                                  <button 
                                    v-if="match.draw_odds"
                                    class="btn_bet_option"
                                    @click.stop="selectBet(match, 'draw', getOddsNumber(match.draw_odds, 3.00))"
                                    :disabled="!isAuthenticated"
                                  >
                                    <span class="bet_team_name">Draw</span>
                                    <span class="bet_odds">{{ formatOdds(match.draw_odds, 3.00) }}x</span>
                                  </button>
                                  <button 
                                    class="btn_bet_option"
                                    @click.stop="selectBet(match, 'player2_win', getOddsNumber(match.player2_odds))"
                                    :disabled="!isAuthenticated"
                                  >
                                    <span class="bet_team_name">{{ match.player2?.team_name || 'Team 2' }}</span>
                                    <span class="bet_odds">{{ formatOdds(match.player2_odds) }}x</span>
                                  </button>
                                </div>
                              </div>
                              <div class="match_info_footer">
                                <span class="match_round_badge">Round {{ match.round_number }}</span>
                                <span class="match_championship_name">{{ match.championship?.name }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- /Match List -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  </section>

  <!-- Bet Modal -->
  <div v-if="showBetModal" class="popup-overlay" @click.self="closeBetModal">
    <div class="popup-box p-5 rounded-4 shadow-lg n11-bg" style="max-width: 500px;">
      <h3 class="fw-bold mb-4 text-center text-white">Place a Bet</h3>
      <div v-if="selectedMatch" class="mb-4">
        <div class="text-white mb-2">
          <strong>{{ selectedMatch.player1?.team_name || 'Team 1' }} vs {{ selectedMatch.player2?.team_name || 'Team 2' }}</strong>
        </div>
        <div class="text-white-50 mb-3">
          Your choice: 
          <span class="text-warning fw-bold">
            {{ selectedBetType === 'player1_win' ? (selectedMatch.player1?.team_name || 'Team 1') + ' (Win)' : 
               selectedBetType === 'draw' ? 'Draw' : 
               (selectedMatch.player2?.team_name || 'Team 2') + ' (Win)' }}
          </span>
        </div>
        <div class="text-white-50 mb-3">
          Odds: <span class="text-warning fw-bold">{{ formatOdds(selectedOdds) }}x</span>
        </div>
      </div>
      <div class="form-group mb-4">
        <label class="text-white mb-2 d-block">Bet Amount</label>
        <input 
          v-model.number="betAmount" 
          type="number" 
          step="0.01"
          min="0.01"
          class="form-control n11-bg text-white border-secondary" 
          placeholder="0.00"
          required
        />
        <div class="text-white-50 small mt-2">
          Available Balance: <span class="text-warning">{{ formatNumber(walletBalance) }} EBT</span>
        </div>
        <div v-if="betAmount > 0 && selectedOdds > 0" class="text-white-50 small mt-2">
          Potential win: <span class="text-success fw-bold">{{ formatNumber(betAmount * selectedOdds) }} EBT</span>
        </div>
      </div>
      <div v-if="betError" class="alert alert-danger mb-4">
        {{ betError }}
      </div>
      <div class="d-flex gap-3">
        <button 
          type="button" 
          class="btn_primary flex-fill" 
          @click="placeBet" 
          :disabled="placingBet || !betAmount || betAmount <= 0 || !selectedBetType || walletBalance <= 0"
        >
          <span v-if="placingBet">Processing...</span>
          <span v-else-if="walletBalance <= 0">Insufficient balance</span>
          <span v-else>Confirm Bet</span>
        </button>
        <button type="button" class="btn_secondary" @click="closeBetModal">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/utils/axios';
import { getStorageUrl } from '@/config/api';

interface Match {
  id: number;
  championship_id: number;
  round_number: number;
  scheduled_at: string;
  status?: string;
  player1_odds?: number;
  draw_odds?: number;
  player2_odds?: number;
  player1?: {
    id: number;
    team_name: string;
    team_logo?: string;
    full_name?: string;
    player_username?: string;
    user?: {
      id: number;
      username: string;
      email: string;
    };
  };
  player2?: {
    id: number;
    team_name: string;
    team_logo?: string;
    full_name?: string;
    player_username?: string;
    user?: {
      id: number;
      username: string;
      email: string;
    };
  };
  championship?: {
    id: number;
    name: string;
    game: string;
    division: string;
  };
}

const router = useRouter();
const matchesByDivision = ref<{ '1': Match[], '2': Match[], '3': Match[] }>({
  '1': [],
  '2': [],
  '3': []
});
const loading = ref(false);
const error = ref('');
const activeTab = ref<'division1' | 'division2' | 'division3'>('division1');
const isAuthenticated = ref(false);
const showBetModal = ref(false);
const selectedMatch = ref<Match | null>(null);
const selectedBetType = ref<string>('');
const selectedOdds = ref(0);
const betAmount = ref(0);
const betError = ref('');
const placingBet = ref(false);
const walletBalance = ref(0);

// Define computed properties first
const division1Matches = computed(() => {
  const matches = matchesByDivision.value['1'] || [];
  return Array.isArray(matches) ? matches : [];
});

const division2Matches = computed(() => {
  const matches = matchesByDivision.value['2'] || [];
  return Array.isArray(matches) ? matches : [];
});

const division3Matches = computed(() => {
  const matches = matchesByDivision.value['3'] || [];
  return Array.isArray(matches) ? matches : [];
});

// Watch for changes to update active tab (after computed properties are defined)
watch([division1Matches, division2Matches, division3Matches], () => {
  try {
    if (division1Matches.value.length > 0 && activeTab.value !== 'division1') {
      activeTab.value = 'division1';
    } else if (division2Matches.value.length > 0 && activeTab.value !== 'division2' && division1Matches.value.length === 0) {
      activeTab.value = 'division2';
    } else if (division3Matches.value.length > 0 && activeTab.value !== 'division3' && division1Matches.value.length === 0 && division2Matches.value.length === 0) {
      activeTab.value = 'division3';
    }
  } catch (e) {
    console.error('Error in watch:', e);
  }
}, { immediate: false });

const allMatches = computed(() => {
  return [...division1Matches.value, ...division2Matches.value, ...division3Matches.value];
});

const loadUpcomingMatches = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    const response = await apiClient.get('/championships/upcoming-matches', {
      params: { limit: 10 }
    });

    console.log('Upcoming matches response:', response.data);

    if (response.data && response.data.success) {
      const data = response.data.data || {};
      
      // Ensure we have the correct structure
      matchesByDivision.value = {
        '1': Array.isArray(data['1']) ? data['1'] : [],
        '2': Array.isArray(data['2']) ? data['2'] : [],
        '3': Array.isArray(data['3']) ? data['3'] : []
      };
      
      // Set active tab to first available division
      if (division1Matches.value.length > 0) {
        activeTab.value = 'division1';
      } else if (division2Matches.value.length > 0) {
        activeTab.value = 'division2';
      } else if (division3Matches.value.length > 0) {
        activeTab.value = 'division3';
      }
    } else {
      console.warn('No matches data in response:', response.data);
      const errorMsg = response.data?.message || 'No matches available';
      if (errorMsg && errorMsg !== 'No matches available') {
        error.value = errorMsg;
      }
      matchesByDivision.value = { '1': [], '2': [], '3': [] };
    }
  } catch (err: any) {
    const status = err.response?.status;
    if (status !== 404) {
      console.warn('Upcoming matches:', err.response?.data?.message || err.message);
    }
    if (status !== 404) {
      error.value = err.response?.data?.message || err.message || 'Error loading scheduled matches';
    }
    matchesByDivision.value = { '1': [], '2': [], '3': [] };
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'TBD';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getTeamLogoUrl = (logoPath: string) => {
  if (!logoPath) return '';
  if (logoPath.startsWith('http')) return logoPath;
  return getStorageUrl(logoPath);
};

const viewChampionship = (id: number) => {
  router.push(`/championships/${id}`);
};

const selectBet = (match: Match, betType: string, odds: number | string) => {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    alert('You must be logged in to place a bet');
    router.push('/login');
    return;
  }
  
  selectedMatch.value = match;
  selectedBetType.value = betType;
  selectedOdds.value = getOddsNumber(odds);
  betAmount.value = 0;
  betError.value = '';
  showBetModal.value = true;
  loadWallet();
};

const loadWallet = async () => {
  try {
    const response = await apiClient.get('/wallet');
    if (response.data.success) {
      walletBalance.value = response.data.data.balance || 0;
    }
  } catch (err) {
    console.error('Error loading wallet:', err);
  }
};

const placeBet = async () => {
  betError.value = '';
  
  if (!selectedMatch.value) {
    betError.value = 'Please select a match';
    return;
  }
  
  if (!selectedBetType.value) {
    betError.value = 'Please select a bet type';
    return;
  }
  
  if (!betAmount.value || betAmount.value <= 0) {
    betError.value = 'Amount must be greater than 0';
    return;
  }
  
  if (betAmount.value > walletBalance.value) {
    betError.value = `Insufficient balance. Your available balance is ${walletBalance.value.toFixed(2)} EBT`;
    return;
  }
  
  try {
    placingBet.value = true;
    betError.value = '';
    const response = await apiClient.post(
      '/bets',
      {
        championship_match_id: selectedMatch.value.id,
        bet_type: selectedBetType.value,
        amount: betAmount.value
      }
    );
    
    if (response.data.success) {
      alert('Bet placed successfully!');
      closeBetModal();
      await loadWallet();
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Error placing bet';
    betError.value = errorMessage;
  } finally {
    placingBet.value = false;
  }
};

const closeBetModal = () => {
  showBetModal.value = false;
  selectedMatch.value = null;
  selectedBetType.value = '';
  selectedOdds.value = 0;
  betAmount.value = 0;
  betError.value = '';
};

const formatNumber = (num: number) => {
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatOdds = (odds: number | string | undefined, defaultValue: number = 2.00): string => {
  if (!odds) return defaultValue.toFixed(2);
  const numOdds = typeof odds === 'string' ? parseFloat(odds) : odds;
  if (isNaN(numOdds)) return defaultValue.toFixed(2);
  return numOdds.toFixed(2);
};

const getOddsNumber = (odds: number | string | undefined, defaultValue: number = 2.00): number => {
  if (!odds) return defaultValue;
  const numOdds = typeof odds === 'string' ? parseFloat(odds) : odds;
  if (isNaN(numOdds)) return defaultValue;
  return numOdds;
};

onMounted(() => {
  try {
    const token = localStorage.getItem("auth_token");
    isAuthenticated.value = !!token;
    loadUpcomingMatches();
    if (isAuthenticated.value) {
      loadWallet();
    }
  } catch (e) {
    console.error('Error in onMounted:', e);
    error.value = 'Failed to load matches';
    loading.value = false;
  }
});
</script>

<style scoped>
.top10_section {
  width: 100%;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 24px;
}

.top10_content {
  color: white;
}

.player_card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.player_card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 159, 0, 0.3);
}

.hero_actions .btn_primary {
  display: inline-flex;
  align-items: center;
  color: inherit;
}

.hero_actions .btn_primary:hover {
  color: inherit;
  text-decoration: none;
}

.championships-tabs {
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.championships-tabs .nav-link {
  color: rgba(255, 255, 255, 0.7);
  border: none;
  border-bottom: 3px solid transparent;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  background: transparent;
}

.championships-tabs .nav-link:hover {
  color: #FFD700;
  border-bottom-color: rgba(255, 215, 0, 0.5);
}

.championships-tabs .nav-link.active {
  color: #FFD700;
  background: transparent;
  border-bottom-color: #FFD700;
}

.match_game_badge {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.match_date_small {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
}

.match_teams_compact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.team_compact {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.team_avatar_mini {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 215, 0, 0.4);
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.team_avatar_mini img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.team_avatar_mini i {
  font-size: 1.2rem;
  color: #FFD700;
}

.team_info_small {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  flex: 1;
  min-width: 0;
}

.team_name_small {
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.player_username_small {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.vs_small {
  font-size: 0.9rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
}

.match_info_footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.75rem;
}

.match_round_badge {
  color: rgba(255, 255, 255, 0.7);
}

.match_championship_name {
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
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

.match_betting_options {
  margin-top: 1rem;
}

.betting_buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn_bet_option {
  flex: 1;
  min-width: 80px;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.btn_bet_option:hover:not(:disabled) {
  background: rgba(255, 215, 0, 0.2);
  border-color: rgba(255, 215, 0, 0.6);
  transform: translateY(-2px);
}

.btn_bet_option:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.bet_team_name {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  font-size: 0.7rem;
}

.bet_odds {
  font-weight: 700;
  color: #FFD700;
  font-size: 0.85rem;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.popup-box {
  background: #1a1f3a;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.n11-bg {
  background: #1a1f3a;
}
</style>
