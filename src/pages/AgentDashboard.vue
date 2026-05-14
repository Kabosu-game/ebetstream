<template>
  <div class="tw-page">

    <div v-if="loading" class="tw-empty"><div class="spinner"></div></div>

    <div v-else-if="!dashboard" class="tw-empty">
      <div class="tw-empty__icon"><i class="fas fa-user-shield"></i></div>
      <p class="tw-empty__title">{{ $t('ui.acc_s_agent_requis') }}</p>
      <p class="tw-empty__sub">{{ $t('ui.votre_compte_nest_pas_encore_certifi_comme_agent_ebetstream') }}</p>
      <router-link to="/become-agent" class="tw-btn tw-btn--primary mt-3">{{ $t('ui.devenir_agent') }}</router-link>
    </div>

    <template v-else>
      <div class="tw-page-hero mb-4">
        <p class="tw-page-hero__eyebrow"><i class="fas fa-user-shield"></i>{{ $t('ui.agent_crypto_ebetstream') }}</p>
        <h1 class="tw-page-hero__title">{{ $t('ui.tableau_de_bord_agent') }}</h1>
        <p class="tw-page-hero__sub">
          {{ dashboard.agent.name }} — ID {{ dashboard.agent.agent_id }}
          <span v-if="dashboard.agent.tier" class="tw-badge tw-badge--ongoing ms-2">{{ dashboard.agent.tier.name }}</span>
        </p>
      </div>

      <!-- Solde -->
      <div class="tw-grid-4 mb-4">
        <div class="tw-stat-card">
          <span class="tw-stat-card__value">{{ formatNum(dashboard.wallet?.balance) }}</span>
          <span class="tw-stat-card__label">{{ $t('ui.solde_usdt') }}</span>
        </div>
        <div class="tw-stat-card">
          <span class="tw-stat-card__value">{{ formatNum(available) }}</span>
          <span class="tw-stat-card__label">{{ $t('ui.disponible') }}</span>
        </div>
        <div class="tw-stat-card">
          <span class="tw-stat-card__value">{{ dashboard.pending_withdrawals?.length || 0 }}</span>
          <span class="tw-stat-card__label">{{ $t('ui.retraits_en_attente') }}</span>
        </div>
        <div class="tw-stat-card">
          <span class="tw-stat-card__value">{{ dashboard.agent.rating_avg || '—' }}</span>
          <span class="tw-stat-card__label">Note ({{ dashboard.agent.rating_count || 0 }})</span>
        </div>
      </div>

      <div class="tw-tabs mb-4">
        <button class="tw-tab" :class="{ active: tab === 'recharge' }" @click="tab = 'recharge'">{{ $t('ui.recharge_crypto') }}</button>
        <button class="tw-tab" :class="{ active: tab === 'deposit' }" @click="tab = 'deposit'">{{ $t('ui.d_p_t_joueur') }}</button>
        <button class="tw-tab" :class="{ active: tab === 'withdrawals' }" @click="tab = 'withdrawals'">{{ $t('ui.retraits') }}</button>
        <button class="tw-tab" :class="{ active: tab === 'history' }" @click="tab = 'history'; loadTransfers()">{{ $t('ui.historique') }}</button>
      </div>

      <!-- Recharge crypto -->
      <div v-if="tab === 'recharge'" class="tw-content-block">
        <h4 class="mb-3">Recharger via {{ limits.recommended_network || 'USDT TRC20' }}</h4>
        <p class="tw-muted mb-4">Envoyez de la crypto vers le wallet officiel EBETSTREAM, puis soumettez la preuve. Minimum : {{ limits.minimum_agent_reload || 100 }} USDT.</p>
        <div class="tw-form-group">
          <label class="tw-label">{{ $t('ui.montant_usdt') }}</label>
          <input v-model.number="cryptoForm.amount" type="number" min="1" class="tw-input" />
        </div>
        <div class="tw-form-group">
          <label class="tw-label">{{ $t('ui.hash_de_transaction_tx') }}</label>
          <input v-model="cryptoForm.tx_hash" class="tw-input" :placeholder="$t('ui.0x')" />
        </div>
        <button class="tw-btn tw-btn--primary" @click="submitCryptoDeposit" :disabled="submitting">
          <i class="fas fa-coins"></i>{{ $t('ui.soumettre_la_recharge') }}</button>
        <p v-if="msg" class="mt-3 mb-0" :class="msgOk ? 'tw-accent' : 'text-danger'">{{ msg }}</p>
      </div>

      <!-- Dépôt joueur -->
      <div v-if="tab === 'deposit'" class="tw-content-block">
        <h4 class="mb-3">{{ $t('ui.d_p_t_interne_vers_un_joueur') }}</h4>
        <p class="tw-muted mb-4">Le montant est débité de votre solde agent et crédité sur le compte joueur en EBT. Vous ne pouvez pas transférer plus que votre solde disponible.</p>
        <div class="tw-form-group">
          <label class="tw-label">{{ $t('ui.identifiant_joueur_username_ou_email') }}</label>
          <input v-model="depositForm.player_identifier" class="tw-input" />
        </div>
        <div class="tw-form-group">
          <label class="tw-label">{{ $t('ui.montant_ebt') }}</label>
          <input v-model.number="depositForm.amount" type="number" min="0.01" step="0.01" class="tw-input" />
        </div>
        <button class="tw-btn tw-btn--primary" @click="depositToPlayer" :disabled="submitting">
          <i class="fas fa-paper-plane"></i>{{ $t('ui.cr_diter_le_joueur') }}</button>
        <p v-if="msg" class="mt-3 mb-0" :class="msgOk ? 'tw-accent' : 'text-danger'">{{ msg }}</p>
      </div>

      <!-- Retraits en attente -->
      <div v-if="tab === 'withdrawals'">
        <div v-if="!dashboard.pending_withdrawals?.length" class="tw-empty">
          <p class="tw-empty__title">{{ $t('ui.aucun_retrait_en_attente') }}</p>
        </div>
        <div v-else class="agent-withdrawal-list">
          <div v-for="w in dashboard.pending_withdrawals" :key="w.id" class="tw-content-block mb-3">
            <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
              <div>
                <strong>{{ w.user?.username }}</strong>
                <p class="tw-muted mb-0">{{ $t('ui.code_3') }}<code>{{ w.code }}</code></p>
                <p class="mb-0">{{ formatNum(w.amount) }} EBT — expire {{ formatDate(w.expires_at) }}</p>
              </div>
              <button class="tw-btn tw-btn--primary" @click="completeWithdrawal(w.code)" :disabled="submitting">
                <i class="fas fa-check"></i>{{ $t('ui.valider_retrait') }}</button>
            </div>
          </div>
        </div>
        <p v-if="msg" class="mt-2" :class="msgOk ? 'tw-accent' : 'text-danger'">{{ msg }}</p>
      </div>

      <!-- Historique -->
      <div v-if="tab === 'history'">
        <div v-if="loadingTransfers" class="tw-empty"><div class="spinner"></div></div>
        <div v-else-if="!transfers.length" class="tw-empty"><p>{{ $t('ui.aucune_transaction') }}</p></div>
        <div v-else class="tw-content-block p-0 overflow-hidden">
          <table class="agent-lb-table">
            <thead>
              <tr><th>{{ $t('ui.r_f') }}</th><th>{{ $t('ui.joueur') }}</th><th>{{ $t('common.type') }}</th><th>{{ $t('ui.montant') }}</th><th>{{ $t('ui.commission_2') }}</th><th>{{ $t('common.date') }}</th></tr>
            </thead>
            <tbody>
              <tr v-for="t in transfers" :key="t.id">
                <td><code>{{ t.reference }}</code></td>
                <td>{{ t.user?.username }}</td>
                <td>{{ t.type === 'deposit_to_player' ? 'Dépôt' : 'Retrait' }}</td>
                <td class="tw-accent">{{ formatNum(t.amount) }}</td>
                <td>{{ formatNum(t.commission) }}</td>
                <td class="tw-muted">{{ formatDate(t.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { ref, computed, onMounted, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/utils/axios';

const router = useRouter();

const loading = ref(true);
const dashboard = ref<any>(null);
const tab = ref('recharge');
const submitting = ref(false);
const msg = ref('');
const msgOk = ref(false);
const transfers = ref<any[]>([]);
const loadingTransfers = ref(false);

const cryptoForm = ref({ amount: null as number | null, tx_hash: '' });
const depositForm = ref({ player_identifier: '', amount: null as number | null });

const limits = computed(() => dashboard.value?.limits || {});
const available = computed(() => {
  const w = dashboard.value?.wallet;
  if (!w) return 0;
  return Math.max(0, parseFloat(w.balance) - parseFloat(w.locked_balance || 0));
});

const loadDashboard = async () => {
  loading.value = true;
  try {
    const res = await apiClient.get('/agent-crypto/dashboard');
    if (res.data.success) dashboard.value = res.data.data;
  } catch {
    dashboard.value = null;
  } finally {
    loading.value = false;
  }
};

const loadTransfers = async () => {
  loadingTransfers.value = true;
  try {
    const res = await apiClient.get('/agent-crypto/transfers');
    if (res.data.success) transfers.value = res.data.data?.data || res.data.data || [];
  } finally {
    loadingTransfers.value = false;
  }
};

const submitCryptoDeposit = async () => {
  submitting.value = true; msg.value = '';
  try {
    const res = await apiClient.post('/agent-crypto/crypto-deposit', cryptoForm.value);
    msg.value = res.data.message; msgOk.value = true;
    cryptoForm.value = { amount: null, tx_hash: '' };
  } catch (e: any) {
    msg.value = e.response?.data?.message || 'Erreur'; msgOk.value = false;
  } finally { submitting.value = false; }
};

const depositToPlayer = async () => {
  submitting.value = true; msg.value = '';
  try {
    const res = await apiClient.post('/agent-crypto/deposit-to-player', depositForm.value);
    msg.value = res.data.message; msgOk.value = true;
    depositForm.value = { player_identifier: '', amount: null };
    await loadDashboard();
  } catch (e: any) {
    msg.value = e.response?.data?.message || 'Erreur'; msgOk.value = false;
  } finally { submitting.value = false; }
};

const completeWithdrawal = async (code: string) => {
  submitting.value = true; msg.value = '';
  try {
    const res = await apiClient.post(`/agent-crypto/withdrawals/${code}/complete`);
    msg.value = res.data.message; msgOk.value = true;
    await loadDashboard();
  } catch (e: any) {
    msg.value = e.response?.data?.message || 'Erreur'; msgOk.value = false;
  } finally { submitting.value = false; }
};

const formatNum = (n: any) => n != null ? parseFloat(n).toFixed(2) : '0.00';
const formatDate = (d: string) => d ? new Date(d).toLocaleString('fr-FR') : '—';

onBeforeMount(() => {
  if (!localStorage.getItem('auth_token')) {
    router.push('/login');
  }
});

onMounted(loadDashboard);
</script>

<style scoped>
.tw-accent { color: rgb(var(--g1)); }
.agent-lb-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
.agent-lb-table th, .agent-lb-table td { padding: 10px 14px; border-bottom: 1px solid rgb(var(--n2)); color: rgb(var(--n5)); }
.agent-lb-table th { color: rgb(var(--n8)); font-weight: 700; font-size: 0.75rem; text-transform: uppercase; }
</style>
