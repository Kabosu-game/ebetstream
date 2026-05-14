<template>
  <!-- ===== UPCOMING MATCHES (Twitch-style) ===== -->
  <section class="tw-section">
    <div class="tw-section-header">
      <div class="tw-section-header__left">
        <i class="ti ti-trophy tw-section-icon"></i>
        <h2 class="tw-section-title">{{ $t('ui.matchs_du_championnat') }}</h2>
      </div>
      <router-link to="/championships" class="tw-see-all">
        {{ $t('labels.view_all') }} <i class="fas fa-chevron-right"></i>
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="tw-match-grid">
      <div v-for="n in 3" :key="n" class="tw-match-card tw-match-card--skeleton">
        <div class="skeleton-line mb-2"></div>
        <div class="tw-match-card__teams">
          <div class="skeleton-avatar"></div>
          <span class="tw-match-vs">{{ $t('labels.vs') }}</span>
          <div class="skeleton-avatar"></div>
        </div>
        <div class="skeleton-line skeleton-line--short mt-3"></div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error && allMatches.length === 0" class="tw-empty-state">
      <i class="ti ti-alert-circle tw-empty-state__icon"></i>
      <p>{{ error }}</p>
    </div>

    <!-- No matches -->
    <div v-else-if="allMatches.length === 0" class="tw-empty-state">
      <i class="ti ti-calendar-off tw-empty-state__icon"></i>
      <p>{{ $t('ui.no_scheduled_matches_available_at_the_moment') }}</p>
    </div>

    <!-- Matches -->
    <div v-else>
      <!-- Division tabs -->
      <div class="tw-tabs">
        <button
          class="tw-tab"
          :class="{ 'tw-tab--active': activeTab === 'division1' }"
          @click="activeTab = 'division1'"
        >
          <i class="fas fa-trophy"></i>{{ $t('ui.division_1') }}<span class="tw-tab-count" v-if="division1Matches.length">{{ division1Matches.length }}</span>
        </button>
        <button
          class="tw-tab"
          :class="{ 'tw-tab--active': activeTab === 'division2' }"
          @click="activeTab = 'division2'"
        >
          <i class="fas fa-medal"></i>{{ $t('ui.division_2') }}<span class="tw-tab-count" v-if="division2Matches.length">{{ division2Matches.length }}</span>
        </button>
        <button
          class="tw-tab"
          :class="{ 'tw-tab--active': activeTab === 'division3' }"
          @click="activeTab = 'division3'"
        >
          <i class="fas fa-award"></i>{{ $t('ui.division_3') }}<span class="tw-tab-count" v-if="division3Matches.length">{{ division3Matches.length }}</span>
        </button>
      </div>

      <!-- Tab content -->
      <template v-for="(divMatches, divKey) in { division1: division1Matches, division2: division2Matches, division3: division3Matches }" :key="divKey">
        <div v-if="activeTab === divKey">
          <p v-if="divMatches.length === 0" class="tw-tab-empty">{{ $t('ui.no_matches_in_this_division') }}</p>

          <div v-else class="tw-match-grid">
            <div
              v-for="match in divMatches"
              :key="match.id"
              class="tw-match-card"
              @click="viewChampionship(match.championship_id)"
            >
              <!-- Header: game + date -->
              <div class="tw-match-card__header">
                <span class="tw-match-game">{{ match.championship?.game || 'Game' }}</span>
                <span class="tw-match-date">
                  <i class="fas fa-clock"></i> {{ formatDate(match.scheduled_at) }}
                </span>
              </div>

              <!-- Teams VS row -->
              <div class="tw-match-card__teams">
                <!-- Team 1 -->
                <div class="tw-match-team">
                  <div class="tw-match-team__logo">
                    <img
                      v-if="match.player1?.team_logo"
                      :src="getTeamLogoUrl(match.player1.team_logo)"
                      :alt="$t('ui.match_player1_team_name')"
                    />
                    <i v-else class="fas fa-users"></i>
                  </div>
                  <p class="tw-match-team__name">{{ match.player1?.team_name || 'Team 1' }}</p>
                  <p class="tw-match-team__handle">@{{ match.player1?.user?.username || match.player1?.player_username || 'player1' }}</p>
                </div>

                <div class="tw-match-vs">{{ $t('labels.vs') }}</div>

                <!-- Team 2 -->
                <div class="tw-match-team">
                  <div class="tw-match-team__logo">
                    <img
                      v-if="match.player2?.team_logo"
                      :src="getTeamLogoUrl(match.player2.team_logo)"
                      :alt="$t('ui.match_player2_team_name')"
                    />
                    <i v-else class="fas fa-users"></i>
                  </div>
                  <p class="tw-match-team__name">{{ match.player2?.team_name || 'Team 2' }}</p>
                  <p class="tw-match-team__handle">@{{ match.player2?.user?.username || match.player2?.player_username || 'player2' }}</p>
                </div>
              </div>

              <!-- Bet buttons (ongoing only) -->
              <div v-if="match.status === 'ongoing'" class="tw-match-bet-row">
                <button
                  class="tw-bet-btn"
                  @click.stop="selectBet(match, 'player1_win', getOddsNumber(match.player1_odds))"
                  :disabled="!isAuthenticated"
                >
                  <span>{{ match.player1?.team_name || 'Team 1' }}</span>
                  <span class="tw-bet-odds">{{ formatOdds(match.player1_odds) }}x</span>
                </button>
                <button
                  v-if="match.draw_odds"
                  class="tw-bet-btn"
                  @click.stop="selectBet(match, 'draw', getOddsNumber(match.draw_odds, 3.00))"
                  :disabled="!isAuthenticated"
                >
                  <span>{{ $t('betting.draw_2') }}</span>
                  <span class="tw-bet-odds">{{ formatOdds(match.draw_odds, 3.00) }}x</span>
                </button>
                <button
                  class="tw-bet-btn"
                  @click.stop="selectBet(match, 'player2_win', getOddsNumber(match.player2_odds))"
                  :disabled="!isAuthenticated"
                >
                  <span>{{ match.player2?.team_name || 'Team 2' }}</span>
                  <span class="tw-bet-odds">{{ formatOdds(match.player2_odds) }}x</span>
                </button>
              </div>

              <!-- Footer -->
              <div class="tw-match-card__footer">
                <span class="tw-match-round">Round {{ match.round_number }}</span>
                <span class="tw-match-champ">{{ match.championship?.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </section>

  <!-- ===== BET MODAL ===== -->
  <div v-if="showBetModal" class="tw-modal-overlay" @click.self="closeBetModal">
    <div class="tw-modal">
      <div class="tw-modal__header">
        <h3 class="tw-modal__title">{{ $t('ui.place_a_bet') }}</h3>
        <button class="tw-modal__close" @click="closeBetModal">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="tw-modal__body" v-if="selectedMatch">
        <p class="tw-modal__match">
          {{ selectedMatch.player1?.team_name || 'Team 1' }} vs {{ selectedMatch.player2?.team_name || 'Team 2' }}
        </p>
        <div class="tw-modal__row">
          <span class="tw-modal__label">{{ $t('ui.your_choice') }}</span>
          <span class="tw-modal__value">
            {{ selectedBetType === 'player1_win'
                ? (selectedMatch.player1?.team_name || 'Team 1') + ' (Win)'
                : selectedBetType === 'draw'
                  ? 'Draw'
                  : (selectedMatch.player2?.team_name || 'Team 2') + ' (Win)' }}
          </span>
        </div>
        <div class="tw-modal__row">
          <span class="tw-modal__label">{{ $t('ui.odds') }}</span>
          <span class="tw-modal__odds">{{ formatOdds(selectedOdds) }}x</span>
        </div>

        <div class="tw-modal__input-group">
          <label class="tw-modal__input-label">{{ $t('ui.bet_amount_ebt') }}</label>
          <input
            v-model.number="betAmount"
            type="number"
            step="0.01"
            min="0.01"
            class="tw-modal__input"
            placeholder="0.00"
          />
          <p class="tw-modal__balance">
            Balance: <strong>{{ formatNumber(walletBalance) }} EBT</strong>
          </p>
          <p v-if="betAmount > 0 && selectedOdds > 0" class="tw-modal__potential">
            Potential win: <strong>{{ formatNumber(betAmount * selectedOdds) }} EBT</strong>
          </p>
        </div>

        <div v-if="betError" class="tw-modal__error">{{ betError }}</div>
      </div>

      <div class="tw-modal__footer">
        <button class="tw-btn tw-btn--secondary" @click="closeBetModal">{{ $t('common.cancel') }}</button>
        <button
          class="tw-btn tw-btn--primary"
          @click="placeBet"
          :disabled="placingBet || !betAmount || betAmount <= 0 || !selectedBetType || walletBalance <= 0"
        >
          {{ placingBet ? 'Processing…' : walletBalance <= 0 ? 'Insufficient balance' : 'Confirm Bet' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

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
    alert(t('errors.mustBeLoggedInBet'));
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
      alert(t('success.betPlaced'));
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
    error.value = t('errors.loadMatchesFailed');
    loading.value = false;
  }
});
</script>

<style scoped>
/* ---- Section shell ---- */
.tw-section { padding: 24px 0 8px; }

.tw-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.tw-section-header__left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tw-section-icon {
  font-size: 20px;
  color: rgb(var(--g1));
}

.tw-section-title {
  font-size: 18px;
  font-weight: 700;
  color: rgb(var(--n8));
  margin: 0;
}

.tw-see-all {
  font-size: 13px;
  font-weight: 600;
  color: rgb(var(--g1));
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 2px;
  &:hover { color: rgba(var(--g1), 0.8); }
}

/* ---- Tabs ---- */
.tw-tabs {
  display: flex;
  gap: 4px;
  border-bottom: 2px solid rgb(var(--n2));
  margin-bottom: 16px;
}

.tw-tab {
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  color: rgb(var(--n3));
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s, border-color 0.2s;

  &:hover { color: rgb(var(--n8)); }

  &--active {
    color: rgb(var(--n8));
    border-bottom-color: rgb(var(--g1));
  }

  i { font-size: 14px; }
}

.tw-tab-count {
  background: rgb(var(--g1));
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 8px;
}

.tw-tab-empty {
  text-align: center;
  padding: 32px 0;
  font-size: 14px;
  color: rgb(var(--n3));
}

/* ---- Match grid ---- */
.tw-match-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 576px) { grid-template-columns: 1fr; }
}

/* Card */
.tw-match-card {
  background: rgb(var(--p2));
  border: 1px solid rgb(var(--n2));
  border-radius: 8px;
  padding: 14px;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.2s;

  &:hover {
    border-color: rgb(var(--g1));
    transform: translateY(-3px);
  }
}

.tw-match-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.tw-match-game {
  font-size: 11px;
  font-weight: 700;
  background: rgba(var(--g1), 0.15);
  color: rgb(var(--g1));
  padding: 2px 8px;
  border-radius: 3px;
}

.tw-match-date {
  font-size: 12px;
  color: rgb(var(--n3));
  display: flex;
  align-items: center;
  gap: 4px;

  i { font-size: 12px; }
}

/* Teams */
.tw-match-card__teams {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}

.tw-match-team {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.tw-match-team__logo {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgb(var(--p3));
  border: 2px solid rgb(var(--n2));
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img { width: 100%; height: 100%; object-fit: cover; }
  i { font-size: 18px; color: rgb(var(--n3)); }
}

.tw-match-team__name {
  font-size: 13px;
  font-weight: 600;
  color: rgb(var(--n8));
  margin: 0;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90px;
}

.tw-match-team__handle {
  font-size: 11px;
  color: rgb(var(--n3));
  margin: 0;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90px;
}

.tw-match-vs {
  font-size: 12px;
  font-weight: 800;
  color: rgb(var(--r1));
  flex-shrink: 0;
}

/* Bet row */
.tw-match-bet-row {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
}

.tw-bet-btn {
  flex: 1;
  background: rgb(var(--p3));
  border: 1px solid rgb(var(--n2));
  border-radius: 4px;
  padding: 6px 8px;
  color: rgb(var(--n8));
  font-size: 11px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  transition: border-color 0.2s, background 0.2s;

  &:hover:not(:disabled) {
    border-color: rgb(var(--g1));
    background: rgba(var(--g1), 0.1);
  }

  &:disabled { opacity: 0.4; cursor: not-allowed; }
}

.tw-bet-odds {
  font-size: 13px;
  font-weight: 700;
  color: rgb(var(--g1));
}

/* Footer */
.tw-match-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid rgb(var(--n2));
  font-size: 11px;
}

.tw-match-round { color: rgb(var(--n3)); }
.tw-match-champ {
  color: rgb(var(--n3));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

/* ---- Modal ---- */
.tw-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
}

.tw-modal {
  background: rgb(var(--p2));
  border: 1px solid rgb(var(--n2));
  border-radius: 8px;
  width: 100%;
  max-width: 440px;
  overflow: hidden;
}

.tw-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgb(var(--n2));
}

.tw-modal__title {
  font-size: 16px;
  font-weight: 700;
  color: rgb(var(--n8));
  margin: 0;
}

.tw-modal__close {
  background: none;
  border: none;
  color: rgb(var(--n3));
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.15s, background 0.15s;

  &:hover { color: rgb(var(--n8)); background: rgba(var(--n8), 0.08); }
}

.tw-modal__body {
  padding: 20px;
}

.tw-modal__match {
  font-size: 14px;
  font-weight: 600;
  color: rgb(var(--n8));
  margin: 0 0 14px;
}

.tw-modal__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.tw-modal__label {
  font-size: 13px;
  color: rgb(var(--n3));
}

.tw-modal__value {
  font-size: 13px;
  font-weight: 600;
  color: rgb(var(--n8));
}

.tw-modal__odds {
  font-size: 14px;
  font-weight: 700;
  color: rgb(var(--g1));
}

.tw-modal__input-group {
  margin-top: 16px;
}

.tw-modal__input-label {
  display: block;
  font-size: 13px;
  color: rgb(var(--n3));
  margin-bottom: 6px;
}

.tw-modal__input {
  width: 100%;
  background: rgb(var(--p1));
  border: 1px solid rgb(var(--n2));
  border-radius: 4px;
  color: rgb(var(--n8));
  font-size: 14px;
  padding: 8px 12px;
  outline: none;

  &:focus { border-color: rgb(var(--g1)); }
  &::placeholder { color: rgb(var(--n3)); }
}

.tw-modal__balance {
  font-size: 12px;
  color: rgb(var(--n3));
  margin: 6px 0 0;

  strong { color: rgb(var(--n8)); }
}

.tw-modal__potential {
  font-size: 12px;
  color: rgb(var(--n3));
  margin: 4px 0 0;

  strong { color: #00c853; }
}

.tw-modal__error {
  background: rgba(235, 0, 40, 0.12);
  border: 1px solid rgba(235, 0, 40, 0.3);
  color: rgb(var(--r1));
  font-size: 13px;
  padding: 8px 12px;
  border-radius: 4px;
  margin-top: 12px;
}

.tw-modal__footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid rgb(var(--n2));
}

/* Buttons */
.tw-btn {
  height: 36px;
  padding: 0 18px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &--primary {
    background: rgb(var(--g1));
    color: #fff;
    &:hover { background: rgba(var(--g1), 0.85); }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }

  &--secondary {
    background: rgba(var(--n8), 0.1);
    color: rgb(var(--n8));
    &:hover { background: rgba(var(--n8), 0.18); }
  }
}

/* Skeleton */
.skeleton-line {
  height: 12px;
  border-radius: 4px;
  background: linear-gradient(90deg, rgb(var(--p2)) 25%, rgb(var(--p3)) 50%, rgb(var(--p2)) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.skeleton-line--short { width: 55%; }
.skeleton-avatar {
  width: 44px; height: 44px; border-radius: 50%;
  background: linear-gradient(90deg, rgb(var(--p2)) 25%, rgb(var(--p3)) 50%, rgb(var(--p2)) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.mb-2 { margin-bottom: 8px; }
.mt-3 { margin-top: 12px; }

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.tw-match-card--skeleton .tw-match-card__teams {
  justify-content: center; gap: 16px;
}

/* Empty state */
.tw-empty-state {
  text-align: center; padding: 40px 0; color: rgb(var(--n3));
  &__icon { font-size: 48px; margin-bottom: 12px; display: block; opacity: 0.4; }
  p { font-size: 14px; margin: 0; }
}
</style>
