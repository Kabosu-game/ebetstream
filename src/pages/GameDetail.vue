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
                <!-- Header -->
                <div class="row mb-5">
                  <div class="col-12">
                    <button class="btn_secondary mb-4" @click="$router.push('/')">
                      <i class="fas fa-arrow-left me-2"></i>
                      Back
                    </button>

                    <div class="defis_content">
                      <div class="d-flex align-items-center gap-3 mb-3">
                        <div class="game_icon_large rounded-circle overflow-hidden d-flex align-items-center justify-content-center"
                             style="width: 80px; height: 80px; border: 3px solid rgba(255, 255, 255, 0.3); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                          <i :class="getGameIcon(game.name)" class="text-white fs-2"></i>
                        </div>
                        <div>
                          <span class="hero_badge mb-3 d-inline-block">
                            <i class="fas fa-gamepad me-2"></i>{{ game.category?.name || 'Game' }}
                          </span>
                          <h2 class="hero_title mb-4">
                            <span class="text_gradient">{{ game.name }}</span>
                          </h2>
                        </div>
                      </div>
                      <p v-if="game.description" class="hero_subtitle">
                        {{ game.description }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Filters -->
                <div class="d-flex gap-3 mb-5 flex-wrap justify-content-center">
                  <button 
                    class="btn_primary"
                    :class="{ 'active': filterStatus === null }"
                    @click="filterStatus = null"
                  >
                    All
                  </button>
                  <button 
                    class="btn_secondary"
                    :class="{ 'active': filterStatus === 'upcoming' }"
                    @click="filterStatus = 'upcoming'"
                  >
                    Upcoming
                  </button>
                  <button 
                    class="btn_secondary"
                    :class="{ 'active': filterStatus === 'live' }"
                    @click="filterStatus = 'live'"
                  >
                    Live
                  </button>
                  <button 
                    class="btn_secondary"
                    :class="{ 'active': filterStatus === 'finished' }"
                    @click="filterStatus = 'finished'"
                  >
                    Finished
                  </button>
                </div>

                <!-- Matches List -->
                <div v-if="loadingMatches" class="row mt-5">
                  <div class="col-12 text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </div>
                <div v-else-if="filteredMatches.length > 0" class="row mt-5 g-4">
                  <div v-for="match in filteredMatches" :key="match.id" class="col-12">
                    <div class="defi_card n11-bg rounded-8 p-4">
                      <div class="row align-items-center">
                        <!-- Match Info -->
                        <div class="col-md-6 mb-3 mb-md-0">
                          <div class="d-flex align-items-center gap-3 mb-3">
                            <div class="match_status_badge">
                              <span v-if="match.status === 'live'" class="badge bg-danger">LIVE</span>
                              <span v-else-if="match.status === 'upcoming'" class="badge bg-warning">UPCOMING</span>
                              <span v-else-if="match.status === 'finished'" class="badge bg-success">FINISHED</span>
                            </div>
                            <div class="text-white-50 small">
                              <i class="fas fa-calendar me-1"></i>
                              {{ formatDate(match.match_date) }}
                            </div>
                          </div>
                          <h5 class="text-white fw-bold mb-3">{{ match.team1_name }} vs {{ match.team2_name }}</h5>
                          <p v-if="match.description" class="text-white-50 small mb-0">{{ match.description }}</p>
                        </div>

                        <!-- Betting Options - Coming Soon -->
                        <div class="col-md-6">
                          <div class="row g-2">
                            <div class="col-12">
                              <div class="bet_option_btn w-100 p-4 rounded-4 text-center" style="background: rgba(255, 255, 255, 0.05); border: 1px dashed rgba(255, 255, 255, 0.2);">
                                <div class="mb-2">
                                  <i class="fas fa-clock text-warning fs-4"></i>
                                </div>
                                <div class="fw-bold text-white mb-2">Betting Coming Soon</div>
                                <div class="text-white-50 small">
                                  Only P2P challenges between players are currently available
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="row mt-5">
                  <div class="col-12 text-center py-5">
                    <p class="text-white" style="opacity: 0.7;">No matches available at the moment.</p>
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
            <strong>{{ selectedMatch.team1_name }} vs {{ selectedMatch.team2_name }}</strong>
          </div>
          <div class="text-white-50 mb-3">
            Your choice: 
            <span class="text-warning fw-bold">
              {{ selectedBetType === 'team1_win' ? selectedMatch.team1_name + ' (Win)' : 
                 selectedBetType === 'draw' ? 'Draw' : 
                 selectedMatch.team2_name + ' (Win)' }}
            </span>
          </div>
          <div class="text-white-50 mb-3">
            Odds: <span class="text-warning fw-bold">{{ selectedOdds }}x</span>
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
            Available Balance: <span class="text-warning">{{ formatNumber(Number(walletBalance)) }} EBT</span>
          </div>
          <div v-if="betAmount > 0 && selectedOdds > 0" class="text-white-50 small mt-2">
            Potential win: <span class="text-success fw-bold">{{ formatNumber(Number(betAmount) * Number(selectedOdds)) }} EBT</span>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/utils/axios';

const route = useRoute();
const router = useRouter();

interface Game {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon_url?: string;
  category?: { name: string };
}

interface GameMatch {
  id: number;
  game_id: number;
  team1_name: string;
  team2_name: string;
  description?: string;
  match_date: string;
  status: 'upcoming' | 'live' | 'finished' | 'cancelled';
  result?: string;
  team1_odds: number;
  draw_odds: number;
  team2_odds: number;
}

const game = ref<Game | null>(null);
const matches = ref<GameMatch[]>([]);
const loading = ref(false);
const loadingMatches = ref(false);
const error = ref('');
const filterStatus = ref<string | null>(null);
const walletBalance = ref(0);
const showBetModal = ref(false);
const selectedMatch = ref<GameMatch | null>(null);
const selectedBetType = ref<string>('');
const selectedOdds = ref(0);
const betAmount = ref(0);
const betError = ref('');
const placingBet = ref(false);
const selectedBets = ref<Record<number, string>>({});

const filteredMatches = computed(() => {
  if (!filterStatus.value) return matches.value;
  return matches.value.filter(m => m.status === filterStatus.value);
});

const loadGame = async () => {
  try {
    loading.value = true;
    error.value = '';
    // Reset game data before loading new one
    game.value = null;
    const gameId = route.params.id;
    
    const response = await apiClient.get(`/games/${gameId}`);
    
    if (response.data.success) {
      game.value = response.data.data;
    }
  } catch (err: any) {
    console.error('Error loading game:', err);
    error.value = err.response?.data?.message || 'Error loading game';
  } finally {
    loading.value = false;
  }
};

const loadMatches = async () => {
  try {
    loadingMatches.value = true;
    // Reset matches before loading new ones
    matches.value = [];
    const gameId = route.params.id;
    
    const response = await apiClient.get(`/game-matches?game_id=${gameId}`);
    
    if (response.data.success) {
      matches.value = response.data.data;
    }
  } catch (err: any) {
    console.error('Error loading matches:', err);
  } finally {
    loadingMatches.value = false;
  }
};

const loadWallet = async () => {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) return;
    
    const response = await apiClient.get('/wallet');
    
    if (response.data.success) {
      // Ensure balance is never negative
      const balance = parseFloat(response.data.data.balance) || 0;
      walletBalance.value = Math.max(0, balance);
    }
  } catch (err: any) {
    console.error('Error loading wallet:', err);
  }
};

const selectBet = (matchId: number, betType: string, odds: number) => {
  // Betting on game category matches is coming soon
  // Only P2P challenges are currently available
  alert('Betting on game category matches is coming soon. Only P2P challenges between players are currently available.');
  return;
};

const placeBet = async () => {
  // Reset error
  betError.value = '';
  
  // Check that match is selected
  if (!selectedMatch.value) {
    betError.value = 'Please select a match';
    return;
  }
  
  // Check that bet type is selected
  if (!selectedBetType.value) {
    betError.value = 'Please select a bet type';
    return;
  }
  
  // Check that amount is valid
  if (!betAmount.value || betAmount.value <= 0) {
    betError.value = 'Amount must be greater than 0';
    return;
  }
  
  // Check that balance is sufficient
  if (walletBalance.value <= 0) {
    betError.value = 'Insufficient balance. Your balance is $0.00';
    return;
  }
  
  if (betAmount.value > walletBalance.value) {
    betError.value = `Insufficient balance. Your available balance is ${formatNumber(walletBalance.value)} EBT`;
    return;
  }
  
  try {
    placingBet.value = true;
    betError.value = '';
    const response = await apiClient.post(
      '/bets',
      {
        game_match_id: selectedMatch.value.id,
        bet_type: selectedBetType.value,
        amount: betAmount.value
      }
    );
    
    if (response.data.success) {
      alert('Bet placed successfully!');
      closeBetModal();
      await loadWallet();
      await loadMatches();
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Error placing bet';
    if (err.response?.data?.message?.includes('Solde insuffisant') || err.response?.data?.message?.includes('Insufficient')) {
      betError.value = `Insufficient balance. Your available balance is ${formatNumber(walletBalance.value)} EBT`;
    } else {
      betError.value = errorMessage;
    }
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

const formatNumber = (num: number | string | null | undefined) => {
  if (num === null || num === undefined || num === '') {
    return '0.00';
  }
  const numberValue = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(numberValue)) {
    return '0.00';
  }
  return numberValue.toFixed(2);
};

// Watch for route changes to reload game data
watch(() => route.params.id, (newId, oldId) => {
  if (newId !== oldId && newId) {
    loadGame();
    loadMatches();
    loadWallet();
  }
}, { immediate: false });

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
  loadGame();
  loadMatches();
  loadWallet();
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

.defi_card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.defi_card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.bet_option_btn {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  color: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

.bet_option_btn:hover:not(:disabled) {
  background: rgba(255, 159, 0, 0.2);
  border-color: #FF9F00;
  transform: translateY(-2px);
}

.bet_option_btn.active {
  background: rgba(255, 159, 0, 0.3);
  border-color: #FF9F00;
}

.bet_option_btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
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

.page-content-with-space {
  padding-top: 90px;
}

@media (max-width: 768px) {
  .page-content-with-space {
    padding-top: 60px;
  }
  
  .container-fluid {
    margin-left: 0 !important;
  }
  
  .defis__main {
    margin-left: 0 !important;
  }
}
</style>


