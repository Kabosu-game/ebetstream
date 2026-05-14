<template>
  <div class="pay_method__paymethod p-3 p-md-4 p-lg-6 p2-bg rounded-8">
    <div class="pay_method__paymethod-title mb-5 mb-md-6 d-flex justify-content-between align-items-center flex-wrap gap-3">
      <div>
        <h2 class="text-white fw-bold mb-2">{{ $t('ui.gestion_des_agents_de_recharge') }}</h2>
        <p class="text-white-50">{{ $t('ui.solde_suspension_modification_et_suppression_des_agents_cryp') }}</p>
      </div>
      <button class="btn btn-primary admin-accent-btn" @click="openAdd">
        <i class="fas fa-plus me-2"></i>{{ $t('ui.nouvel_agent') }}</button>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-md-3"><div class="stat-card n11-bg rounded-8 p-3"><div class="text-white-50 small">{{ $t('betting.total') }}</div><div class="text-white fw-bold fs-4">{{ stats.total }}</div></div></div>
      <div class="col-md-3"><div class="stat-card n11-bg rounded-8 p-3"><div class="text-white-50 small">{{ $t('ui.actifs') }}</div><div class="text-success fw-bold fs-4">{{ stats.active }}</div></div></div>
      <div class="col-md-3"><div class="stat-card n11-bg rounded-8 p-3"><div class="text-white-50 small">{{ $t('ui.suspendus') }}</div><div class="text-warning fw-bold fs-4">{{ stats.suspended }}</div></div></div>
      <div class="col-md-3"><div class="stat-card n11-bg rounded-8 p-3"><div class="text-white-50 small">{{ $t('ui.inactifs') }}</div><div class="text-danger fw-bold fs-4">{{ stats.inactive }}</div></div></div>
    </div>

    <div v-if="loading" class="text-center py-5"><div class="spinner-border text-primary"></div></div>

    <div v-else class="pay_method__table">
      <div class="pay_method__table-scrollbar overflow-x-auto">
        <table class="w-100 text-center p2-bg">
          <thead>
            <tr>
              <th class="text-white p-3">{{ $t('ui.code') }}</th>
              <th class="text-white p-3">{{ $t('ui.nom') }}</th>
              <th class="text-white p-3">{{ $t('ui.whatsapp') }}</th>
              <th class="text-white p-3">{{ $t('ui.compte_li') }}</th>
              <th class="text-white p-3">{{ $t('ui.solde_usdt') }}</th>
              <th class="text-white p-3">{{ $t('ui.niveau') }}</th>
              <th class="text-white p-3">{{ $t('ui.statut') }}</th>
              <th class="text-white p-3">{{ $t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="agent in agents" :key="agent.id" class="border-top border-secondary">
              <td class="text-white p-3"><code class="bg-success text-white px-2 py-1 rounded">{{ agent.agent_id || '—' }}</code></td>
              <td class="text-white p-3">{{ agent.name }}</td>
              <td class="text-white p-3">{{ agent.phone }}</td>
              <td class="text-white p-3">
                <span v-if="agent.user">{{ agent.user.username }}<br><small class="text-white-50">{{ agent.user.email }}</small></span>
                <span v-else class="text-white-50">{{ $t('ui.non_li') }}</span>
              </td>
              <td class="text-white p-3">
                <strong>{{ formatNum(agent.wallet_balance) }}</strong>
                <br><small class="text-white-50">{{ $t('admin.availableShort') }}: {{ formatNum(agent.wallet_available) }}</small>
              </td>
              <td class="text-white p-3">{{ agent.tier?.name || '—' }}</td>
              <td class="p-3"><span :class="['badge', getStatusClass(agent.status)]">{{ getStatusLabel(agent.status) }}</span></td>
              <td class="p-3">
                <div class="d-flex gap-1 justify-content-center flex-wrap">
                  <button class="btn btn-sm btn-info text-white" :title="$t('common.edit')" @click="editAgent(agent)"><i class="fas fa-edit"></i></button>
                  <button class="btn btn-sm btn-warning text-dark" :title="$t('admin.manageBalance')" @click="openWallet(agent)"><i class="fas fa-wallet"></i></button>
                  <button v-if="agent.status !== 'suspended'" class="btn btn-sm btn-secondary text-white" :title="$t('admin.suspend')" @click="suspendAgent(agent)"><i class="fas fa-pause"></i></button>
                  <button v-else class="btn btn-sm btn-success text-white" :title="$t('admin.reactivate')" @click="activateAgent(agent)"><i class="fas fa-play"></i></button>
                  <button class="btn btn-sm btn-danger text-white" :title="$t('common.delete')" @click="deleteAgent(agent)"><i class="fas fa-trash"></i></button>
                </div>
              </td>
            </tr>
            <tr v-if="agents.length === 0"><td colspan="8" class="text-white p-5">{{ $t('ui.aucun_agent') }}</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit -->
    <div v-if="showFormModal" class="modal-overlay" @click.self="closeModals">
      <div class="modal-content n11-bg rounded-8 p-4" style="max-width: 600px;">
        <h3 class="text-white mb-4">{{ showEditModal ? $t('admin.editAgent') : $t('admin.newAgent') }}</h3>
        <form @submit.prevent="submitAgent">
          <div class="mb-3">
            <label class="form-label text-white">{{ $t('ui.nom_2') }}</label>
            <input v-model="agentForm.name" class="form-control n11-bg text-white border-secondary" required />
          </div>
          <div class="mb-3">
            <label class="form-label text-white">{{ $t('ui.whatsapp_3') }}</label>
            <input v-model="agentForm.phone" class="form-control n11-bg text-white border-secondary" required />
          </div>
          <div class="mb-3">
            <label class="form-label text-white">{{ $t('ui.statut_2') }}</label>
            <select v-model="agentForm.status" class="form-control n11-bg text-white border-secondary" required>
              <option value="active">{{ $t('ui.actif') }}</option>
              <option value="suspended">{{ $t('ui.suspendu') }}</option>
              <option value="inactive">{{ $t('ui.inactif') }}</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label text-white">{{ $t('common.description') }}</label>
            <textarea v-model="agentForm.description" rows="3" class="form-control n11-bg text-white border-secondary"></textarea>
          </div>
          <button type="submit" class="btn btn-primary w-100 admin-accent-btn" :disabled="processing">
            {{ processing ? $t('admin.saving') : $t('common.save') }}
          </button>
        </form>
      </div>
    </div>

    <!-- Wallet -->
    <div v-if="showWalletModal && selectedAgent" class="modal-overlay" @click.self="showWalletModal = false">
      <div class="modal-content n11-bg rounded-8 p-4" style="max-width: 520px;">
        <h3 class="text-white mb-2">{{ $t('admin.balanceTitle', { name: selectedAgent.name }) }}</h3>
        <p class="text-white-50 mb-4">
          {{ $t('admin.currentBalance') }}: <strong class="text-white">{{ formatNum(selectedAgent.wallet_balance) }} USDT</strong>
          · Bloqué : {{ formatNum(selectedAgent.wallet_locked) }}
        </p>
        <form @submit.prevent="submitWallet">
          <div class="mb-3">
            <label class="form-label text-white">{{ $t('ui.action') }}</label>
            <select v-model="walletForm.action" class="form-control n11-bg text-white border-secondary">
              <option value="credit">{{ $t('ui.cr_diter') }}</option>
              <option value="debit">{{ $t('ui.d_biter') }}</option>
              <option value="set">{{ $t('ui.d_finir_le_solde_exact') }}</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label text-white">{{ $t('ui.montant_usdt') }}</label>
            <input v-model.number="walletForm.amount" type="number" min="0" step="0.01" class="form-control n11-bg text-white border-secondary" required />
          </div>
          <div class="mb-3">
            <label class="form-label text-white">{{ $t('ui.solde_bloqu_optionnel') }}</label>
            <input v-model.number="walletForm.locked_balance" type="number" min="0" step="0.01" class="form-control n11-bg text-white border-secondary" />
          </div>
          <button type="submit" class="btn btn-primary w-100 admin-accent-btn" :disabled="processing">{{ $t('ui.appliquer') }}</button>
        </form>
      </div>
    </div>

    <!-- Delete -->
    <div v-if="showDeleteModal && selectedAgent" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="popup-box p-5 rounded-4 n11-bg" style="max-width: 500px;">
        <h3 class="text-white mb-3">{{ $t('ui.supprimer_lagent') }}</h3>
        <p class="text-white-50 mb-3">{{ $t('ui.supprimer') }}<strong>{{ selectedAgent.name }}</strong>{{ $t('ui.cette_action_est_irr_versible') }}</p>
        <label class="d-flex align-items-center gap-2 text-white mb-4">
          <input v-model="revokeUserRole" type="checkbox" />
          Retirer aussi le rôle agent du compte utilisateur lié
        </label>
        <div class="d-flex gap-3">
          <button class="btn btn-danger flex-fill" :disabled="processing" @click="confirmDelete">{{ $t('ui.supprimer') }}</button>
          <button class="btn_secondary" @click="showDeleteModal = false">{{ $t('ui.annuler') }}</button>
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

interface AgentUser { username: string; email: string; role?: string }
interface AgentTier { name: string }

interface RechargeAgent {
  id: number;
  name: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  description?: string;
  agent_id?: string;
  wallet_balance?: number;
  wallet_locked?: number;
  wallet_available?: number;
  user?: AgentUser | null;
  tier?: AgentTier | null;
}

const agents = ref<RechargeAgent[]>([]);
const loading = ref(false);
const processing = ref(false);
const stats = ref({ total: 0, active: 0, inactive: 0, suspended: 0 });

const showFormModal = ref(false);
const showEditModal = ref(false);
const showWalletModal = ref(false);
const showDeleteModal = ref(false);
const selectedAgent = ref<RechargeAgent | null>(null);
const revokeUserRole = ref(true);

const agentForm = ref({ name: '', phone: '', status: 'active' as RechargeAgent['status'], description: '' });
const walletForm = ref({ action: 'credit' as 'set' | 'credit' | 'debit', amount: 0, locked_balance: null as number | null });

const formatNum = (v?: number | null) => (v == null ? '0.00' : Number(v).toFixed(2));

const loadAgents = async () => {
  loading.value = true;
  try {
    const res = await apiClient.get('/admin/recharge-agents');
    if (res.data.success) {
      agents.value = res.data.data;
      stats.value = {
        total: agents.value.length,
        active: agents.value.filter(a => a.status === 'active').length,
        inactive: agents.value.filter(a => a.status === 'inactive').length,
        suspended: agents.value.filter(a => a.status === 'suspended').length,
      };
    }
  } catch (e: any) {
    alert(e.response?.data?.message || t('errors.loadFailed'));
  } finally {
    loading.value = false;
  }
};

const openAdd = () => { resetForm(); showEditModal.value = false; showFormModal.value = true; };

const editAgent = (agent: RechargeAgent) => {
  selectedAgent.value = agent;
  agentForm.value = { name: agent.name, phone: agent.phone, status: agent.status, description: agent.description || '' };
  showEditModal.value = true;
  showFormModal.value = true;
};

const openWallet = (agent: RechargeAgent) => {
  selectedAgent.value = agent;
  walletForm.value = { action: 'credit', amount: 0, locked_balance: agent.wallet_locked ?? null };
  showWalletModal.value = true;
};

const deleteAgent = (agent: RechargeAgent) => {
  selectedAgent.value = agent;
  revokeUserRole.value = true;
  showDeleteModal.value = true;
};

const submitAgent = async () => {
  processing.value = true;
  try {
    if (showEditModal.value && selectedAgent.value) {
      await apiClient.put(`/admin/recharge-agents/${selectedAgent.value.id}`, agentForm.value);
    } else {
      await apiClient.post('/admin/recharge-agents', agentForm.value);
    }
    await loadAgents();
    closeModals();
  } catch (e: any) {
    alert(e.response?.data?.message || t('errors.generic'));
  } finally {
    processing.value = false;
  }
};

const submitWallet = async () => {
  if (!selectedAgent.value) return;
  processing.value = true;
  try {
    const payload: Record<string, unknown> = {
      action: walletForm.value.action,
      amount: walletForm.value.amount,
    };
    if (walletForm.value.locked_balance != null) payload.locked_balance = walletForm.value.locked_balance;
    await apiClient.post(`/admin/recharge-agents/${selectedAgent.value.id}/wallet`, payload);
    await loadAgents();
    showWalletModal.value = false;
  } catch (e: any) {
    alert(e.response?.data?.message || t('errors.balanceError'));
  } finally {
    processing.value = false;
  }
};

const suspendAgent = async (agent: RechargeAgent) => {
  if (!confirm(`Suspendre ${agent.name} ?`)) return;
  await apiClient.post(`/admin/recharge-agents/${agent.id}/suspend`);
  await loadAgents();
};

const activateAgent = async (agent: RechargeAgent) => {
  await apiClient.post(`/admin/recharge-agents/${agent.id}/activate`);
  await loadAgents();
};

const confirmDelete = async () => {
  if (!selectedAgent.value) return;
  processing.value = true;
  try {
    await apiClient.delete(`/admin/recharge-agents/${selectedAgent.value.id}`, {
      params: { revoke_user_role: revokeUserRole.value ? 1 : 0 },
    });
    showDeleteModal.value = false;
    await loadAgents();
  } catch (e: any) {
    alert(e.response?.data?.message || t('errors.deleteError'));
  } finally {
    processing.value = false;
  }
};

const closeModals = () => {
  showFormModal.value = false;
  showEditModal.value = false;
  showWalletModal.value = false;
  showDeleteModal.value = false;
  selectedAgent.value = null;
  resetForm();
};

const resetForm = () => {
  agentForm.value = { name: '', phone: '', status: 'active', description: '' };
};

const getStatusLabel = (s: string) => ({ active: 'Actif', inactive: 'Inactif', suspended: 'Suspendu' }[s] || s);
const getStatusClass = (s: string) => ({ active: 'bg-success', inactive: 'bg-secondary', suspended: 'bg-warning text-dark' }[s] || 'bg-secondary');

onMounted(loadAgents);
</script>

<style scoped>
.admin-accent-btn { background: #FF9F00; border: none; color: #000; font-weight: 600; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.75); display: flex; align-items: center; justify-content: center; z-index: 9999; }
.modal-content, .popup-box { background: #1a1f3a; border-radius: 16px; padding: 2rem; max-height: 90vh; overflow-y: auto; }
.btn_secondary { background: transparent; border: 2px solid #FF9F00; color: #FF9F00; padding: .75rem 1.5rem; border-radius: 10px; }
</style>
