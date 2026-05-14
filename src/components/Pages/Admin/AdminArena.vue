<template>
  <div class="pay_method__paymethod p-3 p-md-4 p-lg-6 p2-bg rounded-8">
    <div class="pay_method__paymethod-title mb-5 mb-md-6 d-flex justify-content-between align-items-center flex-wrap gap-3">
      <div>
        <h2 class="text-white fw-bold mb-2">{{ $t('ui.ebetstream_arena') }}</h2>
        <p class="text-white-50">{{ $t('ui.gestion_des_matchs_r_sultats_et_paris_esbs') }}</p>
      </div>
      <button class="btn btn-primary admin-accent-btn" @click="openCreate">
        <i class="fas fa-plus me-2"></i>{{ $t('ui.nouveau_match') }}</button>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-md-2"><div class="stat-card n11-bg rounded-8 p-3"><div class="text-white-50 small">{{ $t('betting.total') }}</div><div class="text-white fw-bold fs-4">{{ stats.total }}</div></div></div>
      <div class="col-md-2"><div class="stat-card n11-bg rounded-8 p-3"><div class="text-white-50 small">{{ $t('betting.live') }}</div><div class="text-danger fw-bold fs-4">{{ stats.live }}</div></div></div>
      <div class="col-md-2"><div class="stat-card n11-bg rounded-8 p-3"><div class="text-white-50 small">{{ $t('ui.programm_s') }}</div><div class="text-warning fw-bold fs-4">{{ stats.scheduled }}</div></div></div>
      <div class="col-md-2"><div class="stat-card n11-bg rounded-8 p-3"><div class="text-white-50 small">{{ $t('ui.en_attente') }}</div><div class="text-info fw-bold fs-4">{{ stats.waiting }}</div></div></div>
      <div class="col-md-2"><div class="stat-card n11-bg rounded-8 p-3"><div class="text-white-50 small">{{ $t('ui.termin_s') }}</div><div class="text-success fw-bold fs-4">{{ stats.completed }}</div></div></div>
    </div>

    <div class="d-flex gap-3 mb-4 flex-wrap">
      <select v-model="filterStatus" class="form-select n11-bg text-white border-secondary" style="max-width:180px" @change="loadMatches">
        <option value="">{{ $t('ui.tous_statuts') }}</option>
        <option value="live">{{ $t('betting.live') }}</option>
        <option value="scheduled">{{ $t('ui.programm_s') }}</option>
        <option value="waiting">{{ $t('ui.en_attente') }}</option>
        <option value="completed">{{ $t('ui.termin_s') }}</option>
        <option value="cancelled">{{ $t('ui.annul_s') }}</option>
      </select>
      <input v-model="search" type="text" class="form-control n11-bg text-white border-secondary" :placeholder="$t('ui.rechercher_quipe')" style="max-width:260px" @input="debouncedSearch" />
    </div>

    <div v-if="loading" class="text-center py-5"><div class="spinner-border text-primary"></div></div>

    <div v-else class="pay_method__table">
      <div class="pay_method__table-scrollbar overflow-x-auto">
        <table class="w-100 text-center p2-bg">
          <thead>
            <tr>
              <th class="text-white p-3">{{ $t('common.id') }}</th>
              <th class="text-white p-3">{{ $t('ui.match') }}</th>
              <th class="text-white p-3">{{ $t('ui.mode') }}</th>
              <th class="text-white p-3">{{ $t('ui.statut') }}</th>
              <th class="text-white p-3">{{ $t('ui.joueurs') }}</th>
              <th class="text-white p-3">{{ $t('ui.paris') }}</th>
              <th class="text-white p-3">{{ $t('ui.score') }}</th>
              <th class="text-white p-3">{{ $t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in matches" :key="m.id" class="border-top border-secondary">
              <td class="text-white p-3">#{{ m.id }}</td>
              <td class="text-white p-3 text-start">
                <strong>{{ m.team1_name }}</strong>{{ $t('betting.vs') }}<strong>{{ m.team2_name }}</strong>
                <br><small class="text-white-50">{{ formatDate(m.scheduled_at) }}</small>
              </td>
              <td class="text-white p-3">{{ modeLabel(m.mode) }}</td>
              <td class="p-3"><span :class="['badge', statusClass(m.status)]">{{ statusLabel(m.status) }}</span></td>
              <td class="text-white p-3">{{ m.players_count || 0 }}</td>
              <td class="text-white p-3">{{ m.bets_count || 0 }}</td>
              <td class="text-white p-3">
                <span v-if="m.status === 'completed'">{{ m.team1_score }} – {{ m.team2_score }}</span>
                <span v-else class="text-white-50">—</span>
              </td>
              <td class="p-3">
                <div class="d-flex gap-1 justify-content-center flex-wrap">
                  <button v-if="['waiting','scheduled'].includes(m.status)" class="btn btn-sm btn-danger" title="Démarrer LIVE" @click="startMatch(m)"><i class="fas fa-play"></i></button>
                  <button v-if="['live','scheduled','waiting'].includes(m.status)" class="btn btn-sm btn-success" title="Résultat" @click="openResult(m)"><i class="fas fa-flag-checkered"></i></button>
                  <button v-if="!['completed','cancelled'].includes(m.status)" class="btn btn-sm btn-warning text-dark" title="Annuler" @click="cancelMatch(m)"><i class="fas fa-ban"></i></button>
                  <button class="btn btn-sm btn-info text-white" title="Détail" @click="openDetail(m)"><i class="fas fa-eye"></i></button>
                </div>
              </td>
            </tr>
            <tr v-if="matches.length === 0"><td colspan="8" class="text-white p-5">{{ $t('ui.aucun_match') }}</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create -->
    <div v-if="showCreate" class="modal-overlay" @click.self="showCreate = false">
      <div class="modal-content n11-bg rounded-8 p-4" style="max-width:560px">
        <h3 class="text-white mb-4">{{ $t('ui.nouveau_match_arena') }}</h3>
        <div class="mb-3"><label class="text-white">{{ $t('ui.quipe_1') }}</label><input v-model="form.team1_name" class="form-control n11-bg text-white border-secondary" /></div>
        <div class="mb-3"><label class="text-white">{{ $t('ui.quipe_2') }}</label><input v-model="form.team2_name" class="form-control n11-bg text-white border-secondary" /></div>
        <div class="mb-3"><label class="text-white">{{ $t('ui.mode') }}</label>
          <select v-model="form.mode" class="form-control n11-bg text-white border-secondary">
            <option value="quick_match">{{ $t('ui.quick_match') }}</option>
            <option value="ranked">{{ $t('ui.ranked') }}</option>
            <option value="tournament">{{ $t('ui.tournoi') }}</option>
            <option value="private_match">{{ $t('ui.priv') }}</option>
          </select>
        </div>
        <div class="row g-3 mb-3">
          <div class="col-6"><label class="text-white">{{ $t('ui.cote_quipe_1') }}</label><input v-model.number="form.team1_odds" type="number" step="0.01" class="form-control n11-bg text-white border-secondary" /></div>
          <div class="col-6"><label class="text-white">{{ $t('ui.cote_quipe_2') }}</label><input v-model.number="form.team2_odds" type="number" step="0.01" class="form-control n11-bg text-white border-secondary" /></div>
        </div>
        <div class="mb-3"><label class="text-white">{{ $t('ui.date_programm_e') }}</label><input v-model="form.scheduled_at" type="datetime-local" class="form-control n11-bg text-white border-secondary" /></div>
        <button class="btn btn-primary w-100 admin-accent-btn" :disabled="processing" @click="createMatch">{{ $t('ui.cr_er') }}</button>
      </div>
    </div>

    <!-- Result -->
    <div v-if="showResult && selected" class="modal-overlay" @click.self="showResult = false">
      <div class="modal-content n11-bg rounded-8 p-4" style="max-width:480px">
        <h3 class="text-white mb-2">Résultat — {{ selected.team1_name }} vs {{ selected.team2_name }}</h3>
        <p class="text-white-50 mb-4">{{ $t('ui.les_paris_esbs_et_les_stats_joueurs_seront_mis_jour_automati') }}</p>
        <div class="row g-3 mb-3">
          <div class="col-6"><label class="text-white">{{ selected.team1_name }}</label><input v-model.number="resultForm.team1_score" type="number" min="0" class="form-control n11-bg text-white border-secondary" /></div>
          <div class="col-6"><label class="text-white">{{ selected.team2_name }}</label><input v-model.number="resultForm.team2_score" type="number" min="0" class="form-control n11-bg text-white border-secondary" /></div>
        </div>
        <button class="btn btn-success w-100" :disabled="processing" @click="submitResult">{{ $t('ui.valider_le_r_sultat') }}</button>
      </div>
    </div>

    <!-- Detail -->
    <div v-if="showDetail && selected" class="modal-overlay" @click.self="showDetail = false">
      <div class="modal-content n11-bg rounded-8 p-4" style="max-width:640px;max-height:90vh;overflow-y:auto">
        <h3 class="text-white mb-3">Match #{{ selected.id }}</h3>
        <p class="text-white">{{ selected.team1_name }} vs {{ selected.team2_name }}</p>
        <p class="text-white-50">Mode : {{ modeLabel(selected.mode) }} · {{ statusLabel(selected.status) }}</p>
        <h5 class="text-white mt-4 mb-2">{{ $t('ui.joueurs') }}</h5>
        <div v-if="!detailPlayers.length" class="text-white-50">{{ $t('ui.aucun_joueur') }}</div>
        <div v-for="p in detailPlayers" :key="p.id" class="text-white mb-1">
          {{ p.user?.username }} — {{ p.team }} ({{ p.player_class }})
        </div>
        <h5 class="text-white mt-4 mb-2">Paris ({{ detailBets.length }})</h5>
        <div v-for="b in detailBets" :key="b.id" class="text-white-50 small mb-1">
          {{ b.user?.username }} : {{ b.amount }} EBT — {{ b.bet_type }} — {{ b.status }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { ref, onMounted } from 'vue';
import apiClient from '@/utils/axios';

interface ArenaRow {
  id: number;
  team1_name: string;
  team2_name: string;
  mode: string;
  status: string;
  team1_score?: number;
  team2_score?: number;
  scheduled_at?: string;
  players_count?: number;
  bets_count?: number;
  players?: any[];
  bets?: any[];
}

const matches = ref<ArenaRow[]>([]);
const stats = ref({ total: 0, live: 0, scheduled: 0, waiting: 0, completed: 0 });
const loading = ref(false);
const processing = ref(false);
const filterStatus = ref('');
const search = ref('');
const showCreate = ref(false);
const showResult = ref(false);
const showDetail = ref(false);
const selected = ref<ArenaRow | null>(null);
const detailPlayers = ref<any[]>([]);
const detailBets = ref<any[]>([]);
let searchTimer: number | null = null;

const form = ref({
  team1_name: '', team2_name: '', mode: 'ranked',
  team1_odds: 1.9, team2_odds: 1.9, scheduled_at: '',
});
const resultForm = ref({ team1_score: 0, team2_score: 0 });

const loadMatches = async () => {
  loading.value = true;
  try {
    const params: Record<string, string> = {};
    if (filterStatus.value) params.status = filterStatus.value;
    if (search.value) params.search = search.value;
    const res = await apiClient.get('/admin/arena', { params });
    if (res.data.success) {
      matches.value = res.data.data;
      stats.value = res.data.stats || stats.value;
    }
  } catch {
    matches.value = [];
  } finally {
    loading.value = false;
  }
};

const debouncedSearch = () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = window.setTimeout(loadMatches, 400);
};

const openCreate = () => {
  form.value = { team1_name: '', team2_name: '', mode: 'ranked', team1_odds: 1.9, team2_odds: 1.9, scheduled_at: '' };
  showCreate.value = true;
};

const createMatch = async () => {
  processing.value = true;
  try {
    await apiClient.post('/admin/arena', form.value);
    showCreate.value = false;
    await loadMatches();
  } catch (e: any) {
    alert(e.response?.data?.message || t('errors.generic'));
  } finally {
    processing.value = false;
  }
};

const startMatch = async (m: ArenaRow) => {
  if (!confirm(`Démarrer le match #${m.id} en LIVE ?`)) return;
  await apiClient.post(`/admin/arena/${m.id}/start`);
  await loadMatches();
};

const openResult = (m: ArenaRow) => {
  selected.value = m;
  resultForm.value = { team1_score: m.team1_score || 0, team2_score: m.team2_score || 0 };
  showResult.value = true;
};

const submitResult = async () => {
  if (!selected.value) return;
  processing.value = true;
  try {
    await apiClient.post(`/admin/arena/${selected.value.id}/result`, resultForm.value);
    showResult.value = false;
    await loadMatches();
  } catch (e: any) {
    alert(e.response?.data?.message || t('errors.generic'));
  } finally {
    processing.value = false;
  }
};

const cancelMatch = async (m: ArenaRow) => {
  if (!confirm(`Annuler le match #${m.id} ? Les paris seront remboursés.`)) return;
  await apiClient.post(`/admin/arena/${m.id}/cancel`);
  await loadMatches();
};

const openDetail = async (m: ArenaRow) => {
  selected.value = m;
  try {
    const res = await apiClient.get(`/admin/arena/${m.id}`);
    if (res.data.success) {
      detailPlayers.value = res.data.data.players || [];
      detailBets.value = res.data.data.bets || [];
    }
  } catch {
    detailPlayers.value = [];
    detailBets.value = [];
  }
  showDetail.value = true;
};

const modeLabel = (m: string) => ({ quick_match: 'Quick', ranked: 'Ranked', tournament: 'Tournoi', private_match: 'Privé' }[m] || m);
const statusLabel = (s: string) => ({ live: 'LIVE', scheduled: 'Programmé', waiting: 'Attente', completed: 'Terminé', cancelled: 'Annulé' }[s] || s);
const statusClass = (s: string) => ({ live: 'bg-danger', scheduled: 'bg-warning text-dark', waiting: 'bg-info text-dark', completed: 'bg-success', cancelled: 'bg-secondary' }[s] || 'bg-secondary');
const formatDate = (d?: string) => d ? new Date(d).toLocaleString('fr-FR') : '—';

onMounted(loadMatches);
</script>

<style scoped>
.admin-accent-btn { background: #FF9F00; border: none; color: #000; font-weight: 600; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.75); display: flex; align-items: center; justify-content: center; z-index: 9999; }
.modal-content { background: #1a1f3a; border-radius: 16px; padding: 2rem; width: 100%; }
</style>
