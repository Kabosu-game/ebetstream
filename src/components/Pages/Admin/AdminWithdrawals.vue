<template>
  <div class="pay_method__paymethod p-3 p-md-4 p-lg-6 p2-bg rounded-8">
    <div class="pay_method__paymethod-title mb-5 mb-md-6">
      <h2 class="text-white fw-bold mb-2">{{ $t('ui.withdrawal_management') }}</h2>
      <p class="text-white-50">{{ $t('ui.manage_all_platform_withdrawals') }}</p>
    </div>

    <div class="d-flex gap-3 mb-4 flex-wrap">
      <select v-model="filterStatus" class="form-select n11-bg text-white border-secondary" style="max-width: 200px;">
        <option value="">{{ $t('ui.all_statuses') }}</option>
        <option value="pending">{{ $t('common.pending') }}</option>
        <option value="approved">{{ $t('common.approved') }}</option>
        <option value="rejected">{{ $t('common.rejected') }}</option>
      </select>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">{{ $t('common.loading') }}</span>
      </div>
    </div>

    <div v-else class="pay_method__table">
      <div class="pay_method__table-scrollbar overflow-x-auto">
        <table class="w-100 text-center p2-bg">
          <thead>
            <tr>
              <th class="text-white p-3">{{ $t('common.id') }}</th>
              <th class="text-white p-3">{{ $t('common.user') }}</th>
              <th class="text-white p-3">{{ $t('ui.amount') }}</th>
              <th class="text-white p-3">{{ $t('ui.method') }}</th>
              <th class="text-white p-3">{{ $t('common.status') }}</th>
              <th class="text-white p-3">{{ $t('common.date') }}</th>
              <th class="text-white p-3">{{ $t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="withdrawal in filteredWithdrawals" :key="withdrawal.id" class="border-top border-secondary">
              <td class="text-white p-3">{{ withdrawal.id }}</td>
              <td class="text-white p-3">{{ withdrawal.user?.email || 'N/A' }}</td>
              <td class="text-white p-3">${{ withdrawal.amount }}</td>
              <td class="text-white p-3">{{ withdrawal.withdrawal_method }}</td>
              <td class="p-3">
                <span :class="['badge', getStatusClass(withdrawal.status)]">
                  {{ getStatusLabel(withdrawal.status) }}
                </span>
              </td>
              <td class="text-white p-3">{{ formatDate(withdrawal.created_at) }}</td>
              <td class="p-3">
                <div v-if="withdrawal.status === 'pending'" class="d-flex gap-2 justify-content-center">
                  <button class="btn btn-sm btn-success d-flex align-items-center justify-content-center" @click="approveWithdrawal(withdrawal.id)" title="Approve">
                    <i class="fas fa-check"></i>
                  </button>
                  <button class="btn btn-sm btn-danger d-flex align-items-center justify-content-center" @click="rejectWithdrawal(withdrawal.id)" title="Reject">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <span v-else class="text-white-50">-</span>
              </td>
            </tr>
            <tr v-if="filteredWithdrawals.length === 0">
              <td colspan="7" class="text-white p-5 text-center">{{ $t('ui.no_withdrawals') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { ref, computed, onMounted } from 'vue';
import apiClient from '@/utils/axios';

interface Withdrawal {
  id: number;
  amount: number;
  withdrawal_method: string;
  status: string;
  user?: { email: string };
  created_at: string;
}

const withdrawals = ref<Withdrawal[]>([]);
const loading = ref(false);
const filterStatus = ref('');

const filteredWithdrawals = computed(() => {
  if (!filterStatus.value) return withdrawals.value;
  return withdrawals.value.filter(w => w.status === filterStatus.value);
});

const loadWithdrawals = async () => {
  try {
    loading.value = true;
    const response = await apiClient.get('/admin/withdrawals');
    if (response.data.success) {
      withdrawals.value = response.data.data.data || response.data.data || [];
    }
  } catch (err: any) {
    console.error('Error loading withdrawals:', err);
    withdrawals.value = [];
  } finally {
    loading.value = false;
  }
};

const approveWithdrawal = async (id: number) => {
  if (!confirm('Approve this withdrawal?')) return;
  try {
    await apiClient.post(`/admin/withdrawals/${id}/approve`, {});
    await loadWithdrawals();
  } catch (err: any) {
    alert(err.response?.data?.message || 'Error approving withdrawal');
  }
};

const rejectWithdrawal = async (id: number) => {
  if (!confirm('Reject this withdrawal?')) return;
  try {
    await apiClient.post(`/admin/withdrawals/${id}/reject`, {});
    await loadWithdrawals();
  } catch (err: any) {
    alert(err.response?.data?.message || 'Error rejecting withdrawal');
  }
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
  };
  return labels[status] || status;
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-warning',
    approved: 'bg-success',
    rejected: 'bg-danger',
  };
  return classes[status] || 'bg-secondary';
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US');
};

onMounted(() => {
  loadWithdrawals();
});
</script>

