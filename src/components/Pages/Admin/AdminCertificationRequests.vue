<template>
  <div class="pay_method__paymethod p-3 p-md-4 p-lg-6 p2-bg rounded-8">
    <div class="pay_method__paymethod-title mb-5 mb-md-6 d-flex justify-content-between align-items-center flex-wrap gap-3">
      <div>
        <h2 class="text-white fw-bold mb-2">Certification Requests</h2>
        <p class="text-white-50">Manage certification requests from users</p>
      </div>
      <div class="d-flex gap-2">
        <select v-model="filterType" class="form-select n11-bg text-white border-secondary" style="max-width: 200px;">
          <option value="">All Types</option>
          <option value="organizer">Organizer</option>
          <option value="referee">Referee</option>
          <option value="ambassador">Ambassador</option>
        </select>
        <select v-model="filterStatus" class="form-select n11-bg text-white border-secondary" style="max-width: 200px;">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="test_pending">Test Pending</option>
          <option value="interview_pending">Interview Pending</option>
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
              <th class="text-white p-3">User</th>
              <th class="text-white p-3">Type</th>
              <th class="text-white p-3">Status</th>
              <th class="text-white p-3">Full Name</th>
              <th class="text-white p-3">Email</th>
              <th class="text-white p-3">Submitted</th>
              <th class="text-white p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in requests" :key="request.id" class="border-top border-secondary">
              <td class="text-white p-3">{{ request.id }}</td>
              <td class="text-white p-3">{{ request.user?.username || 'N/A' }}</td>
              <td class="p-3">
                <span :class="['badge', getTypeClass(request.type)]">
                  {{ getTypeLabel(request.type) }}
                </span>
              </td>
              <td class="p-3">
                <span :class="['badge', getStatusClass(request.status)]">
                  {{ getStatusLabel(request.status) }}
                </span>
              </td>
              <td class="text-white p-3">{{ request.full_name }}</td>
              <td class="text-white p-3">{{ request.professional_email }}</td>
              <td class="text-white p-3">{{ formatDate(request.submitted_at || request.created_at) }}</td>
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
              <td colspan="8" class="text-white p-5 text-center">No certification requests found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="showDetailsModal" class="modal-overlay" @click.self="showDetailsModal = false">
      <div class="modal-content n11-bg rounded-8 p-4" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="text-white mb-0">Certification Request Details</h3>
          <button class="btn-close btn-close-white" @click="showDetailsModal = false"></button>
        </div>

        <div v-if="loadingDetails" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>

        <div v-else-if="requestDetails">
          <!-- Tabs -->
          <ul class="nav nav-tabs mb-3">
            <li class="nav-item">
              <button 
                class="nav-link" 
                :class="{ 'active': activeTab === 'overview' }"
                @click="activeTab = 'overview'"
              >
                Overview
              </button>
            </li>
            <li class="nav-item">
              <button 
                class="nav-link" 
                :class="{ 'active': activeTab === 'documents' }"
                @click="activeTab = 'documents'"
              >
                Documents
              </button>
            </li>
          </ul>

          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="row g-4">
            <div class="col-md-6">
              <div class="n11-bg rounded-8 p-4">
                <h5 class="text-white mb-3">Personal Information</h5>
                <div class="mb-2">
                  <small class="text-white-50">Full Name:</small>
                  <p class="text-white mb-0">{{ requestDetails.full_name }}</p>
                </div>
                <div class="mb-2">
                  <small class="text-white-50">Username:</small>
                  <p class="text-white mb-0">{{ requestDetails.username }}</p>
                </div>
                <div class="mb-2">
                  <small class="text-white-50">Email:</small>
                  <p class="text-white mb-0">{{ requestDetails.professional_email }}</p>
                </div>
                <div class="mb-2">
                  <small class="text-white-50">Phone:</small>
                  <p class="text-white mb-0">{{ requestDetails.phone }}</p>
                </div>
                <div v-if="requestDetails.birth_date" class="mb-2">
                  <small class="text-white-50">Birth Date:</small>
                  <p class="text-white mb-0">{{ formatDate(requestDetails.birth_date) }}</p>
                </div>
                <div v-if="requestDetails.country" class="mb-2">
                  <small class="text-white-50">Country:</small>
                  <p class="text-white mb-0">{{ requestDetails.country }}</p>
                </div>
                <div v-if="requestDetails.city" class="mb-2">
                  <small class="text-white-50">City:</small>
                  <p class="text-white mb-0">{{ requestDetails.city }}</p>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="n11-bg rounded-8 p-4">
                <h5 class="text-white mb-3">Professional Information</h5>
                <div class="mb-2">
                  <small class="text-white-50">Type:</small>
                  <p class="mb-0">
                    <span :class="['badge', getTypeClass(requestDetails.type)]">
                      {{ getTypeLabel(requestDetails.type) }}
                    </span>
                  </p>
                </div>
                <div class="mb-2">
                  <small class="text-white-50">Status:</small>
                  <p class="mb-0">
                    <span :class="['badge', getStatusClass(requestDetails.status)]">
                      {{ getStatusLabel(requestDetails.status) }}
                    </span>
                  </p>
                </div>
                <div v-if="requestDetails.experience" class="mb-2">
                  <small class="text-white-50">Experience:</small>
                  <p class="text-white mb-0" style="white-space: pre-wrap;">{{ requestDetails.experience }}</p>
                </div>
                <div v-if="requestDetails.availability" class="mb-2">
                  <small class="text-white-50">Availability:</small>
                  <p class="text-white mb-0" style="white-space: pre-wrap;">{{ requestDetails.availability }}</p>
                </div>
                <div v-if="requestDetails.technical_skills" class="mb-2">
                  <small class="text-white-50">Technical Skills:</small>
                  <p class="text-white mb-0" style="white-space: pre-wrap;">{{ requestDetails.technical_skills }}</p>
                </div>
              </div>
            </div>

            <!-- Type-specific information -->
            <div class="col-12" v-if="requestDetails.type === 'organizer'">
              <div class="n11-bg rounded-8 p-4">
                <h5 class="text-white mb-3">Organizer Specific Information</h5>
                <div v-if="requestDetails.event_proof" class="mb-3">
                  <small class="text-white-50">Event Proof:</small>
                  <p class="text-white mb-0" style="white-space: pre-wrap;">{{ requestDetails.event_proof }}</p>
                </div>
                <div v-if="requestDetails.professional_contacts" class="mb-3">
                  <small class="text-white-50">Professional Contacts:</small>
                  <p class="text-white mb-0" style="white-space: pre-wrap;">{{ requestDetails.professional_contacts }}</p>
                </div>
              </div>
            </div>

            <div class="col-12" v-if="requestDetails.type === 'referee'">
              <div class="n11-bg rounded-8 p-4">
                <h5 class="text-white mb-3">Referee Specific Information</h5>
                <div v-if="requestDetails.mini_cv" class="mb-3">
                  <small class="text-white-50">Mini CV:</small>
                  <p class="text-white mb-0" style="white-space: pre-wrap;">{{ requestDetails.mini_cv }}</p>
                </div>
                <div v-if="requestDetails.presentation_video" class="mb-3">
                  <small class="text-white-50">Presentation Video:</small>
                  <p class="text-white mb-0">
                    <a :href="requestDetails.presentation_video" target="_blank" class="text-warning">
                      {{ requestDetails.presentation_video }}
                    </a>
                  </p>
                </div>
                <div v-if="requestDetails.community_proof" class="mb-3">
                  <small class="text-white-50">Community Proof:</small>
                  <p class="text-white mb-0" style="white-space: pre-wrap;">{{ requestDetails.community_proof }}</p>
                </div>
              </div>
            </div>

            <div class="col-12" v-if="requestDetails.type === 'ambassador'">
              <div class="n11-bg rounded-8 p-4">
                <h5 class="text-white mb-3">Ambassador Specific Information</h5>
                <div v-if="requestDetails.social_media_links" class="mb-3">
                  <small class="text-white-50">Social Media Links:</small>
                  <p class="text-white mb-0" style="white-space: pre-wrap;">{{ requestDetails.social_media_links }}</p>
                </div>
                <div v-if="requestDetails.audience_stats" class="mb-3">
                  <small class="text-white-50">Audience Stats:</small>
                  <p class="text-white mb-0" style="white-space: pre-wrap;">{{ requestDetails.audience_stats }}</p>
                </div>
                <div v-if="requestDetails.previous_media" class="mb-3">
                  <small class="text-white-50">Previous Media:</small>
                  <p class="text-white mb-0" style="white-space: pre-wrap;">{{ requestDetails.previous_media }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Documents Tab -->
          <div v-if="activeTab === 'documents'" class="n11-bg rounded-8 p-4">
            <h5 class="text-white mb-3">Identity Documents</h5>
            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <div class="mb-3">
                  <small class="text-white-50 d-block mb-2">ID Card Front</small>
                  <a 
                    v-if="requestDetails.id_card_front" 
                    :href="getDocumentUrl(requestDetails.id_card_front)" 
                    target="_blank"
                    class="btn btn-sm btn-outline-light"
                  >
                    <i class="fas fa-eye me-2"></i>View
                  </a>
                  <span v-else class="text-white-50">Not provided</span>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <small class="text-white-50 d-block mb-2">ID Card Back</small>
                  <a 
                    v-if="requestDetails.id_card_back" 
                    :href="getDocumentUrl(requestDetails.id_card_back)" 
                    target="_blank"
                    class="btn btn-sm btn-outline-light"
                  >
                    <i class="fas fa-eye me-2"></i>View
                  </a>
                  <span v-else class="text-white-50">Not provided</span>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <small class="text-white-50 d-block mb-2">Selfie</small>
                  <a 
                    v-if="requestDetails.selfie" 
                    :href="getDocumentUrl(requestDetails.selfie)" 
                    target="_blank"
                    class="btn btn-sm btn-outline-light"
                  >
                    <i class="fas fa-eye me-2"></i>View
                  </a>
                  <span v-else class="text-white-50">Not provided</span>
                </div>
              </div>
              <div class="col-md-6" v-if="requestDetails.type === 'organizer' && requestDetails.tournament_structure">
                <div class="mb-3">
                  <small class="text-white-50 d-block mb-2">Tournament Structure</small>
                  <a 
                    :href="getDocumentUrl(requestDetails.tournament_structure)" 
                    target="_blank"
                    class="btn btn-sm btn-outline-light"
                  >
                    <i class="fas fa-eye me-2"></i>View
                  </a>
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
          <h3 class="fw-bold mb-0 text-white">Approve Certification Request</h3>
          <button class="btn-close btn-close-white" @click="showApproveModal = false"></button>
        </div>
        <p class="text-white-50 mb-4">
          Are you sure you want to approve this certification request? The user will receive access to certification features.
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
          <h3 class="fw-bold mb-0 text-white">Reject Certification Request</h3>
          <button class="btn-close btn-close-white" @click="showRejectModal = false"></button>
        </div>
        <div class="mb-4">
          <label class="form-label text-white">Rejection Reason *</label>
          <textarea 
            v-model="rejectionReason" 
            class="form-control n11-bg text-white border-secondary" 
            rows="4"
            placeholder="Enter the reason for rejection..."
            required
          ></textarea>
        </div>
        <div class="d-flex gap-3">
          <button 
            class="btn btn-danger flex-fill" 
            @click="rejectRequest"
            :disabled="processing || !rejectionReason.trim()"
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

interface CertificationRequest {
  id: number;
  user_id: number;
  type: 'organizer' | 'referee' | 'ambassador';
  status: string;
  full_name: string;
  professional_email: string;
  phone: string;
  username: string;
  birth_date?: string;
  country?: string;
  city?: string;
  experience?: string;
  availability?: string;
  technical_skills?: string;
  id_card_front?: string;
  id_card_back?: string;
  selfie?: string;
  event_proof?: string;
  tournament_structure?: string;
  professional_contacts?: string;
  mini_cv?: string;
  presentation_video?: string;
  community_proof?: string;
  social_media_links?: string;
  audience_stats?: string;
  previous_media?: string;
  submitted_at?: string;
  created_at: string;
  user?: {
    username: string;
  };
}

const requests = ref<CertificationRequest[]>([]);
const loading = ref(false);
const filterType = ref('');
const filterStatus = ref('');
const stats = ref({
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
});

const showDetailsModal = ref(false);
const requestDetails = ref<CertificationRequest | null>(null);
const loadingDetails = ref(false);
const activeTab = ref('overview');

const showApproveModal = ref(false);
const showRejectModal = ref(false);
const selectedRequest = ref<CertificationRequest | null>(null);
const processing = ref(false);
const rejectionReason = ref('');

const loadRequests = async () => {
  try {
    loading.value = true;
    const params: any = {};
    
    if (filterType.value) {
      params.type = filterType.value;
    }
    
    if (filterStatus.value) {
      params.status = filterStatus.value;
    }

    const response = await apiClient.get('/admin/certification-requests', { params });
    if (response.data.success) {
      // Handle paginated response
      const responseData = response.data.data;
      if (responseData && responseData.data) {
        // Paginated response
        requests.value = responseData.data;
      } else if (Array.isArray(responseData)) {
        // Direct array response
        requests.value = responseData;
      } else {
        requests.value = [];
      }
      calculateStats();
    }
  } catch (err: any) {
    console.error('Error loading certification requests:', err);
    alert('Error loading certification requests: ' + (err.response?.data?.message || err.message));
  } finally {
    loading.value = false;
  }
};

const calculateStats = () => {
  if (!Array.isArray(requests.value)) {
    stats.value = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    };
    return;
  }
  
  stats.value = {
    total: requests.value.length,
    pending: requests.value.filter((r: CertificationRequest) => r.status === 'pending').length,
    approved: requests.value.filter((r: CertificationRequest) => r.status === 'approved').length,
    rejected: requests.value.filter((r: CertificationRequest) => r.status === 'rejected').length,
  };
};

const viewDetails = async (id: number) => {
  console.log('View details called for ID:', id);
  showDetailsModal.value = true;
  loadingDetails.value = true;
  activeTab.value = 'overview';
  requestDetails.value = null;

  try {
    const response = await apiClient.get(`/admin/certification-requests/${id}`);
    console.log('Response:', response.data);
    if (response.data && response.data.success) {
      requestDetails.value = response.data.data;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (err: any) {
    console.error('Error loading request details:', err);
    console.error('Error response:', err.response);
    alert('Error loading request details: ' + (err.response?.data?.message || err.message));
    showDetailsModal.value = false;
  } finally {
    loadingDetails.value = false;
  }
};

const openApproveModal = (request: CertificationRequest) => {
  selectedRequest.value = request;
  showApproveModal.value = true;
};

const openRejectModal = (request: CertificationRequest) => {
  selectedRequest.value = request;
  rejectionReason.value = '';
  showRejectModal.value = true;
};

const approveRequest = async () => {
  if (!selectedRequest.value) return;
  
  try {
    processing.value = true;
    const response = await apiClient.post(`/admin/certification-requests/${selectedRequest.value.id}/approve`);
    
    if (response.data.success) {
      showApproveModal.value = false;
      selectedRequest.value = null;
      await loadRequests();
      alert('Certification request approved successfully!');
    }
  } catch (err: any) {
    alert(err.response?.data?.message || 'Error approving request');
  } finally {
    processing.value = false;
  }
};

const rejectRequest = async () => {
  if (!selectedRequest.value || !rejectionReason.value.trim()) return;
  
  try {
    processing.value = true;
    const response = await apiClient.post(`/admin/certification-requests/${selectedRequest.value.id}/reject`, {
      reason: rejectionReason.value,
    });
    
    if (response.data.success) {
      showRejectModal.value = false;
      selectedRequest.value = null;
      rejectionReason.value = '';
      await loadRequests();
      alert('Certification request rejected successfully!');
    }
  } catch (err: any) {
    alert(err.response?.data?.message || 'Error rejecting request');
  } finally {
    processing.value = false;
  }
};

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    organizer: 'Organizer',
    referee: 'Referee',
    ambassador: 'Ambassador',
  };
  return labels[type] || type;
};

const getTypeClass = (type: string) => {
  const classes: Record<string, string> = {
    organizer: 'bg-primary',
    referee: 'bg-info',
    ambassador: 'bg-warning',
  };
  return classes[type] || 'bg-secondary';
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Pending',
    under_review: 'Under Review',
    test_pending: 'Test Pending',
    interview_pending: 'Interview Pending',
    approved: 'Approved',
    rejected: 'Rejected',
  };
  return labels[status] || status;
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-warning',
    under_review: 'bg-info',
    test_pending: 'bg-primary',
    interview_pending: 'bg-primary',
    approved: 'bg-success',
    rejected: 'bg-danger',
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

const getDocumentUrl = (path: string) => {
  if (!path) return '';
  // Remove 'public/' prefix if present
  const cleanPath = path.startsWith('public/') ? path.replace('public/', '') : path;
  // Extract folder and filename from path (e.g., "certifications/id_cards/file.jpg")
  const parts = cleanPath.split('/');
  if (parts.length >= 3) {
    const folder = parts[1]; // e.g., "id_cards"
    const filename = parts.slice(2).join('/'); // e.g., "file.jpg"
    return `${import.meta.env.VITE_API_BASE_URL || '/api'}/storage/certifications/${folder}/${filename}`;
  }
  // Fallback for other paths
  return `${import.meta.env.VITE_API_BASE_URL || '/api'}/storage/${cleanPath}`;
};

watch([filterType, filterStatus], () => {
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

.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.popup-box {
  background: #1a1f3a;
  border-radius: 16px;
  padding: 2rem;
  max-height: 90vh;
  overflow-y: auto;
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

.nav-tabs {
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.nav-tabs .nav-link {
  color: rgba(255, 255, 255, 0.7);
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  padding: 0.75rem 1.5rem;
}

.nav-tabs .nav-link:hover {
  color: white;
  border-bottom-color: rgba(255, 159, 0, 0.5);
}

.nav-tabs .nav-link.active {
  color: #FF9F00;
  border-bottom-color: #FF9F00;
  background: transparent;
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

