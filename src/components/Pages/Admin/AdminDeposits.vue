<template>
  <div class="pay_method__paymethod p-3 p-md-4 p-lg-6 p2-bg rounded-8">
    <div class="pay_method__paymethod-title mb-5 mb-md-6">
      <h2 class="text-white fw-bold mb-2">Deposit Management</h2>
      <p class="text-white-50">Manage all platform deposits</p>
    </div>

    <div class="d-flex gap-3 mb-4 flex-wrap">
      <select v-model="filterStatus" class="form-select n11-bg text-white border-secondary" style="max-width: 200px;">
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else class="pay_method__table">
      <div class="pay_method__table-scrollbar overflow-x-auto">
        <table class="w-100 text-center p2-bg">
          <thead>
            <tr>
              <th class="text-white p-3">ID</th>
              <th class="text-white p-3">User</th>
              <th class="text-white p-3">Amount</th>
              <th class="text-white p-3">Method</th>
              <th class="text-white p-3">Status</th>
              <th class="text-white p-3">Date</th>
              <th class="text-white p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="deposit in filteredDeposits" :key="deposit.id" class="border-top border-secondary">
              <td class="text-white p-3">{{ deposit.id }}</td>
              <td class="text-white p-3">{{ deposit.user?.email || 'N/A' }}</td>
              <td class="text-white p-3">${{ deposit.amount }}</td>
              <td class="text-white p-3">{{ deposit.deposit_method }}</td>
              <td class="p-3">
                <span :class="['badge', getStatusClass(deposit.status)]">
                  {{ getStatusLabel(deposit.status) }}
                </span>
              </td>
              <td class="text-white p-3">{{ formatDate(deposit.created_at) }}</td>
              <td class="p-3">
                <div v-if="deposit.status === 'pending'" class="d-flex gap-2 justify-content-center">
                  <button class="btn btn-sm btn-success d-flex align-items-center justify-content-center" @click="approveDeposit(deposit.id)" title="Approve">
                    <IconCheck :size="16" />
                  </button>
                  <button class="btn btn-sm btn-danger d-flex align-items-center justify-content-center" @click="rejectDeposit(deposit.id)" title="Reject">
                    <IconX :size="16" />
                  </button>
                </div>
                <span v-else class="text-white-50">-</span>
              </td>
            </tr>
            <tr v-if="filteredDeposits.length === 0">
              <td colspan="7" class="text-white p-5 text-center">No deposits</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import apiClient from '@/utils/axios';
import { IconCheck, IconX } from '@tabler/icons-vue';

interface Deposit {
  id: number;
  amount: number;
  deposit_method: string;
  status: string;
  user?: { email: string };
  created_at: string;
}

const deposits = ref<Deposit[]>([]);
const loading = ref(false);
const filterStatus = ref('');

const filteredDeposits = computed(() => {
  if (!filterStatus.value) return deposits.value;
  return deposits.value.filter(d => d.status === filterStatus.value);
});

const loadDeposits = async () => {
  try {
    loading.value = true;
    const response = await apiClient.get('/admin/deposits');
    if (response.data.success) {
      deposits.value = response.data.data.data || response.data.data || [];
    }
  } catch (err: any) {
    console.error('Error loading deposits:', err);
    deposits.value = [];
  } finally {
    loading.value = false;
  }
};

const approveDeposit = async (id: number) => {
  if (!confirm('Approve this deposit?')) return;
  try {
    await apiClient.post(`/admin/deposits/${id}/approve`, {});
    await loadDeposits();
  } catch (err: any) {
    alert(err.response?.data?.message || 'Error approving deposit');
  }
};

const rejectDeposit = async (id: number) => {
  if (!confirm('Reject this deposit?')) return;
  try {
    await apiClient.post(`/admin/deposits/${id}/reject`, {});
    await loadDeposits();
  } catch (err: any) {
    alert(err.response?.data?.message || 'Error rejecting deposit');
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
  loadDeposits();
});
</script>

