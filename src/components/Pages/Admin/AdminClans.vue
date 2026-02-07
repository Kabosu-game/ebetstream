<template>
  <div class="pay_method__paymethod p-3 p-md-4 p-lg-6 p2-bg rounded-8">
    <div class="pay_method__paymethod-title mb-5 mb-md-6 d-flex justify-content-between align-items-center flex-wrap gap-3">
      <div>
        <h2 class="text-white fw-bold mb-2">Clan Management</h2>
        <p class="text-white-50">Manage all platform clans</p>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="row g-3 mb-4">
      <div class="col-md-3 col-sm-6">
        <div class="stat-card n11-bg rounded-8 p-3">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <p class="text-white-50 small mb-1">Total Clans</p>
              <h3 class="text-white mb-0">{{ stats.total_clans || 0 }}</h3>
            </div>
            <div class="stat-icon bg-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
              <i class="fas fa-shield-alt text-white"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-sm-6">
        <div class="stat-card n11-bg rounded-8 p-3">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <p class="text-white-50 small mb-1">Active Clans</p>
              <h3 class="text-success mb-0">{{ stats.active_clans || 0 }}</h3>
            </div>
            <div class="stat-icon bg-success rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
              <i class="fas fa-check-circle text-white"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-sm-6">
        <div class="stat-card n11-bg rounded-8 p-3">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <p class="text-white-50 small mb-1">Total Members</p>
              <h3 class="text-white mb-0">{{ stats.total_members || 0 }}</h3>
            </div>
            <div class="stat-icon bg-info rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
              <i class="fas fa-users text-white"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-sm-6">
        <div class="stat-card n11-bg rounded-8 p-3">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <p class="text-white-50 small mb-1">Pending Candidates</p>
              <h3 class="text-warning mb-0">{{ stats.pending_candidates || 0 }}</h3>
            </div>
            <div class="stat-icon bg-warning rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
              <i class="fas fa-crown text-white"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="d-flex gap-3 mb-4 flex-wrap">
      <input 
        v-model="searchQuery" 
        type="text" 
        class="form-control n11-bg text-white border-secondary" 
        placeholder="Search by name, leader..."
        style="max-width: 300px;"
      />
      <select v-model="filterStatus" class="form-select n11-bg text-white border-secondary" style="max-width: 200px;">
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
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
              <th class="text-white p-3">Leader</th>
              <th class="text-white p-3">Members</th>
              <th class="text-white p-3">Candidates</th>
              <th class="text-white p-3">Status</th>
              <th class="text-white p-3">Created</th>
              <th class="text-white p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="clan in filteredClans" :key="clan.id" class="border-top border-secondary">
              <td class="text-white p-3">{{ clan.id }}</td>
              <td class="text-white p-3">
                <div class="text-start">
                  <strong>{{ clan.name }}</strong>
                  <p v-if="clan.description" class="text-white-50 small mb-0" style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    {{ clan.description }}
                  </p>
                </div>
              </td>
              <td class="text-white p-3">
                <span v-if="clan.leader">{{ clan.leader.username }}</span>
                <span v-else class="text-white-50">No leader</span>
              </td>
              <td class="text-white p-3">
                <span class="badge bg-info">
                  {{ clan.members_count || 0 }}/{{ clan.max_members || 50 }}
                </span>
              </td>
              <td class="text-white p-3">
                <span class="badge bg-warning">
                  {{ clan.candidates_count || 0 }}
                </span>
              </td>
              <td class="p-3">
                <span :class="['badge', clan.status === 'active' ? 'bg-success' : 'bg-secondary']">
                  {{ clan.status === 'active' ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="text-white p-3">{{ formatDate(clan.created_at) }}</td>
              <td class="p-3">
                <div class="d-flex gap-2 justify-content-center">
                  <button 
                    class="btn btn-sm btn-info text-white" 
                    @click="viewClanDetails(clan)"
                    title="View Details"
                    style="min-width: 35px; height: 35px; padding: 0; display: flex; align-items: center; justify-content: center;"
                  >
                    <IconEye :size="16" />
                  </button>
                  <button 
                    class="btn btn-sm btn-primary" 
                    @click="editClan(clan)"
                    title="Edit"
                    style="min-width: 35px; height: 35px; padding: 0; display: flex; align-items: center; justify-content: center;"
                  >
                    <IconPencil :size="16" />
                  </button>
                  <button 
                    class="btn btn-sm btn-danger" 
                    @click="confirmDelete(clan)"
                    title="Delete"
                    style="min-width: 35px; height: 35px; padding: 0; display: flex; align-items: center; justify-content: center;"
                  >
                    <IconTrash :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.total > pagination.per_page" class="d-flex justify-content-center mt-4">
      <nav>
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: !pagination.prev_page_url }">
            <button class="page-link" @click="loadPage(pagination.current_page - 1)" :disabled="!pagination.prev_page_url">
              Previous
            </button>
          </li>
          <li class="page-item" :class="{ active: page === pagination.current_page }" v-for="page in pagination.last_page" :key="page">
            <button class="page-link" @click="loadPage(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: !pagination.next_page_url }">
            <button class="page-link" @click="loadPage(pagination.current_page + 1)" :disabled="!pagination.next_page_url">
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Details Modal -->
    <div v-if="showDetailsModal" class="modal-overlay" @click.self="showDetailsModal = false">
      <div class="modal-content n11-bg rounded-8 p-4" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="text-white mb-0">Clan Details</h3>
          <button class="btn-close btn-close-white" @click="showDetailsModal = false"></button>
        </div>

        <div v-if="loadingDetails" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>

        <div v-else-if="clanDetails">
          <div class="row g-4 mb-4">
            <div class="col-md-6">
              <div class="n11-bg rounded-8 p-4">
                <h5 class="text-white mb-3">Information</h5>
                <div class="mb-2">
                  <small class="text-white-50">Name:</small>
                  <p class="text-white mb-0">{{ clanDetails.name }}</p>
                </div>
                <div class="mb-2">
                  <small class="text-white-50">Leader:</small>
                  <p class="text-white mb-0">
                    {{ clanDetails.leader?.username || 'No leader' }}
                    <span v-if="clanDetails.leader?.email" class="text-white-50">({{ clanDetails.leader.email }})</span>
                  </p>
                </div>
                <div class="mb-2">
                  <small class="text-white-50">Status:</small>
                  <p class="mb-0">
                    <span :class="['badge', clanDetails.status === 'active' ? 'bg-success' : 'bg-secondary']">
                      {{ clanDetails.status === 'active' ? 'Active' : 'Inactive' }}
                    </span>
                  </p>
                </div>
                <div class="mb-2">
                  <small class="text-white-50">Members:</small>
                  <p class="text-white mb-0">{{ clanDetails.members_count || 0 }}/{{ clanDetails.max_members || 50 }}</p>
                </div>
                <div v-if="clanDetails.description">
                  <small class="text-white-50">Description:</small>
                  <p class="text-white mb-0">{{ clanDetails.description }}</p>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="n11-bg rounded-8 p-4">
                <h5 class="text-white mb-3">Statistics</h5>
                <div class="mb-2">
                  <small class="text-white-50">Total Members:</small>
                  <p class="text-white mb-0">{{ clanStats.total_members || 0 }}</p>
                </div>
                <div class="mb-2">
                  <small class="text-white-50">Pending Candidates:</small>
                  <p class="text-white mb-0">{{ clanStats.pending_candidates || 0 }}</p>
                </div>
                <div class="mb-2">
                  <small class="text-white-50">Total Messages:</small>
                  <p class="text-white mb-0">{{ clanStats.total_messages || 0 }}</p>
                </div>
                <div class="mb-2">
                  <small class="text-white-50">Total Votes:</small>
                  <p class="text-white mb-0">{{ clanStats.total_votes || 0 }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Tabs -->
          <ul class="nav nav-tabs mb-3">
            <li class="nav-item">
              <button 
                class="nav-link" 
                :class="{ 'active': activeTab === 'members' }"
                @click="activeTab = 'members'"
              >
                Members ({{ clanDetails.members?.length || 0 }})
              </button>
            </li>
            <li class="nav-item">
              <button 
                class="nav-link" 
                :class="{ 'active': activeTab === 'candidates' }"
                @click="activeTab = 'candidates'"
              >
                Candidates ({{ clanDetails.candidates?.length || 0 }})
              </button>
            </li>
            <li class="nav-item">
              <button 
                class="nav-link" 
                :class="{ 'active': activeTab === 'messages' }"
                @click="activeTab = 'messages'"
              >
                Messages ({{ clanDetails.all_messages_count || 0 }})
              </button>
            </li>
          </ul>

          <!-- Members Tab -->
          <div v-if="activeTab === 'members'" class="n11-bg rounded-8 p-4">
            <div v-if="clanDetails.members && clanDetails.members.length > 0" class="row g-3">
              <div v-for="member in clanDetails.members" :key="member.id" class="col-md-6">
                <div class="d-flex align-items-center justify-content-between p-3 rounded" style="background: rgba(255,255,255,0.05);">
                  <div>
                    <strong class="text-white">{{ member.username }}</strong>
                    <span v-if="clanDetails.leader_id === member.id" class="badge bg-warning ms-2">
                      <i class="fas fa-crown"></i> Leader
                    </span>
                    <p class="text-white-50 small mb-0">{{ member.email }}</p>
                  </div>
                  <button 
                    v-if="clanDetails.leader_id !== member.id"
                    class="btn btn-sm btn-danger"
                    @click="removeMember(member.id)"
                    title="Remove Member"
                  >
                    <IconUserMinus :size="16" />
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4 text-white-50">
              No members found
            </div>
          </div>

          <!-- Candidates Tab -->
          <div v-if="activeTab === 'candidates'" class="n11-bg rounded-8 p-4">
            <div v-if="clanDetails.candidates && clanDetails.candidates.length > 0">
              <div v-for="candidate in clanDetails.candidates" :key="candidate.id" class="mb-3 p-3 rounded" :style="{ background: candidate.status === 'pending' ? 'rgba(255,193,7,0.1)' : candidate.status === 'approved' ? 'rgba(40,167,69,0.1)' : 'rgba(108,117,125,0.1)' }">
                <div class="d-flex justify-content-between align-items-start">
                  <div class="flex-grow-1">
                    <div class="d-flex align-items-center gap-2 mb-2">
                      <strong class="text-white">{{ candidate.user?.username }}</strong>
                      <span :class="['badge', candidate.status === 'pending' ? 'bg-warning' : candidate.status === 'approved' ? 'bg-success' : 'bg-secondary']">
                        {{ candidate.status }}
                      </span>
                    </div>
                    <p v-if="candidate.motivation" class="text-white-50 small mb-2">{{ candidate.motivation }}</p>
                    <div class="d-flex gap-3">
                      <small class="text-white-50">
                        <i class="fas fa-vote-yea me-1"></i>{{ candidate.vote_count }} votes
                      </small>
                      <small v-if="candidate.approved_at" class="text-white-50">
                        Approved: {{ formatDate(candidate.approved_at) }}
                      </small>
                    </div>
                  </div>
                  <button 
                    v-if="candidate.status === 'pending'"
                    class="btn btn-sm btn-success"
                    @click="approveLeader(candidate.id)"
                    title="Approve as Leader"
                  >
                    <IconCheck :size="16" class="me-1" /> Approve
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4 text-white-50">
              No candidates found
            </div>
          </div>

          <!-- Messages Tab -->
          <div v-if="activeTab === 'messages'" class="n11-bg rounded-8 p-4">
            <div style="max-height: 400px; overflow-y: auto;">
              <div v-if="clanDetails.all_messages && clanDetails.all_messages.length > 0">
                <div v-for="message in clanDetails.all_messages" :key="message.id" class="mb-3 p-3 rounded" style="background: rgba(255,255,255,0.05);">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <strong class="text-white">{{ message.user?.username }}</strong>
                      <small class="text-white-50 ms-2">{{ formatTime(message.created_at) }}</small>
                    </div>
                  </div>
                  <p class="text-white mb-0">{{ message.message }}</p>
                </div>
              </div>
              <div v-else class="text-center py-4 text-white-50">
                No messages found
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal-content n11-bg rounded-8 p-4" style="max-width: 600px;">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="text-white mb-0">Edit Clan</h3>
          <button class="btn-close btn-close-white" @click="showEditModal = false"></button>
        </div>

        <form @submit.prevent="saveClan">
          <div class="mb-3">
            <label class="text-white mb-2 d-block fw-bold">Name *</label>
            <input 
              v-model="editForm.name"
              type="text" 
              class="form-control n11-bg text-white border-secondary" 
              required
              maxlength="100"
            />
          </div>

          <div class="mb-3">
            <label class="text-white mb-2 d-block fw-bold">Logo URL</label>
            <input 
              v-model="editForm.logo"
              type="url" 
              class="form-control n11-bg text-white border-secondary" 
              maxlength="255"
            />
          </div>

          <div class="mb-3">
            <label class="text-white mb-2 d-block fw-bold">Description</label>
            <textarea 
              v-model="editForm.description"
              class="form-control n11-bg text-white border-secondary" 
              rows="4"
              maxlength="1000"
            ></textarea>
          </div>

          <div class="mb-3">
            <label class="text-white mb-2 d-block fw-bold">Status</label>
            <select v-model="editForm.status" class="form-select n11-bg text-white border-secondary">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="text-white mb-2 d-block fw-bold">Max Members</label>
            <input 
              v-model.number="editForm.max_members"
              type="number" 
              class="form-control n11-bg text-white border-secondary" 
              min="5"
              max="100"
            />
          </div>

          <div v-if="editError" class="alert alert-danger mb-3">{{ editError }}</div>
          <div v-if="editSuccess" class="alert alert-success mb-3">{{ editSuccess }}</div>

          <div class="d-flex gap-3">
            <button 
              type="submit" 
              class="btn_primary flex-fill" 
              :disabled="saving"
            >
              <span v-if="saving">Saving...</span>
              <span v-else>Save Changes</span>
            </button>
            <button 
              type="button" 
              class="btn_secondary" 
              @click="showEditModal = false"
              :disabled="saving"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { IconEye, IconPencil, IconTrash, IconUserMinus, IconCheck } from "@tabler/icons-vue";
import apiClient from "@/utils/axios";

interface Clan {
  id: number;
  name: string;
  logo?: string;
  description?: string;
  leader_id?: number;
  leader?: {
    id: number;
    username: string;
    email?: string;
  };
  status: string;
  member_count: number;
  max_members: number;
  members_count?: number;
  candidates_count?: number;
  created_at: string;
  members?: any[];
  candidates?: any[];
  all_messages?: any[];
  all_messages_count?: number;
}

const clans = ref<Clan[]>([]);
const loading = ref(false);
const searchQuery = ref('');
const filterStatus = ref('');
const stats = ref({
  total_clans: 0,
  active_clans: 0,
  total_members: 0,
  pending_candidates: 0,
});
const pagination = ref<any>(null);

const showDetailsModal = ref(false);
const clanDetails = ref<Clan | null>(null);
const clanStats = ref<any>({});
const loadingDetails = ref(false);
const activeTab = ref('members');

const showEditModal = ref(false);
const editingClan = ref<Clan | null>(null);
const saving = ref(false);
const editError = ref('');
const editSuccess = ref('');
const editForm = ref({
  name: '',
  logo: '',
  description: '',
  status: 'active',
  max_members: 50,
});

const filteredClans = computed(() => {
  let filtered = clans.value;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(query) ||
      (c.leader?.username && c.leader.username.toLowerCase().includes(query)) ||
      (c.description && c.description.toLowerCase().includes(query))
    );
  }
  
  if (filterStatus.value) {
    filtered = filtered.filter(c => c.status === filterStatus.value);
  }
  
  return filtered;
});

const loadClans = async (page = 1) => {
  try {
    loading.value = true;
    const response = await apiClient.get('/admin/clans', {
      params: { 
        page,
        per_page: 50,
        status: filterStatus.value || undefined,
        search: searchQuery.value || undefined,
      }
    });
    
    if (response.data.success) {
      clans.value = response.data.data.data || response.data.data || [];
      pagination.value = response.data.data;
      if (response.data.stats) {
        stats.value = response.data.stats;
      }
    }
  } catch (err: any) {
    console.error('Error loading clans:', err);
    alert('Error loading clans: ' + (err.response?.data?.message || err.message));
  } finally {
    loading.value = false;
  }
};

const loadPage = (page: number) => {
  loadClans(page);
};

const viewClanDetails = async (clan: Clan) => {
  showDetailsModal.value = true;
  loadingDetails.value = true;
  activeTab.value = 'members';
  clanDetails.value = null;
  clanStats.value = {};

  try {
    const response = await apiClient.get(`/admin/clans/${clan.id}`);
    if (response.data.success) {
      clanDetails.value = response.data.data;
      clanStats.value = response.data.stats || {};
    }
  } catch (err: any) {
    console.error('Error loading clan details:', err);
    alert('Error loading clan details: ' + (err.response?.data?.message || err.message));
  } finally {
    loadingDetails.value = false;
  }
};

const editClan = (clan: Clan) => {
  editingClan.value = clan;
  editForm.value = {
    name: clan.name,
    logo: clan.logo || '',
    description: clan.description || '',
    status: clan.status,
    max_members: clan.max_members || 50,
  };
  showEditModal.value = true;
  editError.value = '';
  editSuccess.value = '';
};

const saveClan = async () => {
  if (!editingClan.value) return;

  try {
    saving.value = true;
    editError.value = '';
    editSuccess.value = '';

    const response = await apiClient.put(`/admin/clans/${editingClan.value.id}`, editForm.value);

    if (response.data.success) {
      editSuccess.value = 'Clan updated successfully!';
      await loadClans(pagination.value?.current_page || 1);
      setTimeout(() => {
        showEditModal.value = false;
      }, 1500);
    } else {
      editError.value = response.data.message || 'Error updating clan';
    }
  } catch (err: any) {
    console.error('Error updating clan:', err);
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      editError.value = Object.values(errors).flat().join(', ');
    } else {
      editError.value = err.response?.data?.message || 'Error updating clan';
    }
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (clan: Clan) => {
  if (confirm(`Are you sure you want to delete the clan "${clan.name}"? This action cannot be undone.`)) {
    deleteClan(clan.id);
  }
};

const deleteClan = async (id: number) => {
  try {
    const response = await apiClient.delete(`/admin/clans/${id}`);
    
    if (response.data.success) {
      await loadClans(pagination.value?.current_page || 1);
      alert('Clan deleted successfully');
    } else {
      alert('Error deleting clan: ' + (response.data.message || 'Unknown error'));
    }
  } catch (err: any) {
    console.error('Error deleting clan:', err);
    alert('Error deleting clan: ' + (err.response?.data?.message || err.message));
  }
};

const removeMember = async (userId: number) => {
  if (!clanDetails.value) return;
  
  if (!confirm('Are you sure you want to remove this member from the clan?')) {
    return;
  }

  try {
    const response = await apiClient.delete(`/admin/clans/${clanDetails.value.id}/members/${userId}`);
    
    if (response.data.success) {
      await viewClanDetails(clanDetails.value);
      alert('Member removed successfully');
    } else {
      alert('Error removing member: ' + (response.data.message || 'Unknown error'));
    }
  } catch (err: any) {
    console.error('Error removing member:', err);
    alert('Error removing member: ' + (err.response?.data?.message || err.message));
  }
};

const approveLeader = async (candidateId: number) => {
  if (!clanDetails.value) return;
  
  if (!confirm('Are you sure you want to approve this candidate as the new leader? This will replace the current leader.')) {
    return;
  }

  try {
    const response = await apiClient.post(`/admin/clans/${clanDetails.value.id}/approve-leader`);
    
    if (response.data.success) {
      await viewClanDetails(clanDetails.value);
      alert('New leader approved successfully!');
    } else {
      alert('Error approving leader: ' + (response.data.message || 'Unknown error'));
    }
  } catch (err: any) {
    console.error('Error approving leader:', err);
    alert('Error approving leader: ' + (err.response?.data?.message || err.message));
  }
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

const formatTime = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(() => {
  loadClans();
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

.pagination .page-link {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.pagination .page-item.active .page-link {
  background-color: #FF9F00;
  border-color: #FF9F00;
}

.pagination .page-item.disabled .page-link {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

