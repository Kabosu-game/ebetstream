<template>
  <div class="pay_method__paymethod p-3 p-md-4 p-lg-6 p2-bg rounded-8">
    <div class="pay_method__paymethod-title mb-5 mb-md-6 d-flex justify-content-between align-items-center flex-wrap gap-3">
      <div>
        <h2 class="text-white fw-bold mb-2">Recharge Agents Management</h2>
        <p class="text-white-50">Add, edit, and manage recharge agents</p>
      </div>
      <div class="d-flex gap-2">
        <button 
          class="btn btn-primary" 
          @click="showAddModal = true"
          style="background-color: #FF9F00; border: none; color: #000;"
        >
          <i class="fas fa-plus me-2"></i>
          Add New Agent
        </button>
      </div>
    </div>

    <!-- Statistics -->
    <div class="row g-3 mb-4">
      <div class="col-md-4">
        <div class="stat-card n11-bg rounded-8 p-3">
          <div class="text-white-50 small mb-1">Total Agents</div>
          <div class="text-white fw-bold fs-4">{{ stats.total || 0 }}</div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="stat-card n11-bg rounded-8 p-3">
          <div class="text-white-50 small mb-1">Active</div>
          <div class="text-success fw-bold fs-4">{{ stats.active || 0 }}</div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="stat-card n11-bg rounded-8 p-3">
          <div class="text-white-50 small mb-1">Inactive</div>
          <div class="text-danger fw-bold fs-4">{{ stats.inactive || 0 }}</div>
        </div>
      </div>
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
              <th class="text-white p-3">Agent Code</th>
              <th class="text-white p-3">Name</th>
              <th class="text-white p-3">Phone (WhatsApp)</th>
              <th class="text-white p-3">Status</th>
              <th class="text-white p-3">Description</th>
              <th class="text-white p-3">Created</th>
              <th class="text-white p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="agent in agents" :key="agent.id" class="border-top border-secondary">
              <td class="text-white p-3">{{ agent.id }}</td>
              <td class="text-white p-3">
                <div class="d-flex align-items-center gap-2">
                  <code class="bg-success text-white px-2 py-1 rounded fw-bold">
                    {{ agent.agent_id || 'N/A' }}
                  </code>
                  <button 
                    v-if="agent.agent_id"
                    class="btn btn-sm btn-outline-light"
                    @click="copyAgentCode(agent.agent_id)"
                    title="Copy Agent Code"
                    style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                  >
                    <IconCopy :size="12" />
                  </button>
                </div>
              </td>
              <td class="text-white p-3">{{ agent.name }}</td>
              <td class="text-white p-3">{{ agent.phone }}</td>
              <td class="p-3">
                <span :class="['badge', getStatusClass(agent.status)]">
                  {{ getStatusLabel(agent.status) }}
                </span>
              </td>
              <td class="text-white p-3">
                <span v-if="agent.description" class="text-truncate d-inline-block" style="max-width: 200px;">
                  {{ agent.description }}
                </span>
                <span v-else class="text-white-50">No description</span>
              </td>
              <td class="text-white p-3">{{ formatDate(agent.created_at) }}</td>
              <td class="p-3">
                <div class="d-flex gap-2 justify-content-center">
                  <button 
                    class="btn btn-sm btn-info text-white" 
                    @click="editAgent(agent)" 
                    title="Edit Agent"
                    style="min-width: 35px; height: 35px; padding: 0; display: flex; align-items: center; justify-content: center;"
                  >
                    <IconEdit :size="16" />
                  </button>
                  <button 
                    class="btn btn-sm btn-danger text-white" 
                    @click="deleteAgent(agent)" 
                    title="Delete Agent"
                    style="min-width: 35px; height: 35px; padding: 0; display: flex; align-items: center; justify-content: center;"
                  >
                    <IconTrash :size="16" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="agents.length === 0">
              <td colspan="7" class="text-white p-5 text-center">No recharge agents found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click.self="closeModals">
      <div class="modal-content n11-bg rounded-8 p-4" style="max-width: 600px; max-height: 90vh; overflow-y: auto;">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="text-white mb-0">
            {{ showEditModal ? 'Edit Agent' : 'Add New Agent' }}
          </h3>
          <button class="btn-close btn-close-white" @click="closeModals"></button>
        </div>

        <form @submit.prevent="submitAgent">
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label text-white">Agent Name *</label>
              <input
                v-model="agentForm.name"
                type="text"
                class="form-control n11-bg text-white border-secondary"
                placeholder="Enter agent name"
                required
              />
            </div>
            <div class="col-12">
              <label class="form-label text-white">Phone/WhatsApp Number *</label>
              <input
                v-model="agentForm.phone"
                type="text"
                class="form-control n11-bg text-white border-secondary"
                placeholder="Ex: +237 6XX XXX XXX"
                required
              />
            </div>
            <div class="col-12">
              <label class="form-label text-white">Status *</label>
              <select
                v-model="agentForm.status"
                class="form-control n11-bg text-white border-secondary"
                required
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div class="col-12">
              <label class="form-label text-white">Description</label>
              <textarea
                v-model="agentForm.description"
                class="form-control n11-bg text-white border-secondary"
                rows="3"
                placeholder="Agent description (optional)"
              ></textarea>
            </div>
            <div class="col-12">
              <button
                type="submit"
                class="btn btn-primary w-100"
                :disabled="processing"
                style="background-color: #FF9F00; border: none; color: #000;"
              >
                <span v-if="processing" class="spinner-border spinner-border-sm me-2"></span>
                {{ processing ? 'Processing...' : (showEditModal ? 'Update Agent' : 'Add Agent') }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal && selectedAgent" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="popup-box p-5 rounded-4 shadow-lg n11-bg" style="max-width: 500px;">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="fw-bold mb-0 text-white">Delete Agent</h3>
          <button class="btn-close btn-close-white" @click="showDeleteModal = false"></button>
        </div>
        <p class="text-white-50 mb-4">
          Are you sure you want to delete agent <strong>{{ selectedAgent.name }}</strong>? This action cannot be undone.
        </p>
        <div class="d-flex gap-3">
          <button 
            class="btn btn-danger flex-fill" 
            @click="confirmDelete"
            :disabled="processing"
          >
            <span v-if="processing" class="spinner-border spinner-border-sm me-2"></span>
            <span v-else>Delete</span>
          </button>
          <button type="button" class="btn_secondary" @click="showDeleteModal = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiClient from '@/utils/axios';
import { IconEdit, IconTrash, IconCopy } from '@tabler/icons-vue';

interface RechargeAgent {
  id: number;
  name: string;
  phone: string;
  status: 'active' | 'inactive';
  description?: string;
  agent_id?: string;
  created_at: string;
  updated_at: string;
}

const agents = ref<RechargeAgent[]>([]);
const loading = ref(false);
const processing = ref(false);
const stats = ref({
  total: 0,
  active: 0,
  inactive: 0,
});

// Modals
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedAgent = ref<RechargeAgent | null>(null);

// Form
const agentForm = ref({
  name: '',
  phone: '',
  status: 'active',
  description: '',
});

const loadAgents = async () => {
  try {
    loading.value = true;
    const response = await apiClient.get('/admin/recharge-agents');
    
    if (response.data.success) {
      agents.value = response.data.data;
      calculateStats();
    }
  } catch (err: any) {
    console.error('Error loading agents:', err);
    alert('Error loading agents: ' + (err.response?.data?.message || err.message));
  } finally {
    loading.value = false;
  }
};

const calculateStats = () => {
  stats.value = {
    total: agents.value.length,
    active: agents.value.filter(agent => agent.status === 'active').length,
    inactive: agents.value.filter(agent => agent.status === 'inactive').length,
  };
};

const editAgent = (agent: RechargeAgent) => {
  selectedAgent.value = agent;
  agentForm.value = {
    name: agent.name,
    phone: agent.phone,
    status: agent.status,
    description: agent.description || '',
  };
  showEditModal.value = true;
};

const deleteAgent = (agent: RechargeAgent) => {
  selectedAgent.value = agent;
  showDeleteModal.value = true;
};

const submitAgent = async () => {
  try {
    processing.value = true;

    if (showEditModal.value && selectedAgent.value) {
      // Update existing agent
      const response = await apiClient.put(`/admin/recharge-agents/${selectedAgent.value.id}`, agentForm.value);
      if (response.data.success) {
        await loadAgents();
        closeModals();
        alert('Agent updated successfully!');
      }
    } else {
      // Create new agent
      const response = await apiClient.post('/admin/recharge-agents', agentForm.value);
      if (response.data.success) {
        await loadAgents();
        closeModals();
        alert('Agent created successfully!');
      }
    }
  } catch (err: any) {
    console.error('Error saving agent:', err);
    alert('Error saving agent: ' + (err.response?.data?.message || err.message));
  } finally {
    processing.value = false;
  }
};

const confirmDelete = async () => {
  if (!selectedAgent.value) return;
  
  try {
    processing.value = true;
    const response = await apiClient.delete(`/admin/recharge-agents/${selectedAgent.value.id}`);
    
    if (response.data.success) {
      await loadAgents();
      showDeleteModal.value = false;
      selectedAgent.value = null;
      alert('Agent deleted successfully!');
    }
  } catch (err: any) {
    console.error('Error deleting agent:', err);
    alert('Error deleting agent: ' + (err.response?.data?.message || err.message));
  } finally {
    processing.value = false;
  }
};

const closeModals = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  showDeleteModal.value = false;
  selectedAgent.value = null;
  resetForm();
};

const resetForm = () => {
  agentForm.value = {
    name: '',
    phone: '',
    status: 'active',
    description: '',
  };
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: 'Active',
    inactive: 'Inactive',
  };
  return labels[status] || status;
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    active: 'bg-success',
    inactive: 'bg-danger',
  };
  return classes[status] || 'bg-secondary';
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const copyAgentCode = async (agentCode: string) => {
  try {
    await navigator.clipboard.writeText(agentCode);
    // Optionnel: afficher une notification de succès
    alert('Agent code copied to clipboard: ' + agentCode);
  } catch (err) {
    console.error('Failed to copy agent code:', err);
    // Fallback pour les navigateurs qui ne supportent pas clipboard API
    const textArea = document.createElement('textarea');
    textArea.value = agentCode;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('Agent code copied to clipboard: ' + agentCode);
  }
};

onMounted(() => {
  loadAgents();
});
</script>

<style scoped>
.stat-card {
  transition: transform 0.2s;
}
.stat-card:hover {
  transform: translateY(-2px);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: #1a1f3a;
  border-radius: 16px;
  padding: 2rem;
  max-height: 90vh;
  overflow-y: auto;
}

.popup-box {
  background: #1a1f3a;
  border-radius: 16px;
  padding: 2rem;
  max-height: 90vh;
  overflow-y: auto;
}

.btn_secondary {
  background: transparent;
  border: 2px solid #FF9F00;
  color: #FF9F00;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  transition: 0.3s;
  cursor: pointer;
}

.btn_secondary:hover {
  background-color: #FF9F00;
  color: #000;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
