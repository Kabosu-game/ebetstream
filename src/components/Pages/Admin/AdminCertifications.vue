<template>
  <div class="pay_method__paymethod p-3 p-md-4 p-lg-6 p2-bg rounded-8">
    <div class="pay_method__paymethod-title mb-5 mb-md-6">
      <h2 class="text-white fw-bold mb-2">Certification Management</h2>
      <p class="text-white-50">Manage all certification requests</p>
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
              <th class="text-white p-3">Date of Birth</th>
              <th class="text-white p-3">ID Type</th>
              <th class="text-white p-3">ID Number</th>
              <th class="text-white p-3">Status</th>
              <th class="text-white p-3">Request Date</th>
              <th class="text-white p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cert in filteredCertifications" :key="cert.id" class="border-top border-secondary">
              <td class="text-white p-3">{{ cert.id }}</td>
              <td class="text-white p-3">
                <div class="d-flex flex-column align-items-start">
                  <span class="fw-bold">{{ cert.user?.username || cert.user?.email || 'N/A' }}</span>
                  <small class="text-white-50">{{ cert.user?.email }}</small>
                </div>
              </td>
              <td class="text-white p-3">{{ formatDate(cert.date_of_birth) }}</td>
              <td class="text-white p-3">
                <span v-if="cert.id_type">{{ getIdTypeLabel(cert.id_type) }}</span>
                <span v-else class="text-white-50">-</span>
              </td>
              <td class="text-white p-3">
                <span v-if="cert.id_number" class="font-monospace">{{ cert.id_number }}</span>
                <span v-else class="text-white-50">-</span>
              </td>
              <td class="p-3">
                <span :class="['badge', getStatusClass(cert.status)]">
                  {{ getStatusLabel(cert.status) }}
                </span>
              </td>
              <td class="text-white p-3">{{ formatDate(cert.created_at) }}</td>
              <td class="p-3">
                <div v-if="cert.status === 'pending'" class="d-flex gap-2 justify-content-center">
                  <button 
                    class="btn btn-sm btn-success d-flex align-items-center justify-content-center" 
                    @click="viewDetails(cert)" 
                    title="View Details"
                  >
                    <IconEye :size="16" />
                  </button>
                  <button 
                    class="btn btn-sm btn-primary d-flex align-items-center justify-content-center" 
                    @click="approveCertification(cert.id)" 
                    title="Approve"
                  >
                    <IconCheck :size="16" />
                  </button>
                  <button 
                    class="btn btn-sm btn-danger d-flex align-items-center justify-content-center" 
                    @click="showRejectModal(cert)" 
                    title="Reject"
                  >
                    <IconX :size="16" />
                  </button>
                </div>
                <div v-else class="d-flex gap-2 justify-content-center">
                  <button 
                    class="btn btn-sm btn-info d-flex align-items-center justify-content-center" 
                    @click="viewDetails(cert)" 
                    title="View Details"
                  >
                    <IconEye :size="16" />
                  </button>
                  <span v-if="cert.reviewed_by" class="text-white-50 small">
                    Reviewed by: {{ cert.reviewer?.username || cert.reviewer?.email || 'Admin' }}
                  </span>
                </div>
              </td>
            </tr>
            <tr v-if="filteredCertifications.length === 0">
              <td colspan="8" class="text-white p-5 text-center">No certification requests</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Détails -->
    <div v-if="showDetailsModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.7);" @click.self="showDetailsModal = false">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content n11-bg border-secondary">
          <div class="modal-header border-secondary">
            <h5 class="modal-title text-white">Request Details</h5>
            <button type="button" class="btn-close btn-close-white" @click="showDetailsModal = false"></button>
          </div>
          <div class="modal-body text-white" v-if="selectedCert">
            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <strong>User:</strong>
                <p>{{ selectedCert.user?.username || selectedCert.user?.email }}</p>
              </div>
              <div class="col-md-6">
                <strong>Email:</strong>
                <p>{{ selectedCert.user?.email }}</p>
              </div>
              <div class="col-md-6">
                <strong>Date of Birth:</strong>
                <p>{{ formatDate(selectedCert.date_of_birth) }}</p>
              </div>
              <div class="col-md-6">
                <strong>ID Type:</strong>
                <p>{{ selectedCert.id_type ? getIdTypeLabel(selectedCert.id_type) : 'Not provided' }}</p>
              </div>
              <div class="col-md-6">
                <strong>ID Number:</strong>
                <p class="font-monospace">{{ selectedCert.id_number || 'Not provided' }}</p>
              </div>
              <div class="col-12" v-if="selectedCert.verification_data">
                <strong>Verified Conditions:</strong>
                <div class="mt-2">
                  <template v-for="(condition, key) in selectedCert.verification_data" :key="key">
                    <div v-if="String(key) !== 'all_met'" class="mb-2">
                      <span :class="condition.met ? 'text-success' : 'text-danger'">
                        <IconCheck v-if="condition.met" :size="16" class="me-1" />
                        <IconX v-else :size="16" class="me-1" />
                        {{ condition.message }}
                      </span>
                    </div>
                  </template>
                </div>
              </div>
              <div class="col-12" v-if="selectedCert.rejection_reason">
                <strong class="text-danger">Rejection Reason:</strong>
                <p class="text-danger">{{ selectedCert.rejection_reason }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Rejet -->
    <div v-if="showRejectModalFlag" class="modal fade show d-block" style="background: rgba(0,0,0,0.7);" @click.self="showRejectModalFlag = false">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content n11-bg border-secondary">
          <div class="modal-header border-secondary">
            <h5 class="modal-title text-white">Reject Certification</h5>
            <button type="button" class="btn-close btn-close-white" @click="showRejectModalFlag = false"></button>
          </div>
          <div class="modal-body text-white">
            <div class="mb-3">
              <label class="form-label">Rejection Reason <span class="text-danger">*</span></label>
              <textarea 
                v-model="rejectionReason" 
                class="form-control n11-bg text-white border-secondary" 
                rows="4"
                placeholder="Explain why this request is being rejected..."
                required
              ></textarea>
            </div>
          </div>
          <div class="modal-footer border-secondary">
            <button type="button" class="btn btn-secondary" @click="showRejectModalFlag = false">Cancel</button>
            <button 
              type="button" 
              class="btn btn-danger" 
              @click="rejectCertification(rejectingCertId)"
              :disabled="!rejectionReason.trim()"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import apiClient from '@/utils/axios';
import { IconCheck, IconX, IconEye } from '@tabler/icons-vue';

interface CertificationRequest {
  id: number;
  user_id: number;
  date_of_birth: string;
  id_type?: string;
  id_number?: string;
  status: string;
  rejection_reason?: string;
  verification_data?: any;
  reviewed_by?: number;
  reviewer?: { username?: string; email?: string };
  user?: { username?: string; email?: string; profile?: any };
  created_at: string;
}

const certifications = ref<CertificationRequest[]>([]);
const loading = ref(false);
const filterStatus = ref('');
const showDetailsModal = ref(false);
const selectedCert = ref<CertificationRequest | null>(null);
const showRejectModalFlag = ref(false);
const rejectionReason = ref('');
const rejectingCertId = ref<number | null>(null);

const filteredCertifications = computed(() => {
  if (!filterStatus.value) return certifications.value;
  return certifications.value.filter(c => c.status === filterStatus.value);
});

const loadCertifications = async () => {
  try {
    loading.value = true;
    const params: any = {};
    if (filterStatus.value) {
      params.status = filterStatus.value;
    }
    const response = await apiClient.get('/admin/certifications', { params });
    if (response.data.success) {
      certifications.value = response.data.data.data || response.data.data || [];
    }
  } catch (err: any) {
    console.error('Error loading certifications:', err);
    certifications.value = [];
  } finally {
    loading.value = false;
  }
};

const viewDetails = async (cert: CertificationRequest) => {
  try {
    const response = await apiClient.get(`/admin/certifications/${cert.id}`);
    if (response.data.success) {
      selectedCert.value = response.data.data;
      showDetailsModal.value = true;
    }
  } catch (err: any) {
    alert('Error loading details');
  }
};

const approveCertification = async (id: number) => {
  if (!confirm('Approve this certification request?')) return;
  try {
    await apiClient.post(`/admin/certifications/${id}/approve`, {});
    alert('Certification approved successfully!');
    await loadCertifications();
  } catch (err: any) {
    alert(err.response?.data?.message || 'Error approving certification');
  }
};

const showRejectModal = (cert: CertificationRequest) => {
  rejectingCertId.value = cert.id;
  rejectionReason.value = '';
  showRejectModalFlag.value = true;
};

const rejectCertification = async (id: number | null) => {
  if (!id || !rejectionReason.value.trim()) return;
  
  try {
    await apiClient.post(`/admin/certifications/${id}/reject`, {
      rejection_reason: rejectionReason.value
    });
    alert('Certification rejected');
    showRejectModalFlag.value = false;
    rejectionReason.value = '';
    rejectingCertId.value = null;
    await loadCertifications();
  } catch (err: any) {
    alert(err.response?.data?.message || 'Error rejecting certification');
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
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US');
};

const getIdTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    passport: 'Passport',
    national_id: 'National ID Card',
    driving_license: 'Driving License',
    residence_permit: 'Residence Permit',
  };
  return labels[type] || type;
};

onMounted(() => {
  loadCertifications();
});
</script>

