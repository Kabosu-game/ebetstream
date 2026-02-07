<template>
  <div class="pay_method__paymethod p-3 p-md-4 p-lg-6 p2-bg rounded-8">
    <div class="pay_method__paymethod-title mb-5 mb-md-6 d-flex justify-content-between align-items-center">
      <div>
        <h2 class="text-white fw-bold mb-2">User Management</h2>
        <p class="text-white-50">Manage all platform users</p>
      </div>
      <button class="btn_primary" @click="showCreateModal = true">
        <IconPlus :size="18" class="me-2" />New User
      </button>
    </div>

    <!-- Filters -->
    <div class="d-flex gap-3 mb-4 flex-wrap">
      <input 
        v-model="searchQuery" 
        type="text" 
        class="form-control n11-bg text-white border-secondary" 
        placeholder="Search for a user..."
        style="max-width: 300px;"
      />
      <select v-model="filterRole" class="form-select n11-bg text-white border-secondary" style="max-width: 200px;">
        <option value="">Tous les rôles</option>
        <option value="user">Utilisateur</option>
        <option value="admin">Admin</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Users Table -->
    <div v-else class="pay_method__table">
      <div class="pay_method__table-scrollbar overflow-x-auto">
        <table class="w-100 text-center p2-bg">
          <thead>
            <tr>
              <th class="text-white p-3">ID</th>
              <th class="text-white p-3">Name</th>
              <th class="text-white p-3">Email</th>
              <th class="text-white p-3">Username</th>
              <th class="text-white p-3">Role</th>
              <th class="text-white p-3">eBetStar</th>
              <th class="text-white p-3">Balance</th>
              <th class="text-white p-3">Registration Date</th>
              <th class="text-white p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="border-top border-secondary">
              <td class="text-white p-3">{{ user.id }}</td>
              <td class="text-white p-3">{{ user.name || 'N/A' }}</td>
              <td class="text-white p-3">{{ user.email }}</td>
              <td class="text-white p-3">{{ user.username || 'N/A' }}</td>
              <td class="p-3">
                <span :class="['badge', user.role === 'admin' ? 'bg-danger' : 'bg-primary']">
                  {{ user.role || 'user' }}
                </span>
              </td>
              <td class="p-3">
                <span v-if="(user as any).is_ebetstar" class="badge bg-warning text-dark">
                  ⭐ eBetStar
                </span>
                <span v-else class="text-white-50">-</span>
              </td>
              <td class="text-white p-3">{{ formatNumber(user.balance || 0) }} EBT</td>
              <td class="text-white p-3">{{ formatDate(user.created_at) }}</td>
              <td class="p-3">
                <div class="d-flex gap-2 justify-content-center">
                  <button class="btn btn-sm btn-success" @click="openBalanceModal(user)" title="Modify Balance">
                    <IconWallet :size="16" />
                  </button>
                  <button class="btn btn-sm btn-warning" @click="editUser(user)" title="Edit">
                    <IconEdit :size="16" />
                  </button>
                  <button class="btn btn-sm btn-danger" @click="deleteUser(user.id)" title="Delete">
                    <IconTrash :size="16" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="users.length === 0 && !loading">
              <td colspan="9" class="text-white p-5 text-center">No users found</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div v-if="pagination && pagination.last_page > 1" class="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
        <div class="text-white-50">
          Showing {{ pagination.from || 0 }} to {{ pagination.to || 0 }} of {{ pagination.total || 0 }} users
        </div>
        <nav>
          <ul class="pagination mb-0">
            <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
              <button class="page-link n11-bg text-white border-secondary" @click="goToPage(pagination.current_page - 1)" :disabled="pagination.current_page === 1">
                Previous
              </button>
            </li>
            <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === pagination.current_page }">
              <button class="page-link n11-bg text-white border-secondary" @click="goToPage(page)" :class="{ 'bg-primary': page === pagination.current_page }">
                {{ page }}
              </button>
            </li>
            <li class="page-item" :class="{ disabled: pagination.current_page === pagination.last_page }">
              <button class="page-link n11-bg text-white border-secondary" @click="goToPage(pagination.current_page + 1)" :disabled="pagination.current_page === pagination.last_page">
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Balance Modal -->
    <div v-if="showBalanceModal && selectedUser" class="popup-overlay" @click.self="closeBalanceModal">
      <div class="popup-box p-5 rounded-4 shadow-lg n11-bg" style="max-width: 500px; max-height: 90vh; overflow-y: auto;">
        <h3 class="fw-bold mb-4 text-center text-white">
          Modify Balance
        </h3>
        <div class="mb-4 p-3 rounded n11-bg border border-secondary">
          <p class="text-white-50 mb-1 small">User</p>
          <p class="text-white mb-0 fw-bold">{{ selectedUser.name || selectedUser.email }}</p>
          <p class="text-white-50 mb-1 small mt-2">Current Balance</p>
          <p class="text-white mb-0 fw-bold fs-4">{{ formatNumber(selectedUser.balance || 0) }} EBT</p>
        </div>
        <form @submit.prevent="updateBalance">
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Operation Type</label>
            <div class="d-flex gap-3">
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="radio" 
                  id="balanceTypeAdd" 
                  value="add" 
                  v-model="balanceForm.type"
                />
                <label class="form-check-label text-white" for="balanceTypeAdd">
                  Add
                </label>
              </div>
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="radio" 
                  id="balanceTypeSubtract" 
                  value="subtract" 
                  v-model="balanceForm.type"
                />
                <label class="form-check-label text-white" for="balanceTypeSubtract">
                  Subtract
                </label>
              </div>
            </div>
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Amount (EBT)</label>
            <input 
              v-model.number="balanceForm.amount"
              type="number" 
              step="0.01"
              min="0.01"
              class="form-control n11-bg text-white border-secondary" 
              placeholder="0.00"
              required
            />
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Reason (optional)</label>
            <textarea 
              v-model="balanceForm.reason"
              class="form-control n11-bg text-white border-secondary" 
              rows="3"
              placeholder="Ex: Balance adjustment, Discount, etc."
            ></textarea>
          </div>
          <div v-if="balanceError" class="alert alert-danger mb-4">{{ balanceError }}</div>
          <div v-if="balanceForm.type === 'subtract' && selectedUser.balance !== undefined && selectedUser.balance < balanceForm.amount" class="alert alert-warning mb-4">
            ⚠ Current balance ({{ formatNumber(selectedUser.balance || 0) }} EBT) is less than the amount to subtract.
          </div>
          <div class="d-flex gap-3">
            <button 
              type="submit" 
              class="btn_primary flex-fill" 
              :disabled="savingBalance || (balanceForm.type === 'subtract' && selectedUser.balance !== undefined && selectedUser.balance < balanceForm.amount)"
            >
              <span v-if="savingBalance">Saving...</span>
              <span v-else>{{ balanceForm.type === 'add' ? 'Add' : 'Subtract' }}</span>
            </button>
            <button type="button" class="btn_secondary" @click="closeBalanceModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || editingUser" class="popup-overlay" @click.self="closeModal">
      <div class="popup-box p-5 rounded-4 shadow-lg n11-bg" style="max-width: 600px; max-height: 90vh; overflow-y: auto;">
        <h3 class="fw-bold mb-4 text-center text-white">
          {{ editingUser ? 'Edit User' : 'New User' }}
        </h3>
        <form @submit.prevent="saveUser">
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Name (optional)</label>
            <input 
              v-model="userForm.name"
              type="text" 
              class="form-control n11-bg text-white border-secondary" 
            />
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Email</label>
            <input 
              v-model="userForm.email"
              type="email" 
              class="form-control n11-bg text-white border-secondary" 
              required
            />
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Username</label>
            <input 
              v-model="userForm.username"
              type="text" 
              class="form-control n11-bg text-white border-secondary" 
            />
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Role</label>
            <select v-model="userForm.role" class="form-select n11-bg text-white border-secondary">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="form-group mb-4">
            <div class="form-check">
              <input 
                class="form-check-input" 
                type="checkbox" 
                id="isEbetstar" 
                v-model="userForm.is_ebetstar"
              />
              <label class="form-check-label text-white" for="isEbetstar">
                Mark as eBetStar
              </label>
            </div>
            <small class="text-white-50 d-block mt-1">eBetStars are featured players displayed on the eBetStars page</small>
          </div>
          <div v-if="!editingUser" class="form-group mb-4">
            <label class="text-white mb-2 d-block">Password</label>
            <input 
              v-model="userForm.password"
              type="password" 
              class="form-control n11-bg text-white border-secondary" 
              :required="!editingUser"
            />
          </div>
          <div v-if="error" class="alert alert-danger mb-4">{{ error }}</div>
          <div class="d-flex gap-3">
            <button type="submit" class="btn_primary flex-fill" :disabled="saving">
              <span v-if="saving">Saving...</span>
              <span v-else>Save</span>
            </button>
            <button type="button" class="btn_secondary" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import apiClient from '@/utils/axios';
import { IconPlus, IconEdit, IconTrash, IconWallet } from '@tabler/icons-vue';

interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
  role?: string;
  balance?: number;
  created_at: string;
  is_ebetstar?: boolean;
}

interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

const users = ref<User[]>([]);
const pagination = ref<Pagination | null>(null);
const loading = ref(false);
const searchQuery = ref('');
const filterRole = ref('');
const currentPage = ref(1);
const perPage = ref(20);
const searchTimeout = ref<number | null>(null);
const showCreateModal = ref(false);
const editingUser = ref<User | null>(null);
const saving = ref(false);
const error = ref('');

// Balance modal
const showBalanceModal = ref(false);
const selectedUser = ref<User | null>(null);
const savingBalance = ref(false);
const balanceError = ref('');
const balanceForm = ref({
  type: 'add' as 'add' | 'subtract',
  amount: 0,
  reason: '',
});

const userForm = ref({
  name: '',
  email: '',
  username: '',
  role: 'user',
  password: '',
  is_ebetstar: false,
});

const visiblePages = computed(() => {
  if (!pagination.value) return [];
  const pages: number[] = [];
  const current = pagination.value.current_page;
  const last = pagination.value.last_page;
  
  // Afficher max 5 pages autour de la page actuelle
  let start = Math.max(1, current - 2);
  let end = Math.min(last, current + 2);
  
  // Ajuster si on est près du début ou de la fin
  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(last, start + 4);
    } else if (end === last) {
      start = Math.max(1, end - 4);
    }
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

const loadUsers = async () => {
  try {
    loading.value = true;
    const params: any = {
      page: currentPage.value,
      per_page: perPage.value,
    };
    
    if (searchQuery.value) {
      params.search = searchQuery.value;
    }
    
    if (filterRole.value) {
      params.role = filterRole.value;
    }
    
    const response = await apiClient.get('/admin/users', { params });
    
    if (response.data.success) {
      const data = response.data.data;
      users.value = data.data || [];
      
      // Transformer les données utilisateur pour inclure le nom du profil
      users.value = users.value.map((user: any) => {
        return {
          ...user,
          name: user.profile?.full_name || user.name || '',
        };
      });
      
      pagination.value = {
        current_page: data.current_page || 1,
        last_page: data.last_page || 1,
        per_page: data.per_page || 20,
        total: data.total || 0,
        from: data.from || 0,
        to: data.to || 0,
      };
      
      // Synchroniser currentPage avec la réponse
      currentPage.value = pagination.value.current_page;
    }
  } catch (err: any) {
    console.error('Error loading users:', err);
    users.value = [];
    pagination.value = null;
  } finally {
    loading.value = false;
  }
};

const goToPage = (page: number) => {
  if (page >= 1 && pagination.value && page <= pagination.value.last_page) {
    currentPage.value = page;
    loadUsers();
  }
};

// Watch pour la recherche avec debounce
watch(searchQuery, () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  searchTimeout.value = window.setTimeout(() => {
    currentPage.value = 1; // Reset à la première page lors de la recherche
    loadUsers();
  }, 500); // 500ms de debounce
});

// Watch pour le filtre de rôle
watch(filterRole, () => {
  currentPage.value = 1; // Reset à la première page lors du changement de filtre
  loadUsers();
});

const saveUser = async () => {
  try {
    saving.value = true;
    error.value = '';
    
    if (editingUser.value) {
      await apiClient.put(`/admin/users/${editingUser.value.id}`, userForm.value);
    } else {
      await apiClient.post('/admin/users', userForm.value);
    }
    
    closeModal();
    await loadUsers();
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error saving user';
  } finally {
    saving.value = false;
  }
};

const editUser = (user: User) => {
  editingUser.value = user;
  userForm.value = {
    name: user.name,
    email: user.email,
    username: user.username || '',
    role: user.role || 'user',
    password: '',
    is_ebetstar: (user as any).is_ebetstar || false,
  };
};

const deleteUser = async (id: number) => {
  if (!confirm('Are you sure you want to delete this user?')) return;
  
  try {
    await apiClient.delete(`/admin/users/${id}`);
    await loadUsers();
  } catch (err: any) {
    alert(err.response?.data?.message || 'Error deleting user');
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  editingUser.value = null;
  userForm.value = {
    name: '',
    email: '',
    username: '',
    role: 'user',
    password: '',
    is_ebetstar: false,
  };
  error.value = '';
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US');
};

const openBalanceModal = (user: User) => {
  selectedUser.value = user;
  balanceForm.value = {
    type: 'add',
    amount: 0,
    reason: '',
  };
  balanceError.value = '';
  showBalanceModal.value = true;
};

const closeBalanceModal = () => {
  showBalanceModal.value = false;
  selectedUser.value = null;
  balanceForm.value = {
    type: 'add',
    amount: 0,
    reason: '',
  };
  balanceError.value = '';
};

const updateBalance = async () => {
  if (!selectedUser.value) return;
  
  try {
    savingBalance.value = true;
    balanceError.value = '';
    
    const response = await apiClient.post(
      `/admin/users/${selectedUser.value.id}/balance`,
      balanceForm.value
    );
    
    if (response.data.success) {
      closeBalanceModal();
      await loadUsers();
      alert(response.data.message);
    }
  } catch (err: any) {
    balanceError.value = err.response?.data?.message || 'Error updating balance';
  } finally {
    savingBalance.value = false;
  }
};

onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  overflow-y: auto;
}

.popup-box {
  max-height: 90vh;
  overflow-y: auto;
}

.popup-box .form-control,
.popup-box .form-select {
  color: white;
}

.popup-box .form-control:focus,
.popup-box .form-select:focus {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: #FF9F00;
  color: white;
}
</style>

