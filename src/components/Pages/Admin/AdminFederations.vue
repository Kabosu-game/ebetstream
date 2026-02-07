<template>
  <div class="pay_method__paymethod p-3 p-md-4 p-lg-6 p2-bg rounded-8">
    <div class="pay_method__paymethod-title mb-5 mb-md-6 d-flex justify-content-between align-items-center flex-wrap gap-3">
      <div>
        <h2 class="text-white fw-bold mb-2">Federation Management</h2>
        <p class="text-white-50">Manage all platform federations</p>
      </div>
    </div>

    <!-- Statistics -->
    <div class="row g-3 mb-4">
      <div class="col-md-3 col-sm-6">
        <div class="stat-card n11-bg rounded-8 p-3">
          <div class="text-white-50 small mb-1">Total Federations</div>
          <div class="text-white fw-bold fs-4">{{ stats.total || 0 }}</div>
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
          <div class="text-white-50 small mb-1">Pending</div>
          <div class="text-warning fw-bold fs-4">{{ stats.pending || 0 }}</div>
        </div>
      </div>
      <div class="col-md-3 col-sm-6">
        <div class="stat-card n11-bg rounded-8 p-3">
          <div class="text-white-50 small mb-1">Rejected</div>
          <div class="text-danger fw-bold fs-4">{{ stats.rejected || 0 }}</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="d-flex gap-3 mb-4 flex-wrap">
      <input 
        v-model="searchQuery" 
        type="text" 
        class="form-control n11-bg text-white border-secondary" 
        placeholder="Search by name, email, country..."
        style="max-width: 300px;"
        @input="loadFederations"
      />
      <select v-model="filterStatus" class="form-select n11-bg text-white border-secondary" style="max-width: 200px;" @change="loadFederations">
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="suspended">Suspended</option>
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
              <th class="text-white p-3">Name</th>
              <th class="text-white p-3">Responsible</th>
              <th class="text-white p-3">Location</th>
              <th class="text-white p-3">Tournaments</th>
              <th class="text-white p-3">Status</th>
              <th class="text-white p-3">Created</th>
              <th class="text-white p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="federation in federations" :key="federation.id" class="border-top border-secondary">
              <td class="text-white p-3">{{ federation.id }}</td>
              <td class="text-white p-3">
                <div class="text-start">
                  <strong>{{ federation.name }}</strong>
                  <p v-if="federation.description" class="text-white-50 small mb-0" style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    {{ federation.description }}
                  </p>
                </div>
              </td>
              <td class="text-white p-3">{{ federation.user?.username || 'N/A' }}</td>
              <td class="text-white p-3">
                <span v-if="federation.country">
                  {{ federation.country }}<span v-if="federation.city">, {{ federation.city }}</span>
                </span>
                <span v-else class="text-white-50">N/A</span>
              </td>
              <td class="text-white p-3">
                <span class="badge bg-info">{{ federation.tournaments?.length || 0 }}</span>
              </td>
              <td class="p-3">
                <span :class="['badge', getStatusClass(federation.status)]">
                  {{ getStatusLabel(federation.status) }}
                </span>
              </td>
              <td class="text-white p-3">{{ formatDate(federation.created_at) }}</td>
              <td class="p-3">
                <div class="d-flex gap-2 justify-content-center">
                  <button 
                    class="btn btn-sm btn-info text-white" 
                    @click="viewDetails(federation.id)"
                    title="View Details"
                    style="min-width: 35px; height: 35px; padding: 0; display: flex; align-items: center; justify-content: center;"
                  >
                    <IconEye :size="16" />
                  </button>
                  <button 
                    v-if="federation.status === 'pending'"
                    class="btn btn-sm btn-success text-white" 
                    @click="approveFederation(federation.id)"
                    title="Approve"
                    :disabled="processing"
                    style="min-width: 35px; height: 35px; padding: 0; display: flex; align-items: center; justify-content: center;"
                  >
                    <IconCheck :size="16" />
                  </button>
                  <button 
                    v-if="federation.status === 'pending' || federation.status === 'approved'"
                    class="btn btn-sm btn-danger text-white" 
                    @click="openRejectModal(federation)"
                    title="Reject"
                    :disabled="processing"
                    style="min-width: 35px; height: 35px; padding: 0; display: flex; align-items: center; justify-content: center;"
                  >
                    <IconX :size="16" />
                  </button>
                  <button 
                    v-if="federation.status === 'approved'"
                    class="btn btn-sm btn-warning text-white" 
                    @click="openSuspendModal(federation)"
                    title="Suspend"
                    :disabled="processing"
                    style="min-width: 35px; height: 35px; padding: 0; display: flex; align-items: center; justify-content: center;"
                  >
                    <IconAlertTriangle :size="16" />
                  </button>
                  <button 
                    class="btn btn-sm btn-primary" 
                    @click="editFederation(federation)"
                    title="Edit"
                    :disabled="processing"
                    style="min-width: 35px; height: 35px; padding: 0; display: flex; align-items: center; justify-content: center;"
                  >
                    <IconPencil :size="16" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="federations.length === 0">
              <td colspan="8" class="text-white p-5 text-center">No federations found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="showDetailsModal" class="modal-overlay" @click.self="showDetailsModal = false">
      <div class="modal-content n11-bg rounded-8 p-4" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="text-white mb-0">Federation Details</h3>
          <button class="btn-close btn-close-white" @click="showDetailsModal = false"></button>
        </div>

        <div v-if="loadingDetails" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>

        <div v-else-if="selectedFederation" class="row g-4">
          <div class="col-12">
            <div class="text-center mb-4">
              <img 
                v-if="selectedFederation.logo_url" 
                :src="selectedFederation.logo_url" 
                alt="Logo"
                class="rounded-circle"
                style="width: 100px; height: 100px; object-fit: cover;"
              />
              <div 
                v-else
                class="rounded-circle d-inline-flex align-items-center justify-content-center"
                style="width: 100px; height: 100px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"
              >
                <i class="fas fa-building fa-3x text-white"></i>
              </div>
            </div>
            <h4 class="text-white text-center mb-3">{{ selectedFederation.name }}</h4>
          </div>
          <div class="col-md-6">
            <small class="text-white-50">Description:</small>
            <p class="text-white mb-0" style="white-space: pre-wrap;">{{ selectedFederation.description || 'N/A' }}</p>
          </div>
          <div class="col-md-6">
            <small class="text-white-50">Status:</small>
            <p class="mb-0">
              <span :class="['badge', getStatusClass(selectedFederation.status)]">
                {{ getStatusLabel(selectedFederation.status) }}
              </span>
            </p>
          </div>
          <div class="col-md-6">
            <small class="text-white-50">Responsible:</small>
            <p class="text-white mb-0">{{ selectedFederation.user?.username || 'N/A' }}</p>
          </div>
          <div class="col-md-6">
            <small class="text-white-50">Email:</small>
            <p class="text-white mb-0">{{ selectedFederation.email || 'N/A' }}</p>
          </div>
          <div class="col-md-6">
            <small class="text-white-50">Phone:</small>
            <p class="text-white mb-0">{{ selectedFederation.phone || 'N/A' }}</p>
          </div>
          <div class="col-md-6">
            <small class="text-white-50">Website:</small>
            <p class="text-white mb-0">
              <a v-if="selectedFederation.website" :href="selectedFederation.website" target="_blank" class="text-primary">
                {{ selectedFederation.website }}
              </a>
              <span v-else>N/A</span>
            </p>
          </div>
          <div class="col-md-6">
            <small class="text-white-50">Country:</small>
            <p class="text-white mb-0">{{ selectedFederation.country || 'N/A' }}</p>
          </div>
          <div class="col-md-6">
            <small class="text-white-50">City:</small>
            <p class="text-white mb-0">{{ selectedFederation.city || 'N/A' }}</p>
          </div>
          <div class="col-12" v-if="selectedFederation.address">
            <small class="text-white-50">Address:</small>
            <p class="text-white mb-0">{{ selectedFederation.address }}</p>
          </div>
          <div class="col-12" v-if="selectedFederation.rejection_reason">
            <small class="text-white-50">Rejection/Suspension Reason:</small>
            <p class="text-danger mb-0">{{ selectedFederation.rejection_reason }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="showRejectModal" class="modal-overlay" @click.self="showRejectModal = false">
      <div class="modal-content n11-bg rounded-8 p-4" style="max-width: 500px;">
        <h3 class="text-white mb-4">Reject Federation</h3>
        <div class="mb-3">
          <label class="form-label text-white">Reason (optional)</label>
          <textarea 
            v-model="rejectReason"
            class="form-control n11-bg text-white border-secondary"
            rows="3"
            placeholder="Enter rejection reason..."
          ></textarea>
        </div>
        <div class="d-flex gap-3">
          <button class="btn_primary flex-fill" @click="rejectFederation" :disabled="processing">
            Reject
          </button>
          <button class="btn_secondary" @click="showRejectModal = false">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Suspend Modal -->
    <div v-if="showSuspendModal" class="modal-overlay" @click.self="showSuspendModal = false">
      <div class="modal-content n11-bg rounded-8 p-4" style="max-width: 500px;">
        <h3 class="text-white mb-4">Suspend Federation</h3>
        <div class="mb-3">
          <label class="form-label text-white">Reason (optional)</label>
          <textarea 
            v-model="suspendReason"
            class="form-control n11-bg text-white border-secondary"
            rows="3"
            placeholder="Enter suspension reason..."
          ></textarea>
        </div>
        <div class="d-flex gap-3">
          <button class="btn_primary flex-fill" @click="suspendFederation" :disabled="processing">
            Suspend
          </button>
          <button class="btn_secondary" @click="showSuspendModal = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { IconEye, IconCheck, IconX, IconPencil, IconAlertTriangle } from "@tabler/icons-vue";
import apiClient from "@/utils/axios";

const federations = ref<any[]>([]);
const selectedFederation = ref<any>(null);
const stats = ref<any>({});
const loading = ref(false);
const loadingDetails = ref(false);
const processing = ref(false);
const searchQuery = ref("");
const filterStatus = ref("");
const showDetailsModal = ref(false);
const showRejectModal = ref(false);
const showSuspendModal = ref(false);
const rejectReason = ref("");
const suspendReason = ref("");

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    suspended: "Suspended",
  };
  return labels[status] || status;
};

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: "bg-warning",
    approved: "bg-success",
    rejected: "bg-danger",
    suspended: "bg-secondary",
  };
  return classes[status] || "bg-secondary";
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const loadFederations = async () => {
  try {
    loading.value = true;
    const params: any = {
      per_page: 50,
    };
    if (filterStatus.value) params.status = filterStatus.value;
    if (searchQuery.value) params.search = searchQuery.value;

    const response = await apiClient.get("/admin/federations", { params });

    if (response.data.success) {
      federations.value = response.data.data.data || response.data.data || [];
      // Calculate stats
      stats.value = {
        total: response.data.data.total || federations.value.length,
        approved: federations.value.filter((f: any) => f.status === 'approved').length,
        pending: federations.value.filter((f: any) => f.status === 'pending').length,
        rejected: federations.value.filter((f: any) => f.status === 'rejected').length,
        suspended: federations.value.filter((f: any) => f.status === 'suspended').length,
      };
    }
  } catch (err: any) {
    console.error("Error loading federations:", err);
  } finally {
    loading.value = false;
  }
};

const viewDetails = async (id: number) => {
  try {
    loadingDetails.value = true;
    showDetailsModal.value = true;
    const response = await apiClient.get(`/admin/federations/${id}`);

    if (response.data.success) {
      selectedFederation.value = response.data.data;
    }
  } catch (err: any) {
    console.error("Error loading federation details:", err);
  } finally {
    loadingDetails.value = false;
  }
};

const approveFederation = async (id: number) => {
  if (!confirm("Are you sure you want to approve this federation?")) return;

  try {
    processing.value = true;
    const response = await apiClient.post(`/admin/federations/${id}/approve`);

    if (response.data.success) {
      await loadFederations();
      alert("Federation approved successfully");
    }
  } catch (err: any) {
    console.error("Error approving federation:", err);
    alert(err.response?.data?.message || "Error approving federation");
  } finally {
    processing.value = false;
  }
};

const openRejectModal = (federation: any) => {
  selectedFederation.value = federation;
  rejectReason.value = "";
  showRejectModal.value = true;
};

const rejectFederation = async () => {
  if (!selectedFederation.value) return;

  try {
    processing.value = true;
    const response = await apiClient.post(`/admin/federations/${selectedFederation.value.id}/reject`, {
      reason: rejectReason.value,
    });

    if (response.data.success) {
      showRejectModal.value = false;
      await loadFederations();
      alert("Federation rejected");
    }
  } catch (err: any) {
    console.error("Error rejecting federation:", err);
    alert(err.response?.data?.message || "Error rejecting federation");
  } finally {
    processing.value = false;
  }
};

const openSuspendModal = (federation: any) => {
  selectedFederation.value = federation;
  suspendReason.value = "";
  showSuspendModal.value = true;
};

const suspendFederation = async () => {
  if (!selectedFederation.value) return;

  try {
    processing.value = true;
    const response = await apiClient.post(`/admin/federations/${selectedFederation.value.id}/suspend`, {
      reason: suspendReason.value,
    });

    if (response.data.success) {
      showSuspendModal.value = false;
      await loadFederations();
      alert("Federation suspended");
    }
  } catch (err: any) {
    console.error("Error suspending federation:", err);
    alert(err.response?.data?.message || "Error suspending federation");
  } finally {
    processing.value = false;
  }
};

const editFederation = (federation: any) => {
  // TODO: Implement edit functionality
  alert("Edit functionality coming soon");
};

onMounted(() => {
  loadFederations();
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: #1a1f3a;
  border-radius: 12px;
  padding: 24px;
  max-width: 90vw;
}

.stat-card {
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}
</style>

