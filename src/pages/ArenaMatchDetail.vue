<template>
  <div class="tw-page">

    <div v-if="loading" class="tw-empty"><div class="spinner"></div></div>

    <div v-else-if="error" class="tw-empty">
      <div class="tw-empty__icon"><i class="fas fa-exclamation-triangle"></i></div>
      <p class="tw-empty__title">{{ error }}</p>
      <button class="tw-btn tw-btn--primary" @click="$router.push('/arena')">Retour à l'arène</button>
    </div>

    <template v-else-if="match">
      <button class="tw-btn tw-btn--secondary tw-detail-back" @click="$router.push('/arena')">
        <i class="fas fa-arrow-left"></i> Retour
      </button>

      <div class="tw-page-hero mb-4">
        <div class="d-flex align-items-center gap-3 mb-3 flex-wrap">
          <span class="tw-badge" :class="statusBadge(match.status)">
            <span v-if="match.status === 'live'" class="tw-live-dot"></span>
            {{ statusLabel(match.status) }}
          </span>
          <span class="tw-badge tw-badge--pending">{{ modeLabel(match.mode) }}</span>
          <span class="tw-badge tw-badge--ongoing">EOL — {{ tierLabel(match.league_tier) }}</span>
        </div>
        <h1 class="tw-page-hero__title">
          {{ match.team1_name }} <span class="tw-accent">VS</span> {{ match.team2_name }}
        </h1>
        <p v-if="match.status === 'completed'" class="tw-page-hero__sub">
          Score final : <strong>{{ match.team1_score }} – {{ match.team2_score }}</strong>
        </p>
        <p v-else-if="match.scheduled_at" class="tw-page-hero__sub">
          <i class="fas fa-clock me-1"></i>{{ formatDate(match.scheduled_at) }}
        </p>
      </div>

      <div class="tw-grid-2">
        <!-- Infos match -->
        <div class="tw-content-block">
          <h4 class="mb-4">Informations du match</h4>

          <div v-if="isAuthenticated && ['waiting','scheduled'].includes(match.status)" class="mb-4 d-flex gap-2 flex-wrap">
            <button
              v-if="!match.is_joined"
              class="tw-btn tw-btn--primary"
              :disabled="joining"
              @click="joinMatch"
            >
              <i class="fas fa-user-plus"></i> Rejoindre le match
            </button>
            <button
              v-else-if="match.status === 'waiting'"
              class="tw-btn tw-btn--secondary"
              :disabled="leaving"
              @click="leaveMatch"
            >
              <i class="fas fa-sign-out-alt"></i> Quitter
            </button>
            <span v-else class="tw-badge tw-badge--open">Inscrit — {{ match.my_team === 'team1' ? match.team1_name : match.team2_name }}</span>
          </div>

          <div v-if="match.my_bet" class="tw-info-box mb-4">
            <i class="fas fa-ticket-alt"></i>
            <p class="mb-0">Votre pari : <strong>{{ match.my_bet.amount }} EBT</strong> sur {{ betTypeLabel(match.my_bet.bet_type) }} — <span>{{ match.my_bet.status }}</span></p>
          </div>

          <div class="tw-grid-2 mb-4">
            <div class="tw-stat-card">
              <span class="tw-stat-card__value">{{ match.team1_odds }}</span>
              <span class="tw-stat-card__label">Cote {{ match.team1_name }}</span>
            </div>
            <div class="tw-stat-card">
              <span class="tw-stat-card__value">{{ match.team2_odds }}</span>
              <span class="tw-stat-card__label">Cote {{ match.team2_name }}</span>
            </div>
          </div>

          <h5 class="mb-3">Joueurs inscrits ({{ match.players?.length || 0 }})</h5>
          <div v-if="!match.players?.length" class="tw-muted">Aucun joueur inscrit</div>
          <div v-else class="arena-players">
            <div v-for="p in match.players" :key="p.id" class="arena-player-row">
              <span class="tw-badge" :class="p.team === 'team1' ? 'tw-badge--open' : 'tw-badge--ongoing'">
                {{ p.team === 'team1' ? match.team1_name : match.team2_name }}
              </span>
              <strong>{{ p.user?.username }}</strong>
              <span class="tw-muted">{{ classLabel(p.player_class) }}</span>
              <span v-if="p.is_mvp" class="tw-badge tw-badge--live">MVP</span>
            </div>
          </div>
        </div>

        <!-- Paris ESBS -->
        <div class="tw-content-block">
          <h4 class="mb-2">
            <i class="fas fa-shield-alt tw-accent me-2"></i>Paris ESBS
          </h4>
          <p class="tw-muted mb-4" style="font-size: 0.85rem;">
            Système sécurisé interne — fonds bloqués, résultat vérifié par le serveur, paiement automatique en EBT.
          </p>

          <div v-if="!canBet" class="tw-alert tw-alert--warning">
            <i class="fas fa-info-circle"></i>
            <span>Paris fermés pour ce match (statut : {{ statusLabel(match.status) }})</span>
          </div>

          <template v-else>
            <div v-if="!isAuthenticated" class="tw-info-box mb-4">
              <i class="fas fa-sign-in-alt"></i>
              <p>Connectez-vous pour parier en EBT.</p>
            </div>

            <template v-else>
              <p class="tw-muted mb-3">Solde disponible : <strong class="tw-accent">{{ walletBalance.toFixed(2) }} EBT</strong></p>

              <div class="tw-form-group">
                <label class="tw-label">Montant (EBT)</label>
                <input v-model.number="betAmount" type="number" min="0.01" step="0.01" class="tw-input" placeholder="10.00" />
              </div>

              <div class="tw-form-group">
                <label class="tw-label">Parier sur</label>
                <div class="d-flex flex-column gap-2">
                  <button
                    class="tw-filter-btn text-start"
                    :class="{ active: betType === 'team1_win' }"
                    @click="betType = 'team1_win'"
                  >
                    {{ match.team1_name }} — cote {{ match.team1_odds }}
                    <span v-if="betAmount && betAmount > 0" class="tw-muted ms-2">
                      (gain potentiel : {{ (betAmount * match.team1_odds).toFixed(2) }} EBT)
                    </span>
                  </button>
                  <button
                    class="tw-filter-btn text-start"
                    :class="{ active: betType === 'team2_win' }"
                    @click="betType = 'team2_win'"
                  >
                    {{ match.team2_name }} — cote {{ match.team2_odds }}
                    <span v-if="betAmount && betAmount > 0" class="tw-muted ms-2">
                      (gain potentiel : {{ (betAmount * match.team2_odds).toFixed(2) }} EBT)
                    </span>
                  </button>
                </div>
              </div>

              <div v-if="betError" class="tw-alert tw-alert--error mb-3">{{ betError }}</div>
              <div v-if="betSuccess" class="tw-alert tw-alert--success mb-3">{{ betSuccess }}</div>

              <button
                class="tw-btn tw-btn--primary w-100"
                @click="placeBet"
                :disabled="placingBet || !betAmount || !betType"
              >
                <i class="fas fa-coins"></i>
                {{ placingBet ? 'Placement...' : 'Placer le pari (ESBS)' }}
              </button>
            </template>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import apiClient from '@/utils/axios';

const route = useRoute();
const match = ref<any>(null);
const loading = ref(true);
const error = ref('');
const walletBalance = ref(0);
const betAmount = ref<number | null>(null);
const betType = ref<string | null>(null);
const placingBet = ref(false);
const joining = ref(false);
const leaving = ref(false);
const betError = ref('');
const betSuccess = ref('');
let pollTimer: ReturnType<typeof setInterval> | null = null;

const isAuthenticated = computed(() => !!localStorage.getItem('auth_token'));
const canBet = computed(() => match.value && ['scheduled', 'live', 'waiting'].includes(match.value.status));

const loadMatch = async () => {
  error.value = '';
  try {
    const res = await apiClient.get(`/arena/matches/${route.params.id}`);
    if (res.data.success) match.value = res.data.data;
  } catch {
    if (loading.value) error.value = 'Match introuvable';
  } finally {
    loading.value = false;
  }
};

const joinMatch = async () => {
  joining.value = true;
  try {
    const res = await apiClient.post(`/arena/matches/${route.params.id}/join`);
    if (res.data.success) {
      match.value = { ...match.value, ...res.data.data, is_joined: true };
      await loadMatch();
    }
  } catch (err: any) {
    betError.value = err.response?.data?.message || 'Impossible de rejoindre';
  } finally {
    joining.value = false;
  }
};

const leaveMatch = async () => {
  leaving.value = true;
  try {
    await apiClient.post(`/arena/matches/${route.params.id}/leave`);
    await loadMatch();
  } catch (err: any) {
    betError.value = err.response?.data?.message || 'Erreur';
  } finally {
    leaving.value = false;
  }
};

const betTypeLabel = (t: string) => ({
  team1_win: match.value?.team1_name || 'Équipe 1',
  team2_win: match.value?.team2_name || 'Équipe 2',
  draw: 'Match nul',
}[t] || t);

const loadWallet = async () => {
  if (!isAuthenticated.value) return;
  try {
    const res = await apiClient.get('/wallet');
    if (res.data.success) {
      const w = res.data.data;
      walletBalance.value = parseFloat(w.balance || 0) - parseFloat(w.locked_balance || 0);
    }
  } catch { /* ignore */ }
};

const placeBet = async () => {
  betError.value = '';
  betSuccess.value = '';
  if (!betAmount.value || betAmount.value <= 0) {
    betError.value = 'Montant invalide';
    return;
  }
  if (!betType.value) {
    betError.value = 'Sélectionnez une équipe';
    return;
  }
  if (betAmount.value > walletBalance.value) {
    betError.value = `Solde insuffisant (${walletBalance.value.toFixed(2)} EBT disponibles)`;
    return;
  }
  placingBet.value = true;
  try {
    const res = await apiClient.post('/bets', {
      arena_match_id: match.value.id,
      bet_type: betType.value,
      amount: betAmount.value,
    });
    if (res.data.success) {
      betSuccess.value = 'Pari placé avec succès ! Fonds bloqués jusqu\'à la fin du match.';
      betAmount.value = null;
      betType.value = null;
      await loadWallet();
    }
  } catch (err: any) {
    betError.value = err.response?.data?.message || 'Erreur lors du pari';
  } finally {
    placingBet.value = false;
  }
};

const statusBadge = (s: string) => ({
  live: 'tw-badge--live', scheduled: 'tw-badge--open',
  waiting: 'tw-badge--pending', completed: 'tw-badge--closed',
}[s] || 'tw-badge--closed');

const statusLabel = (s: string) => ({
  live: 'LIVE', scheduled: 'Programmé', waiting: 'En attente', completed: 'Terminé',
}[s] || s);

const modeLabel = (m: string) => ({
  quick_match: 'Quick Match', ranked: 'Ranked', tournament: 'Tournoi', private_match: 'Privé',
}[m] || m);

const tierLabel = (t: string) => ({
  amateur: 'Amateur', semi_pro: 'Semi-Pro', pro: 'Pro League', champion: 'Champion League',
}[t] || t);

const classLabel = (c: string) => ({
  attacker: 'Attacker', defender: 'Defender', support: 'Support', tactical: 'Tactical',
}[c] || c);

const formatDate = (d: string) => new Date(d).toLocaleString('fr-FR');

onMounted(async () => {
  loading.value = true;
  await loadMatch();
  await loadWallet();
  pollTimer = setInterval(() => {
    if (match.value && ['live', 'waiting', 'scheduled'].includes(match.value.status)) {
      loadMatch();
    }
  }, 15000);
});

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer);
});
</script>

<style scoped>
.tw-accent { color: rgb(var(--g1)); }
.arena-players { display: flex; flex-direction: column; gap: 8px; }
.arena-player-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgb(var(--p1));
  border: 1px solid rgb(var(--n2));
  border-radius: 6px;
  font-size: 0.85rem;
}
</style>
