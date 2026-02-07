<template>
  <div class="pay_method__paymethod p-3 p-md-4 p-lg-6 p2-bg rounded-8">
    <div class="pay_method__paymethod-title mb-5 mb-md-6 d-flex justify-content-between align-items-center flex-wrap gap-3">
      <div>
        <h2 class="text-white fw-bold mb-2">Agent Requests</h2>
        <p class="text-white-50">Manage recharge agent requests from users</p>
      </div>
      <div class="d-flex gap-2">
        <select v-model="filterStatus" class="form-select n11-bg text-white border-secondary" style="max-width: 200px;">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>

    <!-- Statistics -->
    <div class="row g-3 mb-4">
      <div class="col-md-3 col-sm-6">
        <div class="stat-card n11-bg rounded-8 p-3">
          <div class="text-white-50 small mb-1">Total Requests</div>
          <div class="text-white fw-bold fs-4">{{ stats.total || 0 }}</div>
        </div>
      </div>
      <div class="col-md-3 col-sm-6">
        <div class="stat-card n11-bg rounded-8 p-3">
          <div class="text-white-50 small mb-1">Pending</div>
          <div class="text-warning fw-bold fs-4">{{ stats.pending || 0 }}</div>
        </div>
      </div>
      <div class="col-md-3 col-sm-6">
        <div class="stat-card n11-bg rounded-8 p-3">
          <div class="text-white-50 small mb-1">Approved</div>
          <div class="text-success fw-bold fs-4">{{ stats.approved || 0 }}</div>
        </div>
      </div>
      <div class="col-md-3 col-sm-6">
        <div class="stat-card n11-bg rounded-8 p-3">
          <div class="text-white-50 small mb-1">Rejected</div>
          <div class="text-danger fw-bold fs-4">{{ stats.rejected || 0 }}</div>
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
              <th class="text-white p-3">Name</th>
              <th class="text-white p-3">WhatsApp</th>
              <th class="text-white p-3">City</th>
              <th class="text-white p-3">Profession</th>
              <th class="text-white p-3">Status</th>
              <th class="text-white p-3">Submitted</th>
              <th class="text-white p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in requests" :key="request.id" class="border-top border-secondary">
              <td class="text-white p-3">{{ request.id }}</td>
              <td class="text-white p-3">{{ request.name }}</td>
              <td class="text-white p-3">{{ request.whatsapp }}</td>
              <td class="text-white p-3">{{ request.city || 'N/A' }}</td>
              <td class="text-white p-3">{{ request.occupation || 'N/A' }}</td>
              <td class="p-3">
                <span :class="['badge', getStatusClass(request.status)]">
                  {{ getStatusLabel(request.status) }}
                </span>
              </td>
              <td class="text-white p-3">{{ formatDate(request.created_at) }}</td>
              <td class="p-3">
                <div class="d-flex gap-2 justify-content-center">
                  <button 
                    class="btn btn-sm btn-info text-white" 
                    @click.stop="viewDetails(request.id)" 
                    title="View Details"
                    style="min-width: 35px; height: 35px; padding: 0; display: flex; align-items: center; justify-content: center; cursor: pointer;"
                  >
                    <IconEye :size="16" />
                  </button>
                  <button 
                    v-if="request.status !== 'approved' && request.status !== 'rejected'"
                    class="btn btn-sm btn-success text-white" 
                    @click="openApproveModal(request)" 
                    title="Approve"
                    style="min-width: 35px; height: 35px; padding: 0; display: flex; align-items: center; justify-content: center;"
                  >
                    <IconCheck :size="16" />
                  </button>
                  <button 
                    v-if="request.status !== 'approved' && request.status !== 'rejected'"
                    class="btn btn-sm btn-danger text-white" 
                    @click="openRejectModal(request)" 
                    title="Reject"
                    style="min-width: 35px; height: 35px; padding: 0; display: flex; align-items: center; justify-content: center;"
                  >
                    <IconX :size="16" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="requests.length === 0">
              <td colspan="8" class="text-white p-5 text-center">No agent requests found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="showDetailsModal" class="modal-overlay" @click.self="showDetailsModal = false">
      <div class="modal-content n11-bg rounded-8 p-4" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="text-white mb-0">Agent Request Details</h3>
          <button class="btn-close btn-close-white" @click="showDetailsModal = false"></button>
        </div>

        <div v-if="loadingDetails" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>

        <div v-else-if="requestDetails" class="row g-4">
          <!-- Informations Personnelles -->
          <div class="col-12">
            <div class="n11-bg rounded-8 p-4">
              <h5 class="text-white mb-3">
                <i class="fas fa-user me-2 text-warning"></i>
                Personal Information
              </h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <small class="text-white-50">Full Name:</small>
                  <p class="text-white mb-0">{{ requestDetails.name }}</p>
                </div>
                <div class="col-md-6">
                  <small class="text-white-50">WhatsApp:</small>
                  <p class="text-white mb-0">{{ requestDetails.whatsapp }}</p>
                </div>
                <div class="col-md-6">
                  <small class="text-white-50">Email:</small>
                  <p class="text-white mb-0">{{ requestDetails.email || 'N/A' }}</p>
                </div>
                <div class="col-md-6">
                  <small class="text-white-50">Secondary Phone:</small>
                  <p class="text-white mb-0">{{ requestDetails.phone || 'N/A' }}</p>
                </div>
                <div class="col-md-6">
                  <small class="text-white-50">Date of Birth:</small>
                  <p class="text-white mb-0">{{ requestDetails.birth_date || 'N/A' }}</p>
                </div>
                <div class="col-md-6">
                  <small class="text-white-50">City:</small>
                  <p class="text-white mb-0">{{ requestDetails.city || 'N/A' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Informations Professionnelles -->
          <div class="col-12">
            <div class="n11-bg rounded-8 p-4">
              <h5 class="text-white mb-3">
                <i class="fas fa-briefcase me-2 text-warning"></i>
                Professional Information
              </h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <small class="text-white-50">Profession:</small>
                  <p class="text-white mb-0">{{ requestDetails.occupation || 'N/A' }}</p>
                </div>
                <div class="col-md-6">
                  <small class="text-white-50">Experience Level:</small>
                  <p class="text-white mb-0">
                    <span class="badge bg-info">{{ getExperienceLabel(requestDetails.experience) }}</span>
                  </p>
                </div>
                <div class="col-12">
                  <small class="text-white-50">Skills & Qualifications:</small>
                  <p class="text-white mb-0" style="white-space: pre-wrap;">{{ requestDetails.skills || 'N/A' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Disponibilité -->
          <div class="col-12">
            <div class="n11-bg rounded-8 p-4">
              <h5 class="text-white mb-3">
                <i class="fas fa-clock me-2 text-warning"></i>
                Availability
              </h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <small class="text-white-50">Availability Type:</small>
                  <p class="text-white mb-0">
                    <span class="badge bg-success">{{ getAvailabilityLabel(requestDetails.availability) }}</span>
                  </p>
                </div>
                <div class="col-md-6">
                  <small class="text-white-50">Working Hours:</small>
                  <p class="text-white mb-0">{{ requestDetails.working_hours || 'N/A' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Motivation -->
          <div class="col-12">
            <div class="n11-bg rounded-8 p-4">
              <h5 class="text-white mb-3">
                <i class="fas fa-heart me-2 text-warning"></i>
                Motivation
              </h5>
              <div class="mb-3">
                <small class="text-white-50">Why become an agent:</small>
                <p class="text-white mb-0" style="white-space: pre-wrap;">{{ requestDetails.motivation || 'N/A' }}</p>
              </div>
              <div v-if="requestDetails.message">
                <small class="text-white-50">Additional Message:</small>
                <p class="text-white mb-0" style="white-space: pre-wrap;">{{ requestDetails.message }}</p>
              </div>
            </div>
          </div>

          <!-- Documents -->
          <div class="col-12">
            <div class="n11-bg rounded-8 p-4">
              <h5 class="text-white mb-3">
                <i class="fas fa-file-alt me-2 text-warning"></i>
                Documents
              </h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <small class="text-white-50">Valid ID Card:</small>
                  <p class="text-white mb-0">
                    <span :class="['badge', requestDetails.has_id_card === 'yes' ? 'bg-success' : 'bg-secondary']">
                      {{ requestDetails.has_id_card === 'yes' ? 'Yes' : 'No' }}
                    </span>
                  </p>
                </div>
                <div class="col-md-6">
                  <small class="text-white-50">Business Registration:</small>
                  <p class="text-white mb-0">
                    <span :class="['badge', requestDetails.has_business_license === 'yes' ? 'bg-success' : 'bg-secondary']">
                      {{ requestDetails.has_business_license === 'yes' ? 'Yes' : 'No' }}
                    </span>
                  </p>
                </div>
                <div class="col-12">
                  <small class="text-white-50">Terms Accepted:</small>
                  <p class="text-white mb-0">
                    <span :class="['badge', requestDetails.agree_terms ? 'bg-success' : 'bg-danger']">
                      {{ requestDetails.agree_terms ? 'Yes' : 'No' }}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Request Information -->
          <div class="col-12">
            <div class="n11-bg rounded-8 p-4">
              <h5 class="text-white mb-3">
                <i class="fas fa-info-circle me-2 text-warning"></i>
                Request Information
              </h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <small class="text-white-50">Status:</small>
                  <p class="mb-0">
                    <span :class="['badge', getStatusClass(requestDetails.status)]">
                      {{ getStatusLabel(requestDetails.status) }}
                    </span>
                  </p>
                </div>
                <div class="col-md-6">
                  <small class="text-white-50">Submitted:</small>
                  <p class="text-white mb-0">{{ formatDate(requestDetails.created_at) }}</p>
                </div>
                <div class="col-md-6">
                  <small class="text-white-50">Request ID:</small>
                  <p class="text-white mb-0">#{{ requestDetails.id }}</p>
                </div>
                <div class="col-md-6">
                  <small class="text-white-50">User:</small>
                  <p class="text-white mb-0">{{ requestDetails.user?.username || 'Guest' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Approve Modal -->
    <div v-if="showApproveModal && selectedRequest" class="modal-overlay" @click.self="showApproveModal = false">
      <div class="popup-box p-5 rounded-4 shadow-lg n11-bg" style="max-width: 600px;">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="fw-bold mb-0 text-white">Approve Agent Request</h3>
          <button class="btn-close btn-close-white" @click="showApproveModal = false"></button>
        </div>
        <p class="text-white-50 mb-4">
          Are you sure you want to approve this agent request? The agent will be created and will appear in the recharge agents list.
        </p>
        <div class="d-flex gap-3">
          <button 
            class="btn_primary flex-fill" 
            @click="approveRequest"
            :disabled="processing"
          >
            <span v-if="processing">Processing...</span>
            <span v-else>Approve</span>
          </button>
          <button type="button" class="btn_secondary" @click="showApproveModal = false">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="showRejectModal && selectedRequest" class="modal-overlay" @click.self="showRejectModal = false">
      <div class="popup-box p-5 rounded-4 shadow-lg n11-bg" style="max-width: 600px;">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="fw-bold mb-0 text-white">Reject Agent Request</h3>
          <button class="btn-close btn-close-white" @click="showRejectModal = false"></button>
        </div>
        <p class="text-white-50 mb-4">
          Are you sure you want to reject this agent request?
        </p>
        <div class="d-flex gap-3">
          <button 
            class="btn btn-danger flex-fill" 
            @click="rejectRequest"
            :disabled="processing"
          >
            <span v-if="processing">Processing...</span>
            <span v-else>Reject</span>
          </button>
          <button type="button" class="btn_secondary" @click="showRejectModal = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import apiClient from '@/utils/axios';
import { IconEye, IconCheck, IconX } from '@tabler/icons-vue';

interface AgentRequest {
  id: number;
  name: string;
  whatsapp: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  city?: string;
  occupation?: string;
  experience?: string;
  skills?: string;
  availability?: string;
  working_hours?: string;
  motivation?: string;
  message?: string;
  has_id_card?: string;
  has_business_license?: string;
  agree_terms?: boolean;
  status: 'pending' | 'approved' | 'rejected';
  user_id?: number;
  created_at: string;
  user?: {
    username: string;
  };
}

interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const requests = ref<AgentRequest[]>([]);
const loading = ref(false);
const filterStatus = ref('');
const pagination = ref<PaginationData | null>(null);
const stats = ref({
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
});

const showDetailsModal = ref(false);
const requestDetails = ref<AgentRequest | null>(null);
const loadingDetails = ref(false);

const showApproveModal = ref(false);
const showRejectModal = ref(false);
const selectedRequest = ref<AgentRequest | null>(null);
const processing = ref(false);

const loadRequests = async (page = 1) => {
  try {
    loading.value = true;
    const params: any = { page };
    
    if (filterStatus.value) {
      params.status = filterStatus.value;
    }

    const response = await apiClient.get('/admin/agent-requests', { params });
    if (response.data.success) {
      // Handle paginated response
      requests.value = response.data.data.data || response.data.data || [];
      pagination.value = response.data.data;
      if (response.data.stats) {
        stats.value = response.data.stats;
      } else {
        calculateStats();
      }
    }
  } catch (err: any) {
    console.error('Error loading agent requests:', err);
    const errorMessage = err.isNetworkError 
      ? 'L\'API n\'est pas démarrée. Veuillez démarrer l\'API avec: cd ebetstream_api\\ebetstream_api && php artisan serve --port=8001'
      : (err.response?.data?.message || err.message || 'Erreur inconnue');
    alert('Error loading agent requests: ' + errorMessage);
  } finally {
    loading.value = false;
  }
};

const calculateStats = () => {
  stats.value = {
    total: pagination.value?.total || requests.value.length,
    pending: requests.value.filter((r: AgentRequest) => r.status === 'pending').length,
    approved: requests.value.filter((r: AgentRequest) => r.status === 'approved').length,
    rejected: requests.value.filter((r: AgentRequest) => r.status === 'rejected').length,
  };
};

const viewDetails = async (id: number) => {
  showDetailsModal.value = true;
  loadingDetails.value = true;
  requestDetails.value = null;

  try {
    const response = await apiClient.get(`/admin/agent-requests/${id}`);
    if (response.data && response.data.success) {
      requestDetails.value = response.data.data;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (err: any) {
    console.error('Error loading request details:', err);
    alert('Error loading request details: ' + (err.response?.data?.message || err.message));
    showDetailsModal.value = false;
  } finally {
    loadingDetails.value = false;
  }
};

const openApproveModal = (request: AgentRequest) => {
  selectedRequest.value = request;
  showApproveModal.value = true;
};

const openRejectModal = (request: AgentRequest) => {
  selectedRequest.value = request;
  showRejectModal.value = true;
};

const approveRequest = async () => {
  if (!selectedRequest.value) return;
  
  try {
    processing.value = true;
    const response = await apiClient.post(`/admin/agent-requests/${selectedRequest.value.id}/approve`);
    
    if (response.data.success) {
      showApproveModal.value = false;
      selectedRequest.value = null;
      await loadRequests();
      alert('Agent request approved successfully! The agent has been created.');
    }
  } catch (err: any) {
    alert(err.response?.data?.message || 'Error approving request');
  } finally {
    processing.value = false;
  }
};

const rejectRequest = async () => {
  if (!selectedRequest.value) return;
  
  try {
    processing.value = true;
    const response = await apiClient.post(`/admin/agent-requests/${selectedRequest.value.id}/reject`);
    
    if (response.data.success) {
      showRejectModal.value = false;
      selectedRequest.value = null;
      await loadRequests();
      alert('Agent request rejected successfully!');
    }
  } catch (err: any) {
    alert(err.response?.data?.message || 'Error rejecting request');
  } finally {
    processing.value = false;
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

const getExperienceLabel = (experience?: string) => {
  const labels: Record<string, string> = {
    beginner: 'Beginner (0-2 years)',
    intermediate: 'Intermediate (2-5 years)',
    advanced: 'Advanced (5-10 years)',
    expert: 'Expert (10+ years)',
  };
  return labels[experience || ''] || experience || 'N/A';
};

const getAvailabilityLabel = (availability?: string) => {
  const labels: Record<string, string> = {
    'full-time': 'Full-time',
    'part-time': 'Part-time',
    weekends: 'Weekends only',
    flexible: 'Flexible',
  };
  return labels[availability || ''] || availability || 'N/A';
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

const goToPage = (page: number) => {
  if (page >= 1 && page <= (pagination.value?.last_page || 1)) {
    loadRequests(page);
  }
};

watch([filterStatus], () => {
  loadRequests();
});

onMounted(() => {
  loadRequests();
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

.btn_primary {
  background-color: #FF9F00;
  color: #000;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  transition: 0.3s;
  cursor: pointer;
}

.btn_primary:hover {
  background-color: #FF9F00;
  transform: translateY(-2px);
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
</style>

