<template>
  <div class="tw-page">

    <!-- Hero -->
    <div class="tw-page-hero">
      <p class="tw-page-hero__eyebrow">
        <i class="fas fa-gamepad"></i>{{ $t('ui.ebetstream_arena') }}</p>
      <h1 class="tw-page-hero__title">{{ $t('ui.ar_ne_comp_titive_5v5') }}</h1>
      <p class="tw-page-hero__sub">
        Matchs rapides, classement EOL, paris sécurisés ESBS en EBT.
      </p>
      <div v-if="stats" class="arena-live-stats">
        <div class="arena-live-stat">
          <span class="arena-live-stat__val">{{ stats.live_matches }}</span>
          <span class="arena-live-stat__lbl">{{ $t('ui.en_direct') }}</span>
        </div>
        <div class="arena-live-stat">
          <span class="arena-live-stat__val">{{ stats.scheduled_matches }}</span>
          <span class="arena-live-stat__lbl">{{ $t('ui.programm_s') }}</span>
        </div>
        <div class="arena-live-stat">
          <span class="arena-live-stat__val">{{ stats.total_players }}</span>
          <span class="arena-live-stat__lbl">{{ $t('ui.joueurs') }}</span>
        </div>
        <div class="arena-live-stat">
          <span class="arena-live-stat__val">EBT</span>
          <span class="arena-live-stat__lbl">{{ $t('ui.monnaie') }}</span>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tw-tabs">
      <button class="tw-tab" :class="{ active: tab === 'matches' }" @click="tab = 'matches'">
        <i class="fas fa-list me-1"></i>{{ $t('ui.matchs') }}</button>
      <button class="tw-tab" :class="{ active: tab === 'leaderboard' }" @click="tab = 'leaderboard'; loadLeaderboard()">
        <i class="fas fa-trophy me-1"></i>{{ $t('ui.classement') }}</button>
      <button class="tw-tab" :class="{ active: tab === 'profile' }" @click="tab = 'profile'; loadProfile()">
        <i class="fas fa-user me-1"></i>{{ $t('ui.mon_profil') }}</button>
    </div>

    <!-- ── MATCHS ── -->
    <div v-if="tab === 'matches'">
      <div class="tw-filters mb-3">
        <button class="tw-filter-btn" :class="{ active: matchFilter === null }" @click="matchFilter = null; loadMatches()">{{ $t('ui.tous') }}</button>
        <button class="tw-filter-btn" :class="{ active: matchFilter === 'live' }" @click="matchFilter = 'live'; loadMatches()">{{ $t('betting.live') }}</button>
        <button class="tw-filter-btn" :class="{ active: matchFilter === 'scheduled' }" @click="matchFilter = 'scheduled'; loadMatches()">{{ $t('ui.programm_s') }}</button>
        <button class="tw-filter-btn" :class="{ active: matchFilter === 'completed' }" @click="matchFilter = 'completed'; loadMatches()">{{ $t('ui.termin_s') }}</button>
        <button class="tw-filter-btn refresh-btn" @click="loadMatches()" :disabled="loadingMatches">
          <i class="fas fa-sync-alt { 'fa-spin': loadingMatches }"></i>
        </button>
      </div>

      <div v-if="loadingMatches" class="tw-empty"><div class="spinner"></div></div>
      <div v-else-if="matches.length === 0" class="tw-empty">
        <div class="tw-empty__icon"><i class="fas fa-gamepad"></i></div>
        <p class="tw-empty__title">{{ $t('ui.aucun_match') }}</p>
        <p class="tw-empty__sub">{{ $t('ui.cr_ez_un_profil_et_lancez_un_quick_match') }}</p>
      </div>
      <div v-else class="arena-match-list">
        <div
          v-for="match in matches"
          :key="match.id"
          class="tw-card tw-card--clickable arena-match-card"
          @click="$router.push(`/arena/matches/${match.id}`)"
        >
          <div class="arena-match-card__top">
            <span class="tw-badge" :class="statusBadge(match.status)">
              <span v-if="match.status === 'live'" class="tw-live-dot"></span>
              {{ statusLabel(match.status) }}
            </span>
            <span class="tw-muted">{{ modeLabel(match.mode) }}</span>
          </div>
          <div class="arena-match-card__teams">
            <span class="arena-match-card__team">{{ match.team1_name }}</span>
            <span class="arena-match-card__vs">{{ $t('labels.vs') }}</span>
            <span class="arena-match-card__team">{{ match.team2_name }}</span>
          </div>
          <div v-if="match.status === 'completed'" class="arena-match-card__score">
            {{ match.team1_score }} – {{ match.team2_score }}
          </div>
          <div class="arena-match-card__meta">
            <span v-if="match.scheduled_at">
              <i class="fas fa-clock me-1"></i>{{ formatDate(match.scheduled_at) }}
            </span>
            <span><i class="fas fa-coins me-1"></i>{{ match.team1_odds }} / {{ match.team2_odds }}</span>
            <span><i class="fas fa-users me-1"></i>{{ match.players_count || 0 }} joueurs</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── CLASSEMENT ── -->
    <div v-if="tab === 'leaderboard'">
      <div v-if="loadingLeaderboard" class="tw-empty"><div class="spinner"></div></div>
      <div v-else-if="leaderboard.length === 0" class="tw-empty">
        <p class="tw-empty__title">{{ $t('ui.classement_vide') }}</p>
      </div>
      <div v-else class="tw-content-block p-0 overflow-hidden">
        <table class="arena-lb-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{{ $t('ui.joueur') }}</th>
              <th>{{ $t('ui.classe') }}</th>
              <th>{{ $t('ui.rang') }}</th>
              <th>MMR</th>
              <th>{{ $t('ui.victoires') }}</th>
              <th>{{ $t('ui.win_3') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in leaderboard" :key="p.user_id">
              <td class="arena-lb-rank">{{ p.position }}</td>
              <td><strong>{{ p.username }}</strong></td>
              <td><span class="tw-badge tw-badge--pending">{{ classLabel(p.player_class) }}</span></td>
              <td>{{ rankLabel(p.rank) }}</td>
              <td class="tw-accent">{{ p.mmr }}</td>
              <td>{{ p.matches_won }}/{{ p.matches_played }}</td>
              <td>{{ p.win_rate }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── PROFIL ── -->
    <div v-if="tab === 'profile'">
      <div v-if="!isAuthenticated" class="tw-info-box mb-4">
        <i class="fas fa-sign-in-alt"></i>
        <p>{{ $t('ui.connectez_vous_pour_cr_er_votre_profil_arena_et_rejoindre_de') }}</p>
      </div>
      <router-link v-if="!isAuthenticated" to="/login" class="tw-btn tw-btn--primary mb-4">
        <i class="fas fa-sign-in-alt"></i>{{ $t('ui.se_connecter') }}</router-link>

      <template v-else>
        <div class="tw-content-block mb-4">
          <h3 class="arena-block__title mb-3">{{ $t('ui.choisir_votre_classe') }}</h3>
          <div class="tw-grid-4 mb-4">
            <button
              v-for="cls in classes"
              :key="cls.id"
              class="arena-class-btn"
              :class="{ active: selectedClass === cls.id }"
              @click="selectedClass = cls.id"
            >
              <i :class="cls.icon"></i>
              <span>{{ cls.label }}</span>
              <small>{{ cls.desc }}</small>
            </button>
          </div>
          <button class="tw-btn tw-btn--primary" @click="saveProfile" :disabled="savingProfile">
            <i class="fas fa-save"></i>
            {{ profile ? t('arena.updateProfile') : t('arena.createProfile') }}
          </button>
          <p v-if="profileMsg" class="mt-3 mb-0" :class="profileMsgOk ? 'tw-accent' : 'text-danger'">{{ profileMsg }}</p>
        </div>

        <div v-if="profile" class="tw-grid-3 mb-4">
          <div class="tw-stat-card">
            <span class="tw-stat-card__value">{{ profile.mmr }}</span>
            <span class="tw-stat-card__label">MMR</span>
          </div>
          <div class="tw-stat-card">
            <span class="tw-stat-card__value">{{ rankLabel(profile.rank) }}</span>
            <span class="tw-stat-card__label">{{ $t('ui.rang') }}</span>
          </div>
          <div class="tw-stat-card">
            <span class="tw-stat-card__value">{{ profile.matches_won }}/{{ profile.matches_played }}</span>
            <span class="tw-stat-card__label">{{ $t('ui.victoires') }}</span>
          </div>
        </div>

        <div class="tw-content-block">
          <h3 class="arena-block__title mb-3">{{ $t('common.actions') }}</h3>
          <div class="d-flex gap-3 flex-wrap">
            <button class="tw-btn tw-btn--primary" @click="quickMatch" :disabled="!profile || quickMatching">
              <i class="fas fa-bolt"></i>
              {{ quickMatching ? t('arena.searching') : 'Quick Match' }}
            </button>
            <button class="tw-btn tw-btn--primary" @click="rankedMatch" :disabled="!profile || rankedMatching">
              <i class="fas fa-trophy"></i>
              {{ rankedMatching ? t('arena.searching') : 'Ranked' }}
            </button>
            <button class="tw-btn tw-btn--secondary" @click="showPrivateModal = true" :disabled="!profile">
              <i class="fas fa-lock"></i>{{ $t('ui.match_priv') }}</button>
            <button class="tw-btn tw-btn--secondary" @click="showTournamentModal = true" :disabled="!profile">
              <i class="fas fa-medal"></i>{{ $t('ui.tournoi') }}</button>
          </div>
          <p v-if="quickMsg" class="mt-3 mb-0 tw-accent">{{ quickMsg }}</p>
        </div>
      </template>
    </div>

    <!-- Modal match privé -->
    <div v-if="showPrivateModal" class="tw-modal-overlay" @click.self="showPrivateModal = false">
      <div class="tw-modal">
        <div class="tw-modal__header">
          <h3 class="tw-modal__title">{{ $t('ui.cr_er_un_match_priv') }}</h3>
          <button class="tw-modal__close" @click="showPrivateModal = false"><i class="fas fa-times"></i></button>
        </div>
        <div class="tw-modal__body">
          <div class="tw-form-group">
            <label class="tw-label">{{ $t('ui.quipe_1') }}</label>
            <input v-model="privateForm.team1_name" class="tw-input" :placeholder="$t('ui.nom_quipe_1')" />
          </div>
          <div class="tw-form-group">
            <label class="tw-label">{{ $t('ui.quipe_2') }}</label>
            <input v-model="privateForm.team2_name" class="tw-input" :placeholder="$t('ui.nom_quipe_2')" />
          </div>
        </div>
        <div class="tw-modal__footer">
          <button class="tw-btn tw-btn--secondary" @click="showPrivateModal = false">{{ $t('ui.annuler') }}</button>
          <button class="tw-btn tw-btn--primary" @click="createPrivateMatch" :disabled="creatingPrivate">
            {{ $t('ui.cr_er') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal tournoi -->
    <div v-if="showTournamentModal" class="tw-modal-overlay" @click.self="showTournamentModal = false">
      <div class="tw-modal">
        <div class="tw-modal__header">
          <h3 class="tw-modal__title">{{ $t('ui.cr_er_un_match_tournoi') }}</h3>
          <button class="tw-modal__close" @click="showTournamentModal = false"><i class="fas fa-times"></i></button>
        </div>
        <div class="tw-modal__body">
          <div class="tw-form-group">
            <label class="tw-label">{{ $t('ui.quipe_1') }}</label>
            <input v-model="tournamentForm.team1_name" class="tw-input" :placeholder="$t('ui.nom_quipe_1')" />
          </div>
          <div class="tw-form-group">
            <label class="tw-label">{{ $t('ui.quipe_2') }}</label>
            <input v-model="tournamentForm.team2_name" class="tw-input" :placeholder="$t('ui.nom_quipe_2')" />
          </div>
        </div>
        <div class="tw-modal__footer">
          <button class="tw-btn tw-btn--secondary" @click="showTournamentModal = false">{{ $t('ui.annuler') }}</button>
          <button class="tw-btn tw-btn--primary" @click="createTournamentMatch" :disabled="creatingTournament">
            {{ $t('ui.cr_er') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/utils/axios';

const router = useRouter();
const tab = ref<'matches' | 'leaderboard' | 'profile'>('matches');
const stats = ref<any>(null);
const matches = ref<any[]>([]);
const leaderboard = ref<any[]>([]);
const profile = ref<any>(null);
const loadingMatches = ref(false);
const loadingLeaderboard = ref(false);
const savingProfile = ref(false);
const quickMatching = ref(false);
const rankedMatching = ref(false);
const creatingPrivate = ref(false);
const creatingTournament = ref(false);
const matchFilter = ref<string | null>(null);
const selectedClass = ref('attacker');
const profileMsg = ref('');
const profileMsgOk = ref(false);
const quickMsg = ref('');
const showPrivateModal = ref(false);
const showTournamentModal = ref(false);
const privateForm = ref({ team1_name: '', team2_name: '' });
const tournamentForm = ref({ team1_name: '', team2_name: '' });

const isAuthenticated = computed(() => !!localStorage.getItem('auth_token'));

const classes = computed(() => [
  { id: 'attacker', label: 'Attacker', icon: 'fas fa-bolt', desc: t('arena.classAttackerDesc') },
  { id: 'defender', label: 'Defender', icon: 'fas fa-shield-alt', desc: t('arena.classDefenderDesc') },
  { id: 'support', label: 'Support', icon: 'fas fa-heart', desc: t('arena.classSupportDesc') },
  { id: 'tactical', label: 'Tactical', icon: 'fas fa-crosshairs', desc: t('arena.classTacticalDesc') },
]);

const loadStats = async () => {
  try {
    const res = await apiClient.get('/arena/stats');
    if (res.data.success) stats.value = res.data.data;
  } catch { /* ignore */ }
};

const loadMatches = async () => {
  loadingMatches.value = true;
  try {
    const params: any = {};
    if (matchFilter.value) params.status = matchFilter.value;
    const res = await apiClient.get('/arena/matches', { params });
    if (res.data.success) matches.value = res.data.data;
  } catch {
    matches.value = [];
  } finally {
    loadingMatches.value = false;
  }
};

const loadLeaderboard = async () => {
  loadingLeaderboard.value = true;
  try {
    const res = await apiClient.get('/arena/leaderboard');
    if (res.data.success) leaderboard.value = res.data.data;
  } catch {
    leaderboard.value = [];
  } finally {
    loadingLeaderboard.value = false;
  }
};

const loadProfile = async () => {
  if (!isAuthenticated.value) return;
  try {
    const res = await apiClient.get('/arena/profile');
    if (res.data.success) {
      profile.value = res.data.data;
      if (profile.value?.player_class) selectedClass.value = profile.value.player_class;
    }
  } catch { /* ignore */ }
};

const saveProfile = async () => {
  savingProfile.value = true;
  profileMsg.value = '';
  try {
    const res = await apiClient.post('/arena/profile', { player_class: selectedClass.value });
    if (res.data.success) {
      profile.value = res.data.data;
      profileMsg.value = t('arena.profileSaved');
      profileMsgOk.value = true;
    }
  } catch (err: any) {
    profileMsg.value = err.response?.data?.message || t('errors.generic');
    profileMsgOk.value = false;
  } finally {
    savingProfile.value = false;
  }
};

const quickMatch = async () => {
  quickMatching.value = true;
  quickMsg.value = '';
  try {
    const res = await apiClient.post('/arena/quick-match');
    if (res.data.success) {
      quickMsg.value = res.data.message;
      tab.value = 'matches';
      await loadMatches();
      if (res.data.data?.id) router.push(`/arena/matches/${res.data.data.id}`);
    }
  } catch (err: any) {
    quickMsg.value = err.response?.data?.message || t('errors.generic');
  } finally {
    quickMatching.value = false;
  }
};

const rankedMatch = async () => {
  rankedMatching.value = true;
  quickMsg.value = '';
  try {
    const res = await apiClient.post('/arena/ranked-match');
    if (res.data.success) {
      quickMsg.value = res.data.message;
      tab.value = 'matches';
      await loadMatches();
      if (res.data.data?.id) router.push(`/arena/matches/${res.data.data.id}`);
    }
  } catch (err: any) {
    quickMsg.value = err.response?.data?.message || t('errors.generic');
  } finally {
    rankedMatching.value = false;
  }
};

const createPrivateMatch = async () => {
  creatingPrivate.value = true;
  try {
    const res = await apiClient.post('/arena/matches', privateForm.value);
    if (res.data.success) {
      showPrivateModal.value = false;
      tab.value = 'matches';
      await loadMatches();
      router.push(`/arena/matches/${res.data.data.id}`);
    }
  } catch (err: any) {
    alert(err.response?.data?.message || t('errors.generic'));
  } finally {
    creatingPrivate.value = false;
  }
};

const createTournamentMatch = async () => {
  creatingTournament.value = true;
  try {
    const res = await apiClient.post('/arena/tournament-match', tournamentForm.value);
    if (res.data.success) {
      showTournamentModal.value = false;
      tab.value = 'matches';
      await loadMatches();
      router.push(`/arena/matches/${res.data.data.id}`);
    }
  } catch (err: any) {
    alert(err.response?.data?.message || t('errors.generic'));
  } finally {
    creatingTournament.value = false;
  }
};

const statusBadge = (s: string) => ({
  live: 'tw-badge--live',
  scheduled: 'tw-badge--open',
  waiting: 'tw-badge--pending',
  completed: 'tw-badge--closed',
}[s] || 'tw-badge--closed');

const statusLabel = (s: string) => ({
  live: t('labels.live'), scheduled: t('arena.statusScheduled'), waiting: t('arena.statusWaiting'),
  completed: t('arena.statusCompleted'), cancelled: t('arena.statusCancelled'),
}[s] || s);

const modeLabel = (m: string) => ({
  quick_match: 'Quick Match', ranked: 'Ranked',
  tournament: t('arena.modeTournament'), private_match: t('arena.modePrivate'),
}[m] || m);

const classLabel = (c: string) => ({
  attacker: 'Attacker', defender: 'Defender', support: 'Support', tactical: 'Tactical',
}[c] || c);

const rankLabel = (r: string) => ({
  bronze: 'Bronze', silver: 'Silver', gold: 'Gold', elite: 'Elite', champion: 'Champion',
}[r] || r);

const formatDate = (d: string) => new Date(d).toLocaleString('fr-FR', {
  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
});

onMounted(() => {
  loadStats();
  loadMatches();
});
</script>

<style scoped>
.arena-live-stats {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: 1.25rem;
}
.arena-live-stat__val {
  display: block;
  font-size: 1.4rem;
  font-weight: 800;
  color: rgb(var(--g1));
}
.arena-live-stat__lbl {
  font-size: 0.75rem;
  color: rgb(var(--n3));
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.arena-match-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.arena-match-card {
  padding: 16px;
}
.arena-match-card__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.arena-match-card__teams {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
.arena-match-card__team {
  font-weight: 700;
  color: rgb(var(--n8));
  font-size: 0.95rem;
}
.arena-match-card__vs {
  font-size: 0.75rem;
  font-weight: 800;
  color: rgb(var(--g1));
}
.arena-match-card__score {
  font-size: 1.2rem;
  font-weight: 800;
  color: rgb(var(--g1));
  margin-bottom: 8px;
}
.arena-match-card__meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 0.8rem;
  color: rgb(var(--n3));
}
.arena-lb-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}
.arena-lb-table th,
.arena-lb-table td {
  padding: 10px 14px;
  border-bottom: 1px solid rgb(var(--n2));
  color: rgb(var(--n5));
}
.arena-lb-table th {
  color: rgb(var(--n8));
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
}
.arena-lb-rank {
  font-weight: 800;
  color: rgb(var(--g1));
}
.tw-accent { color: rgb(var(--g1)); }
.arena-block__title {
  font-size: 1rem;
  font-weight: 700;
  color: rgb(var(--n8));
  margin: 0;
}
.arena-class-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 10px;
  background: rgb(var(--p2));
  border: 1px solid rgb(var(--n2));
  border-radius: 8px;
  cursor: pointer;
  color: rgb(var(--n5));
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.15s;
}
.arena-class-btn i { font-size: 1.3rem; color: rgb(var(--g1)); }
.arena-class-btn small { font-size: 0.7rem; color: rgb(var(--n3)); font-weight: 400; }
.arena-class-btn.active,
.arena-class-btn:hover {
  border-color: rgb(var(--g1));
  background: rgba(var(--g1), 0.1);
  color: rgb(var(--n8));
}
</style>
