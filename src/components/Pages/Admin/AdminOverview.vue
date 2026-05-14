<template>
  <div class="overview-root">

    <!-- ── KPI Row ── -->
    <div class="kpi-grid">
      <div v-for="kpi in kpiCards" :key="kpi.key" class="kpi-card" :class="kpi.colorClass">
        <div class="kpi-top">
          <div class="kpi-icon">
            <i :class="['ti', kpi.icon]"></i>
          </div>
          <span class="kpi-trend" :class="kpi.trendUp ? 'trend-up' : 'trend-down'">
            <i :class="['ti', kpi.trendUp ? 'ti-trending-up' : 'ti-trending-down']"></i>
            {{ kpi.trend }}
          </span>
        </div>
        <div class="kpi-value">{{ kpi.formatted }}</div>
        <div class="kpi-label">{{ kpi.label }}</div>
        <div class="kpi-bar"><div class="kpi-bar-fill" :style="{ width: kpi.barWidth }"></div></div>
      </div>
    </div>

    <!-- ── Row 2: Net balance + Quick actions ── -->
    <div class="mid-row">
      <!-- Balance card -->
      <div class="balance-card">
        <div class="balance-header">
          <div class="balance-icon"><i class="ti ti-chart-bar"></i></div>
          <span class="balance-title">{{ $t('ui.solde_net_de_la_plateforme') }}</span>
        </div>
        <div class="balance-amount" :class="netBalance >= 0 ? 'positive' : 'negative'">
          {{ netBalance >= 0 ? '+' : '' }}${{ formatNumber(Math.abs(netBalance)) }}
        </div>
        <div class="balance-sub">
          <div class="balance-item">
            <span class="bi-dot green"></span>
            <span>Dépôts : ${{ formatNumber(stats.totalDeposits) }}</span>
          </div>
          <div class="balance-item">
            <span class="bi-dot red"></span>
            <span>Retraits : ${{ formatNumber(stats.totalWithdrawals) }}</span>
          </div>
        </div>
        <div class="balance-ratio-bar">
          <div class="ratio-fill" :style="{ width: depositRatio + '%' }"></div>
        </div>
        <div class="ratio-labels">
          <span>Dépôts {{ depositRatio.toFixed(0) }}%</span>
          <span>Retraits {{ (100 - depositRatio).toFixed(0) }}%</span>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="quick-actions-card">
        <div class="qa-title">{{ $t('ui.actions_rapides') }}</div>
        <div class="qa-grid">
          <button v-for="qa in quickActions" :key="qa.label" class="qa-btn" :class="qa.cls">
            <i :class="['ti', qa.icon]"></i>
            <span>{{ qa.label }}</span>
          </button>
        </div>
      </div>

      <!-- Mini stats -->
      <div class="mini-stats-col">
        <div v-for="ms in miniStats" :key="ms.label" class="mini-stat">
          <div class="ms-icon" :class="ms.cls"><i :class="['ti', ms.icon]"></i></div>
          <div class="ms-body">
            <div class="ms-val">{{ ms.value }}</div>
            <div class="ms-label">{{ ms.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Top players + Top ambassadors ── -->
    <div class="tables-row">
      <!-- Top Players -->
      <div class="rank-table-card">
        <div class="rtc-header">
          <div class="rtc-title">
            <i class="fas fa-award"></i>
            <span>{{ $t('ui.top_10_joueurs') }}</span>
            <span class="rtc-period">{{ $t('ui.cette_semaine') }}</span>
          </div>
          <div v-if="loadingPlayers" class="rtc-loader">
            <div class="spin"></div>
          </div>
        </div>
        <div class="rtc-body">
          <div v-if="!loadingPlayers && topPlayers.length === 0" class="rtc-empty">
            <i class="ti ti-user-off"></i>
            <span>{{ $t('ui.aucun_joueur_cette_semaine') }}</span>
          </div>
          <div v-for="(player, idx) in topPlayers.slice(0, 10)" :key="player.id" class="rank-row">
            <div class="rank-badge" :class="getRankClass(idx)">{{ idx + 1 }}</div>
            <div class="rank-avatar">
              <img v-if="player.avatar_url" :src="player.avatar_url" :alt="$t('ui.player_name_2')" />
              <i v-else class="fas fa-user"></i>
            </div>
            <div class="rank-info">
              <span class="rank-name">{{ player.name }}</span>
              <span class="rank-sub">@{{ player.username }}</span>
            </div>
            <div class="rank-score">
              <span class="score-val">{{ player.score || 0 }}</span>
              <span class="score-unit">{{ $t('ui.pts') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Ambassadors -->
      <div class="rank-table-card">
        <div class="rtc-header">
          <div class="rtc-title">
            <i class="fas fa-star"></i>
            <span>{{ $t('ui.top_10_ambassadeurs') }}</span>
            <span class="rtc-period">{{ $t('ui.cette_semaine') }}</span>
          </div>
          <div v-if="loadingAmbassadors" class="rtc-loader">
            <div class="spin"></div>
          </div>
        </div>
        <div class="rtc-body">
          <div v-if="!loadingAmbassadors && topAmbassadors.length === 0" class="rtc-empty">
            <i class="ti ti-star-off"></i>
            <span>{{ $t('ui.aucun_ambassadeur_cette_semaine') }}</span>
          </div>
          <div v-for="(amb, idx) in topAmbassadors.slice(0, 10)" :key="amb.id" class="rank-row">
            <div class="rank-badge" :class="getRankClass(idx)">{{ idx + 1 }}</div>
            <div class="rank-avatar">
              <img v-if="amb.avatar_url" :src="amb.avatar_url" :alt="$t('ui.amb_name')" />
              <i v-else class="fas fa-user"></i>
            </div>
            <div class="rank-info">
              <span class="rank-name">{{ amb.name }}</span>
              <span class="rank-sub">@{{ amb.username }}</span>
            </div>
            <div class="rank-score">
              <span class="score-val">{{ amb.score || 0 }}</span>
              <span class="score-unit">{{ $t('ui.pts') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Partners ── -->
    <div class="partners-card">
      <div class="rtc-header">
        <div class="rtc-title">
          <i class="fas fa-building"></i>
          <span>{{ $t('ui.partenaires_d_veloppeurs') }}</span>
        </div>
        <div v-if="loadingPartners" class="rtc-loader"><div class="spin"></div></div>
      </div>
      <div v-if="!loadingPartners && topPartners.length === 0" class="rtc-empty">
        <i class="ti ti-building-off"></i>
        <span>{{ $t('ui.aucun_partenaire_disponible') }}</span>
      </div>
      <div class="partner-grid">
        <div v-for="p in topPartners" :key="p.id" class="partner-chip">
          <div class="partner-chip-avatar">
            <img v-if="p.avatar_url" :src="p.avatar_url" :alt="$t('ui.p_name')" />
            <i v-else class="fas fa-building"></i>
          </div>
          <div class="partner-chip-info">
            <span class="partner-chip-name">{{ p.name }}</span>
            <span class="partner-chip-spec">{{ p.specialty || 'Développeur' }}</span>
          </div>
          <span v-if="p.country" class="partner-chip-country">
            <i class="fas fa-map-marker-alt"></i> {{ p.country }}
          </span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { ref, computed, onMounted } from 'vue';
import apiClient from '@/utils/axios';

interface Stats {
  totalUsers: number;
  totalChallenges: number;
  totalStreams: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalAmbassadors: number;
  totalPartners: number;
}

const stats = ref<Stats>({
  totalUsers: 0, totalChallenges: 0, totalStreams: 0,
  totalDeposits: 0, totalWithdrawals: 0, totalAmbassadors: 0, totalPartners: 0,
});
const loading = ref(false);
const loadingAmbassadors = ref(false);
const loadingPartners = ref(false);
const loadingPlayers = ref(false);
const topAmbassadors = ref<any[]>([]);
const topPartners = ref<any[]>([]);
const topPlayers = ref<any[]>([]);

const netBalance = computed(() => (stats.value.totalDeposits || 0) - (stats.value.totalWithdrawals || 0));
const depositRatio = computed(() => {
  const total = (stats.value.totalDeposits || 0) + (stats.value.totalWithdrawals || 0);
  if (total === 0) return 50;
  return Math.min(100, Math.round((stats.value.totalDeposits / total) * 100));
});

const kpiCards = computed(() => [
  {
    key: 'users', label: 'Utilisateurs totaux', icon: 'ti-users',
    colorClass: 'kpi-purple', formatted: formatNumber(stats.value.totalUsers),
    trend: '+12%', trendUp: true, barWidth: '72%',
  },
  {
    key: 'challenges', label: 'Défis actifs', icon: 'ti-sword',
    colorClass: 'kpi-orange', formatted: formatNumber(stats.value.totalChallenges),
    trend: '+8%', trendUp: true, barWidth: '58%',
  },
  {
    key: 'streams', label: 'Streams live', icon: 'ti-video',
    colorClass: 'kpi-red', formatted: formatNumber(stats.value.totalStreams),
    trend: '+15%', trendUp: true, barWidth: '65%',
  },
  {
    key: 'deposits', label: 'Dépôts totaux', icon: 'ti-wallet',
    colorClass: 'kpi-green', formatted: '$' + formatNumber(stats.value.totalDeposits),
    trend: '+20%', trendUp: true, barWidth: '80%',
  },
]);

const miniStats = computed(() => [
  { label: 'Ambassadeurs', value: formatNumber(stats.value.totalAmbassadors), icon: 'ti-star', cls: 'ms-yellow' },
  { label: 'Partenaires', value: formatNumber(stats.value.totalPartners), icon: 'ti-building', cls: 'ms-cyan' },
  { label: 'Retraits totaux', value: '$' + formatNumber(stats.value.totalWithdrawals), icon: 'ti-credit-card', cls: 'ms-pink' },
]);

const quickActions = [
  { label: 'Nouveau utilisateur', icon: 'ti-user-plus', cls: 'qa-blue' },
  { label: 'Créer un défi', icon: 'ti-sword', cls: 'qa-orange' },
  { label: 'Ajouter un event', icon: 'ti-calendar-plus', cls: 'qa-purple' },
  { label: 'Code promo', icon: 'ti-ticket', cls: 'qa-green' },
  { label: 'Méthode paiement', icon: 'ti-credit-card', cls: 'qa-cyan' },
  { label: 'Voir rapports', icon: 'ti-chart-bar', cls: 'qa-red' },
];

const formatNumber = (n: number | null | undefined) => {
  if (n === null || n === undefined || isNaN(n)) return '0';
  return new Intl.NumberFormat('fr-FR').format(n);
};

const getRankClass = (idx: number) => {
  if (idx === 0) return 'rank-gold';
  if (idx === 1) return 'rank-silver';
  if (idx === 2) return 'rank-bronze';
  return 'rank-default';
};

const loadStats = async () => {
  try {
    loading.value = true;
    const r = await apiClient.get('/admin/stats');
    if (r.data.success && r.data.data) {
      const d = r.data.data;
      stats.value = {
        totalUsers: d.totalUsers || 0,
        totalChallenges: d.totalChallenges || 0,
        totalStreams: d.totalStreams || 0,
        totalDeposits: d.totalDeposits || 0,
        totalWithdrawals: d.totalWithdrawals || 0,
        totalAmbassadors: d.totalAmbassadors || 0,
        totalPartners: d.totalPartners || 0,
      };
    }
  } catch { /* silent */ }
  finally { loading.value = false; }
};

const loadTopAmbassadors = async () => {
  try {
    loadingAmbassadors.value = true;
    const r = await apiClient.get('/ambassadors', { params: { limit: 10, sort: 'score', order: 'desc' } });
    if (r.data.success) topAmbassadors.value = Array.isArray(r.data.data) ? r.data.data : [];
  } catch { topAmbassadors.value = []; }
  finally { loadingAmbassadors.value = false; }
};

const loadTopPartners = async () => {
  try {
    loadingPartners.value = true;
    const r = await apiClient.get('/partners', { params: { limit: 12 } });
    if (r.data.success) {
      const d = r.data.data;
      topPartners.value = Array.isArray(d) ? d : (d?.data || []);
    }
  } catch { topPartners.value = []; }
  finally { loadingPartners.value = false; }
};

const loadTopPlayers = async () => {
  try {
    loadingPlayers.value = true;
    const r = await apiClient.get('/top-players', { params: { limit: 10 } });
    if (r.data.success) topPlayers.value = Array.isArray(r.data.data) ? r.data.data : [];
  } catch { topPlayers.value = []; }
  finally { loadingPlayers.value = false; }
};

onMounted(() => {
  loadStats();
  loadTopPlayers();
  loadTopAmbassadors();
  loadTopPartners();
});
</script>

<style scoped>
.overview-root {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ── KPI grid ── */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.kpi-card {
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.06);
  transition: transform .2s, box-shadow .2s;
}

.kpi-card::after {
  content: '';
  position: absolute;
  right: -20px;
  bottom: -20px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255,255,255,.04);
}

.kpi-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0,0,0,.4);
}

.kpi-purple { background: linear-gradient(135deg, rgba(139,92,246,.18) 0%, rgba(109,40,217,.08) 100%); }
.kpi-orange { background: linear-gradient(135deg, rgba(251,146,60,.18) 0%, rgba(234,88,12,.08) 100%); }
.kpi-red    { background: linear-gradient(135deg, rgba(239,68,68,.18)  0%, rgba(185,28,28,.08) 100%); }
.kpi-green  { background: linear-gradient(135deg, rgba(34,197,94,.18)  0%, rgba(21,128,61,.08) 100%); }

.kpi-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.kpi-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  background: rgba(255,255,255,.1);
  color: #fff;
}

.kpi-purple .kpi-icon { background: rgba(139,92,246,.3); color: #a78bfa; }
.kpi-orange .kpi-icon { background: rgba(251,146,60,.3); color: #fb923c; }
.kpi-red    .kpi-icon { background: rgba(239,68,68,.3);  color: #f87171; }
.kpi-green  .kpi-icon { background: rgba(34,197,94,.3);  color: #4ade80; }

.kpi-trend {
  display: flex;
  align-items: center;
  gap: .25rem;
  font-size: .72rem;
  font-weight: 600;
  padding: .25rem .5rem;
  border-radius: 20px;
}

.trend-up   { background: rgba(34,197,94,.15); color: #4ade80; }
.trend-down { background: rgba(239,68,68,.15); color: #f87171; }

.kpi-value {
  color: #fff;
  font-size: 1.9rem;
  font-weight: 700;
  letter-spacing: -.5px;
  line-height: 1;
  margin-bottom: .3rem;
}

.kpi-label {
  color: rgba(255,255,255,.5);
  font-size: .78rem;
  font-weight: 500;
  margin-bottom: .9rem;
}

.kpi-bar {
  height: 4px;
  background: rgba(255,255,255,.08);
  border-radius: 2px;
  overflow: hidden;
}

.kpi-bar-fill {
  height: 100%;
  border-radius: 2px;
  background: rgba(255,255,255,.35);
  transition: width .8s ease;
}

/* ── Mid row ── */
.mid-row {
  display: grid;
  grid-template-columns: 1fr 1fr 240px;
  gap: 1rem;
}

/* Balance */
.balance-card {
  background: linear-gradient(135deg, rgba(15,27,66,.8) 0%, rgba(7,12,30,.9) 100%);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 16px;
  padding: 1.5rem;
}

.balance-header {
  display: flex;
  align-items: center;
  gap: .7rem;
  margin-bottom: 1.25rem;
}

.balance-icon {
  width: 36px;
  height: 36px;
  background: rgba(255,159,0,.15);
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff9f00;
  font-size: 1.05rem;
}

.balance-title {
  color: rgba(255,255,255,.7);
  font-size: .82rem;
  font-weight: 600;
}

.balance-amount {
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 1rem;
}

.balance-amount.positive { color: #4ade80; }
.balance-amount.negative { color: #f87171; }

.balance-sub {
  display: flex;
  flex-direction: column;
  gap: .4rem;
  margin-bottom: 1rem;
}

.balance-item {
  display: flex;
  align-items: center;
  gap: .5rem;
  color: rgba(255,255,255,.55);
  font-size: .78rem;
}

.bi-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.bi-dot.green { background: #4ade80; }
.bi-dot.red   { background: #f87171; }

.balance-ratio-bar {
  height: 6px;
  background: rgba(239,68,68,.25);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: .4rem;
}

.ratio-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ade80, #22c55e);
  border-radius: 3px;
  transition: width .8s ease;
}

.ratio-labels {
  display: flex;
  justify-content: space-between;
  color: rgba(255,255,255,.35);
  font-size: .7rem;
}

/* Quick actions */
.quick-actions-card {
  background: linear-gradient(135deg, rgba(15,27,66,.8) 0%, rgba(7,12,30,.9) 100%);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 16px;
  padding: 1.5rem;
}

.qa-title {
  color: rgba(255,255,255,.7);
  font-size: .8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .06em;
  margin-bottom: 1rem;
}

.qa-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .6rem;
}

.qa-btn {
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: .65rem .75rem;
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 10px;
  background: rgba(255,255,255,.04);
  color: rgba(255,255,255,.65);
  font-size: .75rem;
  font-weight: 500;
  cursor: pointer;
  transition: background .18s, border-color .18s, color .18s, transform .18s;
  text-align: left;
}

.qa-btn:hover { transform: translateY(-1px); border-color: rgba(255,255,255,.18); color: #fff; }
.qa-btn i { font-size: 1rem; }
.qa-blue:hover   { background: rgba(96,165,250,.12);  color: #60a5fa; }
.qa-orange:hover { background: rgba(251,146,60,.12); color: #fb923c; }
.qa-purple:hover { background: rgba(167,139,250,.12); color: #a78bfa; }
.qa-green:hover  { background: rgba(34,197,94,.12);  color: #4ade80; }
.qa-cyan:hover   { background: rgba(34,211,238,.12); color: #22d3ee; }
.qa-red:hover    { background: rgba(239,68,68,.12);  color: #f87171; }

/* Mini stats */
.mini-stats-col {
  display: flex;
  flex-direction: column;
  gap: .75rem;
}

.mini-stat {
  background: linear-gradient(135deg, rgba(15,27,66,.8) 0%, rgba(7,12,30,.9) 100%);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 14px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform .18s;
}

.mini-stat:hover { transform: translateX(3px); }

.ms-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.ms-yellow { background: rgba(250,204,21,.15); color: #facc15; }
.ms-cyan   { background: rgba(34,211,238,.15); color: #22d3ee; }
.ms-pink   { background: rgba(236,72,153,.15); color: #ec4899; }

.ms-val {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.2;
}

.ms-label {
  color: rgba(255,255,255,.45);
  font-size: .73rem;
}

/* ── Tables row ── */
.tables-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.rank-table-card, .partners-card {
  background: linear-gradient(135deg, rgba(15,27,66,.8) 0%, rgba(7,12,30,.9) 100%);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 16px;
  overflow: hidden;
}

.rtc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,.05);
}

.rtc-title {
  display: flex;
  align-items: center;
  gap: .6rem;
  color: rgba(255,255,255,.85);
  font-size: .88rem;
  font-weight: 700;
}

.rtc-title i { color: #ff9f00; font-size: 1.1rem; }

.rtc-period {
  color: rgba(255,255,255,.35);
  font-size: .72rem;
  font-weight: 500;
}

.rtc-loader { display: flex; align-items: center; }

.spin {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,.15);
  border-top-color: #ff9f00;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.rtc-body { padding: .5rem 0; }

.rtc-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .5rem;
  padding: 2rem;
  color: rgba(255,255,255,.3);
  font-size: .82rem;
}

.rtc-empty i { font-size: 1.8rem; }

.rank-row {
  display: flex;
  align-items: center;
  gap: .85rem;
  padding: .7rem 1.5rem;
  transition: background .15s;
}

.rank-row:hover { background: rgba(255,255,255,.04); }

.rank-badge {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: .7rem;
  font-weight: 700;
  flex-shrink: 0;
}

.rank-gold   { background: linear-gradient(135deg, #fbbf24, #d97706); color: #1c0; }
.rank-silver { background: linear-gradient(135deg, #9ca3af, #6b7280); color: #fff; }
.rank-bronze { background: linear-gradient(135deg, #d97706, #92400e); color: #fff; }
.rank-default{ background: rgba(255,255,255,.07); color: rgba(255,255,255,.5); }

.rank-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255,255,255,.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,.4);
  font-size: 1rem;
  flex-shrink: 0;
}

.rank-avatar img { width: 100%; height: 100%; object-fit: cover; }

.rank-info {
  flex: 1;
  min-width: 0;
}

.rank-name {
  display: block;
  color: rgba(255,255,255,.9);
  font-size: .82rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rank-sub {
  display: block;
  color: rgba(255,255,255,.35);
  font-size: .7rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rank-score {
  display: flex;
  align-items: baseline;
  gap: .2rem;
  flex-shrink: 0;
}

.score-val {
  color: #ff9f00;
  font-size: .88rem;
  font-weight: 700;
}

.score-unit {
  color: rgba(255,255,255,.3);
  font-size: .65rem;
}

/* ── Partners ── */
.partners-card { padding-bottom: 1rem; }

.partner-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: .75rem;
  padding: 1rem 1.5rem;
}

.partner-chip {
  display: flex;
  align-items: center;
  gap: .75rem;
  padding: .75rem 1rem;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.06);
  border-radius: 12px;
  transition: background .18s, border-color .18s, transform .18s;
}

.partner-chip:hover {
  background: rgba(255,255,255,.07);
  border-color: rgba(255,159,0,.2);
  transform: translateY(-2px);
}

.partner-chip-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255,255,255,.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,.4);
  flex-shrink: 0;
}

.partner-chip-avatar img { width: 100%; height: 100%; object-fit: cover; }

.partner-chip-info {
  flex: 1;
  min-width: 0;
}

.partner-chip-name {
  display: block;
  color: rgba(255,255,255,.85);
  font-size: .8rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.partner-chip-spec {
  display: block;
  color: rgba(255,255,255,.35);
  font-size: .7rem;
}

.partner-chip-country {
  display: flex;
  align-items: center;
  gap: .2rem;
  color: rgba(255,255,255,.3);
  font-size: .65rem;
  flex-shrink: 0;
}

/* ── Responsive ── */
@media (max-width: 1200px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  .mid-row { grid-template-columns: 1fr 1fr; }
  .mini-stats-col { grid-column: span 2; flex-direction: row; }
}

@media (max-width: 900px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  .mid-row { grid-template-columns: 1fr; }
  .mini-stats-col { flex-direction: row; flex-wrap: wrap; }
  .tables-row { grid-template-columns: 1fr; }
}

@media (max-width: 600px) {
  .kpi-grid { grid-template-columns: 1fr; }
  .qa-grid { grid-template-columns: 1fr; }
  .partner-grid { grid-template-columns: 1fr; }
}
</style>
