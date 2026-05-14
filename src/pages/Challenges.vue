<template>
  <div class="tw-page">

    <!-- Hero -->
    <div class="tw-page-hero">
      <div>
        <h1 class="tw-page-hero__title">{{ $t('ui.p2p_challenges') }}</h1>
        <p class="tw-page-hero__sub">{{ $t('ui.compete_against_other_players_wager_ebt_and_prove_your_domin') }}</p>
      </div>
      <div class="tw-page-hero__actions">
        <button class="tw-btn tw-btn--primary" @click="showCreateModal = true">
          <i class="fas fa-plus-circle me-2"></i>{{ $t('ui.create_a_challenge') }}</button>
      </div>
    </div>

    <!-- Filters -->
    <div class="tw-filters">
      <button
        class="tw-filter-btn"
        :class="{ active: filterStatus === null && !showMyChallenges }"
        @click="filterStatus = null; showMyChallenges = false"
      >{{ $t('common.all') }}</button>
      <button
        class="tw-filter-btn"
        :class="{ active: filterStatus === 'open' }"
        @click="filterStatus = 'open'; showMyChallenges = false"
      >{{ $t('ui.open') }}</button>
      <button
        class="tw-filter-btn"
        :class="{ active: filterStatus === 'accepted' }"
        @click="filterStatus = 'accepted'; showMyChallenges = false"
      >{{ $t('ui.accepted') }}</button>
      <button
        class="tw-filter-btn"
        :class="{ active: filterStatus === 'in_progress' }"
        @click="filterStatus = 'in_progress'; showMyChallenges = false"
      >{{ $t('ui.in_progress') }}</button>
      <button
        class="tw-filter-btn"
        :class="{ active: filterStatus === 'completed' }"
        @click="filterStatus = 'completed'; showMyChallenges = false"
      >{{ $t('common.completed') }}</button>
      <button
        class="tw-filter-btn"
        :class="{ active: showMyChallenges }"
        @click="showMyChallenges = !showMyChallenges"
      >{{ $t('ui.my_challenges') }}</button>
      <button
        class="tw-filter-btn refresh-btn"
        @click="loadChallenges()"
        :disabled="loading"
        title="Refresh list"
      >
        <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="tw-empty">
      <div class="spinner"></div>
    </div>

    <!-- Challenge grid -->
    <div v-else-if="challenges.length > 0" class="tw-grid-3">
      <div v-for="challenge in challenges" :key="challenge.id" class="tw-card challenge-card">

        <!-- Card top bar: status + timer -->
        <div class="challenge-topbar">
          <span
            class="tw-badge"
            :class="{
              'tw-badge--open':    challenge.status === 'open',
              'tw-badge--ongoing': challenge.status === 'accepted' || challenge.status === 'in_progress',
              'tw-badge--closed':  challenge.status === 'completed' || challenge.status === 'cancelled',
              'tw-badge--pending': challenge.status === 'pending',
            }"
          >
            <span v-if="challenge.status === 'in_progress'" class="tw-live-dot"></span>
            {{ getStatusLabel(challenge.status) }}
          </span>
          <span class="challenge-timer">{{ getTimeRemaining(challenge.expires_at) }}</span>
        </div>

        <div class="tw-card__body challenge-body">
          <!-- Game name -->
          <p class="tw-card__title">{{ challenge.game }}</p>

          <!-- Creator VS Opponent -->
          <div class="matchup">
            <span class="matchup__player">{{ challenge.creator.username }}</span>
            <span class="matchup__vs">{{ $t('labels.vs') }}</span>
            <span class="matchup__player">{{ challenge.opponent ? challenge.opponent.username : 'Pending...' }}</span>
          </div>

          <div class="tw-divider"></div>

          <!-- Bet amount + actions -->
          <div class="challenge-footer">
            <span class="bet-amount">
              <i class="fas fa-coins"></i> {{ challenge.bet_amount.toLocaleString() }} EBT
            </span>
            <div class="challenge-actions">
              <button class="tw-btn tw-btn--secondary btn-sm" @click="viewDetails(challenge.id)">
                Details
              </button>
              <button
                v-if="challenge.status === 'open' && challenge.creator.id !== currentUserId"
                class="tw-btn btn-accept btn-sm"
                @click="acceptChallenge(challenge.id)"
              >
                Accept
              </button>
              <button
                v-if="challenge.status === 'open' && challenge.creator.id === currentUserId"
                class="tw-btn btn-cancel btn-sm"
                @click="cancelChallenge(challenge.id)"
              >{{ $t('common.cancel') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="tw-empty">
      <div class="tw-empty__icon"><i class="fas fa-fist-raised"></i></div>
      <p class="tw-empty__title">{{ $t('ui.no_challenges_available') }}</p>
      <p class="tw-empty__sub">{{ $t('ui.be_the_first_to_create_a_challenge') }}</p>
      <button class="tw-btn tw-btn--primary mt-4" @click="showCreateModal = true">
        <i class="fas fa-plus-circle me-2"></i>{{ $t('ui.create_the_first_challenge') }}</button>
    </div>

    <!-- ── Create Challenge Modal ── -->
    <div v-if="showCreateModal" class="tw-modal-overlay" @click.self="showCreateModal = false">
      <div class="tw-modal">

        <div class="tw-modal__header">
          <h3 class="tw-modal__title">{{ $t('ui.create_a_new_challenge') }}</h3>
          <button class="tw-modal__close" @click="closeCreateModal">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="tw-modal__body">
          <form @submit.prevent="createChallenge" id="challenge-form">

            <!-- Challenge type -->
            <div class="tw-form-group">
              <label class="tw-label">{{ $t('ui.challenge_type') }}</label>
              <div class="type-toggle">
                <button
                  type="button"
                  class="tw-btn type-btn"
                  :class="challengeType === 'free' ? 'tw-btn--primary' : 'tw-btn--secondary'"
                  @click="challengeType = 'free'; selectedOpponent = null; searchQuery = ''"
                >
                  <i class="fas fa-globe me-2"></i>{{ $t('ui.open_challenge') }}</button>
                <button
                  type="button"
                  class="tw-btn type-btn"
                  :class="challengeType === 'direct' ? 'tw-btn--primary' : 'tw-btn--secondary'"
                  @click="challengeType = 'direct'"
                >
                  <i class="fas fa-user me-2"></i>{{ $t('ui.direct_challenge') }}</button>
              </div>
            </div>

            <!-- Opponent search (direct only) -->
            <div v-if="challengeType === 'direct'" class="tw-form-group">
              <label class="tw-label">{{ $t('ui.username') }}</label>
              <div class="search-wrap">
                <input
                  v-model="searchQuery"
                  type="text"
                  class="tw-input"
                  :placeholder="$t('ui.type_username')"
                  @input="searchUsers"
                  @focus="showUserSuggestions = true"
                  autocomplete="off"
                />
                <!-- Suggestions dropdown -->
                <div
                  v-if="showUserSuggestions && userSuggestions.length > 0"
                  class="suggestions-dropdown"
                >
                  <div
                    v-for="user in userSuggestions"
                    :key="user.id"
                    class="suggestion-item"
                    @click="selectOpponent(user)"
                  >
                    <i class="fas fa-user suggestion-icon"></i>
                    <div>
                      <div class="suggestion-name">{{ user.username }}</div>
                      <div class="suggestion-email">{{ user.email }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Selected opponent confirmation -->
              <div v-if="selectedOpponent" class="selected-opponent">
                <div class="selected-opponent__info">
                  <i class="fas fa-check-circle"></i>
                  Challenge to: <strong>{{ selectedOpponent.username }}</strong>
                </div>
                <button
                  type="button"
                  class="selected-opponent__clear"
                  @click="selectedOpponent = null; searchQuery = ''"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <small class="form-hint">{{ $t('ui.leave_empty_to_create_an_open_challenge') }}</small>
            </div>

            <!-- Game name -->
            <div class="tw-form-group">
              <label class="tw-label">{{ $t('ui.jeu') }}</label>
              <input
                v-model="newChallenge.game"
                type="text"
                class="tw-input"
                :placeholder="$t('ui.ex_call_of_duty_mobile_free_fire')"
                required
              />
            </div>

            <!-- Bet amount -->
            <div class="tw-form-group">
              <label class="tw-label">{{ $t('ui.bet_amount_ebt') }}</label>
              <input
                v-model.number="newChallenge.bet_amount"
                type="number"
                class="tw-input"
                min="500"
                max="1000000"
                step="1"
                required
              />
              <small class="form-hint">{{ $t('ui.minimum_500_ebt_maximum_1_000_000_ebt') }}</small>
            </div>

            <!-- Expiry -->
            <div class="tw-form-group">
              <label class="tw-label">{{ $t('ui.expiration_date') }}<span class="label-optional">{{ $t('ui.optional_2') }}</span></label>
              <input
                v-model="newChallenge.expires_at"
                type="datetime-local"
                class="tw-input"
              />
            </div>

            <!-- Error -->
            <div v-if="createError" class="form-error">
              <i class="fas fa-exclamation-circle me-2"></i>{{ createError }}
            </div>

          </form>
        </div>

        <div class="tw-modal__footer">
          <button type="button" class="tw-btn tw-btn--secondary" @click="closeCreateModal">{{ $t('common.cancel') }}</button>
          <button
            type="submit"
            form="challenge-form"
            class="tw-btn tw-btn--primary"
            :disabled="creating || (challengeType === 'direct' && !selectedOpponent) || !newChallenge.game"
          >
            <span v-if="creating"><i class="fas fa-spinner fa-spin me-2"></i>{{ $t('ui.creating') }}</span>
            <span v-else>{{ challengeType === 'direct' ? 'Send Challenge' : 'Create Challenge' }}</span>
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiClient from "@/utils/axios";

interface Challenge {
  id: number;
  game: string;
  bet_amount: number;
  status: string;
  creator: { id: number; username: string };
  opponent: { id: number; username: string } | null;
  expires_at: string | null;
  created_at: string;
}

const router = useRouter();
const route = useRoute();
const challenges = ref<Challenge[]>([]);
const loading = ref(false);
const filterStatus = ref<string | null>(null);
const showMyChallenges = ref(false);
const showCreateModal = ref(false);
const creating = ref(false);
const createError = ref("");
const currentUserId = ref<number | null>(null);
const challengeType = ref<'free' | 'direct'>('free');
const searchQuery = ref('');
const userSuggestions = ref<any[]>([]);
const showUserSuggestions = ref(false);
const selectedOpponent = ref<any | null>(null);

const newChallenge = ref({
  game: "",
  bet_amount: 10,
  expires_at: "",
});

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    open: "Open",
    accepted: "Accepted",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    open: "badge bg-success",
    accepted: "badge bg-info",
    in_progress: "badge bg-warning",
    completed: "badge bg-primary",
    cancelled: "badge bg-danger",
  };
  return classes[status] || "badge bg-secondary";
};

const getTimeRemaining = (expiresAt: string | null) => {
  if (!expiresAt) return "No expiration";
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires.getTime() - now.getTime();
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d remaining`;
  if (hours > 0) return `${hours}h remaining`;
  const minutes = Math.floor(diff / (1000 * 60));
  return `${minutes}min remaining`;
};

const loadChallenges = async (silent = false) => {
  try {
    if (!silent) loading.value = true;
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const params: any = {};
    if (filterStatus.value) params.status = filterStatus.value;
    if (showMyChallenges.value) params.my_challenges = true;

    const response = await apiClient.get("/challenges", {
      params,
      headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
    });

    if (response.data.success) {
      challenges.value = response.data.data.data || response.data.data || [];
    }
  } catch (error: any) {
    if (!silent) {
      console.error("Error loading challenges:", error);
      challenges.value = [];
    }
  } finally {
    if (!silent) loading.value = false;
  }
};

let refreshInterval: ReturnType<typeof setInterval> | null = null;

const searchUsers = async () => {
  if (searchQuery.value.length < 2) {
    userSuggestions.value = [];
    showUserSuggestions.value = false;
    return;
  }

  try {
    const response = await apiClient.get("/users/search", {
      params: { q: searchQuery.value },
    });

    if (response.data.success) {
      userSuggestions.value = response.data.data || [];
      showUserSuggestions.value = true;
    }
  } catch (error: any) {
    console.error("Error searching users:", error);
    userSuggestions.value = [];
  }
};

const selectOpponent = (user: any) => {
  selectedOpponent.value = user;
  searchQuery.value = user.username;
  showUserSuggestions.value = false;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  challengeType.value = 'free';
  searchQuery.value = '';
  selectedOpponent.value = null;
  userSuggestions.value = [];
  showUserSuggestions.value = false;
  newChallenge.value = { game: "", bet_amount: 10, expires_at: "" };
  createError.value = '';
};

const createChallenge = async () => {
  try {
    creating.value = true;
    createError.value = "";
    const token = localStorage.getItem("auth_token");

    const data: any = {
      game: newChallenge.value.game,
      bet_amount: newChallenge.value.bet_amount,
    };

    if (newChallenge.value.expires_at) {
      data.expires_at = new Date(newChallenge.value.expires_at).toISOString();
    }

    // Si un opponent est sélectionné, l'ajouter
    if (challengeType.value === 'direct' && selectedOpponent.value) {
      data.opponent_username = selectedOpponent.value.username;
    }

    const response = await apiClient.post("/challenges", data);

    if (response.data.success) {
      closeCreateModal();
      newChallenge.value = { game: "", bet_amount: 10, expires_at: "" };
      await loadChallenges();
      alert(challengeType.value === 'direct' ? t('success.challengeSent') : t('success.challengeCreated'));
    }
  } catch (error: any) {
    createError.value = error.response?.data?.message || "Error creating challenge";
  } finally {
    creating.value = false;
  }
};

const acceptChallenge = async (id: number) => {
  if (!confirm("Are you sure you want to accept this challenge?")) return;

  try {
    const response = await apiClient.post(`/challenges/${id}/accept`, {});

    if (response.data.success) {
      await loadChallenges();
      alert(t('success.challengeAccepted'));
    }
  } catch (error: any) {
    alert(error.response?.data?.message || t('errors.acceptChallenge'));
  }
};

const cancelChallenge = async (id: number) => {
  if (!confirm("Are you sure you want to cancel this challenge?")) return;

  try {
    const response = await apiClient.post(`/challenges/${id}/cancel`, {});

    if (response.data.success) {
      await loadChallenges();
      alert(t('success.challengeCancelled'));
    }
  } catch (error: any) {
    alert(error.response?.data?.message || t('errors.cancelChallenge'));
  }
};

const viewDetails = (id: number) => {
  router.push(`/challenges/${id}`);
};

const getCurrentUser = async () => {
  try {
    const response = await apiClient.get("/user");
    currentUserId.value = response.data.id;
  } catch (error: any) {
    if (error.response?.status !== 401) {
      console.error("Error getting current user:", error);
    }
  }
};

watch([filterStatus, showMyChallenges], () => {
  loadChallenges();
});

onMounted(() => {
  getCurrentUser();
  loadChallenges();
  // Rafraîchir la liste toutes les 20 s pour que les autres users voient les nouveaux challenges
  refreshInterval = setInterval(() => loadChallenges(true), 20000);
  if (route?.query?.action === "create") {
    showCreateModal.value = true;
  }
});

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval);
});
</script>

<style scoped>
/* Challenge card layout */
.challenge-card {
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
}

.challenge-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: rgb(var(--p3));
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.challenge-timer {
  font-size: 0.75rem;
  color: rgb(var(--n3));
}

.challenge-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Matchup row */
.matchup {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
  padding: 0.5rem 0;
}

.matchup__player {
  font-size: 0.85rem;
  color: rgb(var(--n8));
  font-weight: 500;
  max-width: 40%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.matchup__vs {
  font-size: 0.9rem;
  font-weight: 800;
  color: rgb(var(--r1));
  letter-spacing: 0.05em;
}

/* Footer */
.challenge-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.bet-amount {
  font-size: 0.85rem;
  font-weight: 700;
  color: rgb(var(--g1));
}

.bet-amount i {
  margin-right: 4px;
}

.challenge-actions {
  display: flex;
  gap: 0.4rem;
}

.btn-sm {
  padding: 0.3rem 0.8rem;
  font-size: 0.8rem;
}

.btn-accept {
  background: rgb(31, 157, 85);
  color: #fff;
  border: none;
}

.btn-accept:hover {
  background: rgb(25, 130, 70);
}

.btn-cancel {
  background: rgb(153, 27, 27);
  color: #fff;
  border: none;
}

.btn-cancel:hover {
  background: rgb(130, 20, 20);
}

/* Refresh button */
.refresh-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

/* Loading spinner */
.spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid rgb(var(--n2));
  border-top-color: rgb(var(--g1));
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.tw-empty__sub {
  font-size: 0.9rem;
  color: rgb(var(--n3));
  margin-top: 0.4rem;
}

.mt-4 { margin-top: 1.5rem; }
.me-2 { margin-right: 0.5rem; }

/* Modal form elements */
.type-toggle {
  display: flex;
  gap: 0.75rem;
}

.type-btn {
  flex: 1;
  justify-content: center;
}

/* Opponent search */
.search-wrap {
  position: relative;
}

.suggestions-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: rgb(var(--p2));
  border: 1px solid rgb(var(--n2));
  border-radius: 6px;
  z-index: 200;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid rgb(var(--n2));
  transition: background 0.15s;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background: rgba(var(--g1), 0.1);
}

.suggestion-icon {
  color: rgb(var(--g1));
  font-size: 0.9rem;
}

.suggestion-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: rgb(var(--n8));
}

.suggestion-email {
  font-size: 0.75rem;
  color: rgb(var(--n3));
}

/* Selected opponent chip */
.selected-opponent {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(var(--g1), 0.1);
  border: 1px solid rgba(var(--g1), 0.3);
  border-radius: 6px;
}

.selected-opponent__info {
  font-size: 0.85rem;
  color: rgb(var(--n8));
}

.selected-opponent__info i {
  color: rgb(var(--g1));
  margin-right: 6px;
}

.selected-opponent__clear {
  background: none;
  border: none;
  color: rgb(var(--r1));
  cursor: pointer;
  padding: 0;
  font-size: 0.85rem;
}

/* Form helpers */
.form-hint {
  display: block;
  margin-top: 0.35rem;
  font-size: 0.75rem;
  color: rgb(var(--n3));
}

.label-optional {
  font-weight: 400;
  color: rgb(var(--n3));
  font-size: 0.8rem;
}

.form-error {
  padding: 0.6rem 0.9rem;
  background: rgba(var(--r1), 0.12);
  border: 1px solid rgba(var(--r1), 0.4);
  border-radius: 6px;
  font-size: 0.85rem;
  color: rgb(var(--r1));
}
</style>
