<template>
  <!-- ===== P2P CHALLENGES (Twitch-style) ===== -->
  <section class="tw-section">
    <div class="tw-section-header">
      <div class="tw-section-header__left">
        <i class="ti ti-swords tw-section-icon"></i>
        <h2 class="tw-section-title">{{ $t('ui.d_fis') }}</h2>
        <span class="tw-badge-count" v-if="defis.length > 0">{{ defis.length }}</span>
      </div>
      <div class="tw-section-header__right">
        <router-link to="/challenges" class="tw-see-all">
          Voir tout <i class="fas fa-chevron-right"></i>
        </router-link>
      </div>
    </div>

    <!-- Auth CTA -->
    <div v-if="!isAuthenticated" class="tw-auth-cta">
      <div class="tw-auth-cta__inner">
        <i class="ti ti-lock tw-auth-cta__icon"></i>
        <div>
          <p class="tw-auth-cta__title">{{ $t('ui.sign_in_to_view_challenges') }}</p>
          <p class="tw-auth-cta__sub">{{ $t('ui.join_duels_bet_on_matches_and_prove_your_dominance') }}</p>
        </div>
        <div class="tw-auth-cta__actions">
          <router-link to="/login" class="tw-btn tw-btn--primary">{{ $t('ui.log_in') }}</router-link>
          <router-link to="/create-account" class="tw-btn tw-btn--secondary">{{ $t('common.sign_up') }}</router-link>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-else-if="loading" class="tw-challenge-grid">
      <div v-for="n in 3" :key="n" class="tw-challenge-card tw-challenge-card--skeleton">
        <div class="skeleton-line mb-2"></div>
        <div class="skeleton-line skeleton-line--short mb-4"></div>
        <div class="tw-challenge-card__teams">
          <div class="skeleton-avatar"></div>
          <span class="tw-challenge-vs">VS</span>
          <div class="skeleton-avatar"></div>
        </div>
        <div class="skeleton-line skeleton-line--short mt-3"></div>
      </div>
    </div>

    <!-- Challenge cards -->
    <div v-else-if="defis.length > 0" class="tw-challenge-grid">
      <div
        v-for="defi in defis"
        :key="defi.id"
        class="tw-challenge-card"
        @click="viewDetails(defi.id)"
      >
        <!-- Header: status + timer -->
        <div class="tw-challenge-card__header">
          <span
            class="tw-challenge-status"
            :class="defi.status === 'open' ? 'tw-challenge-status--open' : 'tw-challenge-status--closed'"
          >
            <span class="tw-live-dot tw-live-dot--sm" v-if="defi.status === 'open'"></span>
            {{ getStatusLabel(defi.status) }}
          </span>
          <span class="tw-challenge-timer">{{ getTimeRemaining(defi.expires_at) }}</span>
        </div>

        <!-- Game name -->
        <p class="tw-challenge-game">{{ defi.game }}</p>

        <!-- VS row -->
        <div class="tw-challenge-teams">
          <div class="tw-challenge-player">
            <div class="tw-challenge-avatar">{{ defi.creator.username[0].toUpperCase() }}</div>
            <span class="tw-challenge-username">{{ defi.creator.username }}</span>
          </div>

          <div class="tw-challenge-vs">VS</div>

          <div class="tw-challenge-player">
            <div class="tw-challenge-avatar tw-challenge-avatar--ghost" v-if="!defi.opponent">?</div>
            <div class="tw-challenge-avatar" v-else>{{ defi.opponent.username[0].toUpperCase() }}</div>
            <span class="tw-challenge-username">
              {{ defi.opponent ? defi.opponent.username : 'Waiting...' }}
            </span>
          </div>
        </div>

        <!-- Footer: bet amount -->
        <div class="tw-challenge-footer">
          <span class="tw-challenge-amount">
            <i class="fas fa-coins"></i> {{ defi.bet_amount.toLocaleString() }} EBT
          </span>
          <span class="tw-challenge-action">{{ $t('common.view') }}<i class="fas fa-arrow-right"></i></span>
        </div>
      </div>
    </div>

    <!-- Empty (authenticated) -->
    <div v-else class="tw-empty-state">
      <i class="ti ti-swords tw-empty-state__icon"></i>
      <p>{{ $t('ui.no_challenges_available_be_the_first_to_create_one') }}</p>
      <button class="tw-btn tw-btn--primary mt-3" @click="createChallenge">
        <i class="ti ti-plus me-1"></i>{{ $t('ui.create_challenge') }}</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import apiClient from "@/utils/axios";

interface Challenge {
  id: number;
  game: string;
  bet_amount: number;
  status: string;
  creator: { id: number; username: string };
  opponent: { id: number; username: string } | null;
  expires_at: string | null;
}

const router = useRouter();
const defis = ref<Challenge[]>([]);
const loading = ref(false);

const isAuthenticated = computed(() => !!localStorage.getItem("auth_token"));

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

const getTimeRemaining = (expiresAt: string | null) => {
  if (!expiresAt) return "No expiry";
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d left`;
  if (hours > 0) return `${hours}h left`;
  return `${Math.floor(diff / 60000)}min left`;
};

const loadChallenges = async () => {
  if (!isAuthenticated.value) return;
  try {
    loading.value = true;
    const res = await apiClient.get("/challenges?open_only=true", {
      params: { per_page: 6 },
    });
    if (res.data.success) {
      defis.value = res.data.data.data || res.data.data || [];
    }
  } catch {
    defis.value = [];
  } finally {
    loading.value = false;
  }
};

const viewDetails = (id: number) => router.push(`/challenges/${id}`);
const createChallenge = () => router.push("/challenges?action=create");

onMounted(() => loadChallenges());
</script>

<style scoped>
.tw-section {
  padding: 24px 0 8px;
}

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

.tw-section-header__right {
  display: flex;
  align-items: center;
  gap: 12px;
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

.tw-badge-count {
  background: rgb(var(--g1));
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 10px;
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

.tw-live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #00c853;
  display: inline-block;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Auth CTA */
.tw-auth-cta {
  background: rgb(var(--p2));
  border: 1px solid rgb(var(--n2));
  border-radius: 8px;
  padding: 24px;
}

.tw-auth-cta__inner {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.tw-auth-cta__icon {
  font-size: 32px;
  color: rgb(var(--n3));
  flex-shrink: 0;
}

.tw-auth-cta__title {
  font-size: 15px;
  font-weight: 600;
  color: rgb(var(--n8));
  margin: 0 0 2px;
}

.tw-auth-cta__sub {
  font-size: 13px;
  color: rgb(var(--n3));
  margin: 0;
}

.tw-auth-cta__actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

/* Grid */
.tw-challenge-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 576px) { grid-template-columns: 1fr; }
}

/* Card */
.tw-challenge-card {
  background: rgb(var(--p2));
  border: 1px solid rgb(var(--n2));
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.2s;

  &:hover {
    border-color: rgb(var(--g1));
    transform: translateY(-3px);
  }
}

.tw-challenge-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.tw-challenge-status {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  gap: 5px;

  &--open {
    background: rgba(0, 200, 83, 0.15);
    color: #00c853;
  }

  &--closed {
    background: rgba(235, 0, 40, 0.12);
    color: rgb(var(--r1));
  }
}

.tw-challenge-timer {
  font-size: 12px;
  color: rgb(var(--n3));
}

.tw-challenge-game {
  font-size: 14px;
  font-weight: 600;
  color: rgb(var(--n8));
  margin: 0 0 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* VS row */
.tw-challenge-teams {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.tw-challenge-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.tw-challenge-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgb(var(--g1));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #fff;

  &--ghost {
    background: rgb(var(--n2));
    color: rgb(var(--n3));
    font-size: 18px;
  }
}

.tw-challenge-username {
  font-size: 12px;
  color: rgb(var(--n3));
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
}

.tw-challenge-vs {
  font-size: 12px;
  font-weight: 800;
  color: rgb(var(--r1));
  letter-spacing: 0.05em;
  flex-shrink: 0;
}

/* Footer */
.tw-challenge-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgb(var(--n2));
}

.tw-challenge-amount {
  font-size: 13px;
  font-weight: 700;
  color: rgb(var(--g1));
  display: flex;
  align-items: center;
  gap: 4px;
}

.tw-challenge-action {
  font-size: 12px;
  color: rgb(var(--n3));
  display: flex;
  align-items: center;
  gap: 3px;
}

/* Buttons */
.tw-btn {
  height: 36px;
  padding: 0 16px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  transition: all 0.2s;

  &--primary {
    background: rgb(var(--g1));
    color: #fff;
    &:hover { background: rgba(var(--g1), 0.85); color: #fff; }
  }

  &--secondary {
    background: rgba(var(--n8), 0.1);
    color: rgb(var(--n8));
    &:hover { background: rgba(var(--n8), 0.18); color: rgb(var(--n8)); }
  }
}

.mt-3 { margin-top: 12px; }
.me-1 { margin-right: 4px; }

/* Empty state */
.tw-empty-state {
  text-align: center;
  padding: 40px 0;
  color: rgb(var(--n3));

  &__icon { font-size: 48px; margin-bottom: 12px; display: block; opacity: 0.4; }
  p { font-size: 14px; margin: 0; }
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(90deg, rgb(var(--p2)) 25%, rgb(var(--p3)) 50%, rgb(var(--p2)) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.mb-2 { margin-bottom: 8px; }
.mb-4 { margin-bottom: 16px; }

.tw-challenge-card--skeleton {
  .tw-challenge-teams {
    justify-content: center;
    gap: 16px;
  }
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
