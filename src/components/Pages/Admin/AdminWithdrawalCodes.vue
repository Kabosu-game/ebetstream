<template>
  <div class="admin-withdrawal-codes">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="mb-0">Withdrawal Codes Management</h4>
      <button class="btn btn-primary" @click="refreshData">
        <i class="fas fa-sync-alt me-2"></i>Refresh
      </button>
    </div>

    <!-- Statistics Cards -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card bg-primary text-white">
          <div class="card-body">
            <h5 class="card-title">Total Codes</h5>
            <h3>{{ stats.total }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-warning text-white">
          <div class="card-body">
            <h5 class="card-title">Pending</h5>
            <h3>{{ stats.pending }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-success text-white">
          <div class="card-body">
            <h5 class="card-title">Completed</h5>
            <h3>{{ stats.completed }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-danger text-white">
          <div class="card-body">
            <h5 class="card-title">Expired</h5>
            <h3>{{ stats.expired }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row">
          <div class="col-md-3">
            <label class="form-label">Status Filter</label>
            <select v-model="filters.status" class="form-select" @change="loadCodes">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Agent Filter</label>
            <select v-model="filters.agent_id" class="form-select" @change="loadCodes">
              <option value="">All Agents</option>
              <option v-for="agent in agents" :key="agent.id" :value="agent.id">
                {{ agent.name }} (ID: {{ agent.agent_id }})
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Date From</label>
            <input type="date" v-model="filters.date_from" class="form-control" @change="loadCodes">
          </div>
          <div class="col-md-3">
            <label class="form-label">Date To</label>
            <input type="date" v-model="filters.date_to" class="form-control" @change="loadCodes">
          </div>
        </div>
      </div>
    </div>

    <!-- Codes Table -->
    <div class="card">
      <div class="card-body">
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        
        <div v-else class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Code</th>
                <th>User</th>
                <th>Agent</th>
                <th>Amount (USD)</th>
                <th>Status</th>
                <th>Created</th>
                <th>Expires</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="code in codes" :key="code.id">
                <td>
                  <code class="bg-light px-2 py-1 rounded">{{ code.code }}</code>
                </td>
                <td>{{ code.user?.username || 'N/A' }}</td>
                <td>
                  {{ code.recharge_agent?.name }}<br>
                  <small class="text-muted">ID: {{ code.recharge_agent?.agent_id }}</small>
                </td>
                <td>{{ formatNumber(code.amount / 600) }} EBT</td>
                <td>
                  <span :class="['badge', getStatusClass(code.status)]">
                    {{ code.status }}
                  </span>
                </td>
                <td>{{ formatDate(code.created_at) }}</td>
                <td>{{ formatDate(code.expires_at) }}</td>
                <td>
                  <div class="btn-group" role="group">
                    <button 
                      class="btn btn-sm btn-info" 
                      @click="viewDetails(code)"
                      title="View Details"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button 
                      v-if="code.status === 'pending'"
                      class="btn btn-sm btn-success" 
                      @click="completeCode(code)"
                      title="Mark as Completed"
                    >
                      <i class="fas fa-check"></i>
                    </button>
                    <button 
                      v-if="code.status === 'pending'"
                      class="btn btn-sm btn-danger" 
                      @click="cancelCode(code)"
                      title="Cancel Code"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="codes.length === 0">
                <td colspan="8" class="text-center py-4">No withdrawal codes found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="showDetailsModal" class="modal fade show" style="display: block; background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Withdrawal Code Details</h5>
            <button type="button" class="btn-close" @click="showDetailsModal = false"></button>
          </div>
          <div class="modal-body" v-if="selectedCode">
            <div class="row">
              <div class="col-md-6">
                <h6>Code Information</h6>
                <table class="table table-sm">
                  <tr>
                    <td><strong>Code:</strong></td>
                    <td><code>{{ selectedCode.code }}</code></td>
                  </tr>
                  <tr>
                    <td><strong>Amount:</strong></td>
                    <td>{{ formatNumber(selectedCode.amount / 600) }} EBT</td>
                  </tr>
                  <tr>
                    <td><strong>Status:</strong></td>
                    <td>
                      <span :class="['badge', getStatusClass(selectedCode.status)]">
                        {{ selectedCode.status }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Created:</strong></td>
                    <td>{{ formatDate(selectedCode.created_at) }}</td>
                  </tr>
                  <tr>
                    <td><strong>Expires:</strong></td>
                    <td>{{ formatDate(selectedCode.expires_at) }}</td>
                  </tr>
                </table>
              </div>
              <div class="col-md-6">
                <h6>User Information</h6>
                <table class="table table-sm">
                  <tr>
                    <td><strong>Username:</strong></td>
                    <td>{{ selectedCode.user?.username || 'N/A' }}</td>
                  </tr>
                  <tr>
                    <td><strong>Email:</strong></td>
                    <td>{{ selectedCode.user?.email || 'N/A' }}</td>
                  </tr>
                </table>
                
                <h6 class="mt-3">Agent Information</h6>
                <table class="table table-sm">
                  <tr>
                    <td><strong>Name:</strong></td>
                    <td>{{ selectedCode.recharge_agent?.name }}</td>
                  </tr>
                  <tr>
                    <td><strong>ID:</strong></td>
                    <td>{{ selectedCode.recharge_agent?.agent_id }}</td>
                  </tr>
                  <tr>
                    <td><strong>Phone:</strong></td>
                    <td>{{ selectedCode.recharge_agent?.phone }}</td>
                  </tr>
                </table>
              </div>
            </div>
            <div v-if="selectedCode.notes" class="mt-3">
              <h6>Notes</h6>
              <p class="text-muted">{{ selectedCode.notes }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showDetailsModal = false">Close</button>
            <button 
              v-if="selectedCode?.status === 'pending'"
              type="button" 
              class="btn btn-success" 
              @click="completeCode(selectedCode)"
            >
              <i class="fas fa-check me-2"></i>Mark as Completed
            </button>
            <button 
              v-if="selectedCode?.status === 'pending'"
              type="button" 
              class="btn btn-danger" 
              @click="cancelCode(selectedCode)"
            >
              <i class="fas fa-times me-2"></i>Cancel Code
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiClient from '@/utils/axios';

interface WithdrawalCode {
  id: number;
  code: string;
  amount: number;
  status: string;
  created_at: string;
  expires_at: string;
  completed_at?: string;
  notes?: string;
  user?: {
    id: number;
    username: string;
    email?: string;
  };
  recharge_agent?: {
    id: number;
    agent_id: string;
    name: string;
    phone: string;
  };
}

interface Agent {
  id: number;
  agent_id: string;
  name: string;
  phone: string;
}

const codes = ref<WithdrawalCode[]>([]);
const agents = ref<Agent[]>([]);
const loading = ref(false);
const showDetailsModal = ref(false);
const selectedCode = ref<WithdrawalCode | null>(null);

const stats = ref({
  total: 0,
  pending: 0,
  completed: 0,
  expired: 0
});

const filters = ref({
  status: '',
  agent_id: '',
  date_from: '',
  date_to: ''
});

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-warning',
    completed: 'bg-success',
    cancelled: 'bg-danger',
    expired: 'bg-secondary'
  };
  return classes[status] || 'bg-secondary';
};

const loadCodes = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem('auth_token');
    const params = new URLSearchParams();
    
    if (filters.value.status) params.append('status', filters.value.status);
    if (filters.value.agent_id) params.append('agent_id', filters.value.agent_id);
    if (filters.value.date_from) params.append('date_from', filters.value.date_from);
    if (filters.value.date_to) params.append('date_to', filters.value.date_to);
    
    const response = await apiClient.get(`/admin/withdrawal-codes?${params}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      codes.value = response.data.data.codes || [];
      stats.value = response.data.data.stats || stats.value;
    }
  } catch (error: any) {
    console.error('Error loading withdrawal codes:', error);
  } finally {
    loading.value = false;
  }
};

const loadAgents = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await apiClient.get('/admin/recharge-agents', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      agents.value = response.data.data || [];
    }
  } catch (error: any) {
    console.error('Error loading agents:', error);
  }
};

const viewDetails = (code: WithdrawalCode) => {
  selectedCode.value = code;
  showDetailsModal.value = true;
};

const completeCode = async (code: WithdrawalCode | null) => {
  if (!code) return;
  
  try {
    const token = localStorage.getItem('auth_token');
    const response = await apiClient.post(`/admin/withdrawal-codes/${code.id}/complete`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      alert('Code marked as completed successfully!');
      loadCodes();
      showDetailsModal.value = false;
    }
  } catch (error: any) {
    console.error('Error completing code:', error);
    alert('Error completing code: ' + (error.response?.data?.message || error.message));
  }
};

const cancelCode = async (code: WithdrawalCode | null) => {
  if (!code) return;
  
  if (!confirm('Are you sure you want to cancel this withdrawal code?')) return;
  
  try {
    const token = localStorage.getItem('auth_token');
    const response = await apiClient.post(`/admin/withdrawal-codes/${code.id}/cancel`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      alert('Code cancelled successfully!');
      loadCodes();
      showDetailsModal.value = false;
    }
  } catch (error: any) {
    console.error('Error cancelling code:', error);
    alert('Error cancelling code: ' + (error.response?.data?.message || error.message));
  }
};

const refreshData = () => {
  loadCodes();
  loadAgents();
};

onMounted(() => {
  loadCodes();
  loadAgents();
});
</script>

<style scoped>
.admin-withdrawal-codes {
  padding: 20px;
}

.table th {
  border-top: none;
  font-weight: 600;
  background-color: #f8f9fa;
}

.modal {
  z-index: 1050;
}

.modal.show {
  display: block !important;
}

.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.btn-group .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

code {
  font-family: 'Courier New', monospace;
  font-weight: bold;
}
</style>
