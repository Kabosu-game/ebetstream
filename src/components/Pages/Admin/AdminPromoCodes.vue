<template>
  <div class="pay_method__paymethod p-3 p-md-4 p-lg-6 p2-bg rounded-8">
    <div class="pay_method__paymethod-title mb-5 mb-md-6 d-flex justify-content-between align-items-center flex-wrap gap-3">
      <div>
        <h2 class="text-white fw-bold mb-2">Promo Codes</h2>
        <p class="text-white-50">Manage welcome codes and promo codes</p>
      </div>
      <button class="btn_primary" @click="showCreateModal = true; resetForm()">
        <IconPlus :size="18" class="me-2" />New Code
      </button>
    </div>

    <!-- Filters -->
    <div class="d-flex gap-3 mb-4 flex-wrap">
      <input 
        v-model="searchQuery" 
        type="text" 
        class="form-control n11-bg text-white border-secondary" 
        placeholder="Search for a code..."
        style="max-width: 300px;"
      />
      <select v-model="filterType" class="form-select n11-bg text-white border-secondary" style="max-width: 200px;">
        <option value="">All Types</option>
        <option value="welcome">Welcome Codes</option>
        <option value="personal">Personal Codes</option>
      </select>
      <select v-model="filterActive" class="form-select n11-bg text-white border-secondary" style="max-width: 200px;">
        <option value="">All Statuses</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Promo Codes List -->
    <div v-else class="row g-4">
      <div 
        v-for="code in filteredCodes" 
        :key="code.id"
        class="col-md-6 col-lg-4"
      >
        <div class="method_card n11-bg rounded-8 p-4 h-100">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h4 class="text-white mb-1">{{ code.code }}</h4>
              <div class="d-flex flex-wrap gap-2 mb-2">
                <span v-if="code.type === 'user_personal'" class="badge bg-info me-2">Personal Code</span>
                <span v-else-if="code.is_welcome_code" class="badge bg-success me-2">Welcome Code</span>
                <span :class="['badge', code.is_active !== false ? 'bg-success' : 'bg-secondary']">
                  {{ code.is_active !== false ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <div v-if="code.type === 'user_personal' && code.username" class="mt-2">
                <small class="text-white-50 d-block">User: <strong class="text-white">{{ code.username }}</strong></small>
                <small class="text-white-50 d-block">Email: {{ code.email }}</small>
              </div>
            </div>
            <div class="d-flex gap-2">
              <button 
                class="btn btn-sm btn-outline-warning p-1"
                @click="editCode(code)"
                title="Edit"
              >
                <IconPencil :size="16" />
              </button>
              <button 
                class="btn btn-sm btn-outline-danger p-1"
                @click="deleteCode(Number(code.id))"
                title="Delete"
              >
                <IconTrash :size="16" />
              </button>
            </div>
          </div>
          
          <p v-if="code.description" class="text-white-50 small mb-3">{{ code.description }}</p>
          
          <div class="d-flex flex-column gap-2">
            <!-- Information for welcome codes -->
            <template v-if="code.type !== 'user_personal'">
              <div v-if="code.welcome_bonus && code.welcome_bonus > 0" class="promo_bonus">
                <p class="text-white-50 small mb-0">
                  <strong class="text-white">Registration Bonus:</strong> ${{ formatNumber(code.welcome_bonus) }}
                </p>
              </div>
              <div v-if="code.first_deposit_bonus_percentage && code.first_deposit_bonus_percentage > 0" class="promo_bonus">
                <p class="text-white-50 small mb-0">
                  <strong class="text-white">First Deposit Bonus:</strong> {{ code.first_deposit_bonus_percentage }}%
                </p>
              </div>
              <div v-if="code.premium_days && code.premium_days > 0" class="promo_bonus">
                <p class="text-white-50 small mb-0">
                  <strong class="text-white">Premium Access:</strong> {{ code.premium_days }} days
                </p>
              </div>
              <div class="promo_usage mt-2">
                <p class="text-white-50 small mb-0">
                  <strong>Uses:</strong> {{ code.used_count || 0 }} / {{ code.usage_limit || '∞' }}
                </p>
              </div>
              <div v-if="code.expires_at" class="promo_expiry mt-2">
                <p class="text-white-50 small mb-0">
                  <strong>Expires on:</strong> {{ formatDate(code.expires_at) }}
                </p>
              </div>
            </template>
            <!-- Information for personal codes -->
            <template v-else>
              <div class="promo_usage mt-2">
                <p class="text-white-50 small mb-0">
                  <strong>Uses:</strong> {{ code.used_count || 0 }} times
                </p>
                <p class="text-white-50 small mb-0 mt-1">
                  <strong>Created on:</strong> {{ code.created_at ? formatDate(code.created_at) : 'N/A' }}
                </p>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div v-if="filteredCodes.length === 0" class="col-12">
        <div class="text-center py-5">
          <p class="text-white-50">No promo codes available</p>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content n11-bg p-4 rounded-8">
        <h4 class="text-white mb-4">
          {{ editingCode ? (editingCode.type === 'user_personal' ? 'Edit Personal Code' : 'Edit Code') : 'New Promo Code' }}
        </h4>
        <form @submit.prevent="saveCode">
          <div v-if="editingCode && editingCode.type === 'user_personal'" class="alert alert-info mb-3">
            <small class="text-white-50">
              <strong>User:</strong> {{ editingCode.username }} ({{ editingCode.email }})<br>
              This code can be modified but cannot be converted to a welcome code.
            </small>
          </div>
          <div class="form-group mb-3">
            <label class="text-white mb-2">Code</label>
            <input 
              v-model="formData.code" 
              type="text" 
              class="form-control n11-bg text-white border-secondary" 
              placeholder="Ex: WELCOME2024"
              required
              :disabled="!!editingCode && editingCode.type !== 'user_personal'"
            />
          </div>
          <!-- Fields for welcome codes only -->
          <template v-if="!editingCode || editingCode.type !== 'user_personal'">
            <div class="form-group mb-3">
              <label class="text-white mb-2">Description (optional)</label>
              <textarea 
                v-model="formData.description" 
                class="form-control n11-bg text-white border-secondary" 
                rows="2"
                placeholder="Promo code description"
              ></textarea>
            </div>
            <div class="form-group mb-3">
              <div class="form-check">
                <input 
                  v-model="formData.is_welcome_code" 
                  class="form-check-input" 
                  type="checkbox" 
                  id="isWelcomeCode"
                />
                <label class="form-check-label text-white" for="isWelcomeCode">
                  Welcome code (for new players)
                </label>
              </div>
            </div>
            <div class="form-group mb-3">
              <label class="text-white mb-2">Registration Bonus ($)</label>
              <input 
                v-model.number="formData.welcome_bonus" 
                type="number" 
                step="0.01"
                min="0"
                class="form-control n11-bg text-white border-secondary" 
                placeholder="0.00"
              />
              <small class="text-white-50 d-block mt-1">Amount automatically credited upon registration</small>
            </div>
            <div class="form-group mb-3">
              <label class="text-white mb-2">First Deposit Bonus (%)</label>
              <input 
                v-model.number="formData.first_deposit_bonus_percentage" 
                type="number" 
                step="0.01"
                min="0"
                max="100"
                class="form-control n11-bg text-white border-secondary" 
                placeholder="0.00"
              />
              <small class="text-white-50 d-block mt-1">Bonus percentage on first deposit amount</small>
            </div>
            <div class="form-group mb-3">
              <label class="text-white mb-2">Premium Access Days</label>
              <input 
                v-model.number="formData.premium_days" 
                type="number" 
                min="0"
                class="form-control n11-bg text-white border-secondary" 
                placeholder="0"
              />
              <small class="text-white-50 d-block mt-1">Number of days of access to premium features</small>
            </div>
            <div class="form-group mb-3">
              <label class="text-white mb-2">Usage Limit</label>
              <input 
                v-model.number="formData.usage_limit" 
                type="number" 
                min="1"
                class="form-control n11-bg text-white border-secondary" 
                placeholder="1"
              />
              <small class="text-white-50 d-block mt-1">Maximum number of uses (0 = unlimited)</small>
            </div>
            <div class="form-group mb-3">
              <label class="text-white mb-2">Expiration Date (optional)</label>
              <input 
                v-model="formData.expires_at" 
                type="datetime-local" 
                class="form-control n11-bg text-white border-secondary"
              />
            </div>
            <div class="form-group mb-4">
              <div class="form-check">
                <input 
                  v-model="formData.is_active" 
                  class="form-check-input" 
                  type="checkbox" 
                  id="isActive"
                />
                <label class="form-check-label text-white" for="isActive">
                  Active Code
                </label>
              </div>
            </div>
          </template>

          <div v-if="error" class="alert alert-danger mb-4">{{ error }}</div>

          <div class="d-flex gap-2 justify-content-end">
            <button type="button" class="btn_secondary" @click="closeModal">
              Cancel
            </button>
            <button type="submit" class="btn_primary" :disabled="saving">
              <span v-if="!saving">{{ editingCode ? 'Update' : 'Create' }}</span>
              <span v-else>
                <i class="fas fa-spinner fa-spin me-2"></i>Saving...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import apiClient from '@/utils/axios';
import {
  IconPlus,
  IconPencil,
  IconTrash,
} from '@tabler/icons-vue';

interface PromoCode {
  id: number | string;
  code: string;
  type?: 'user_personal' | 'welcome';
  description?: string;
  welcome_bonus?: number;
  first_deposit_bonus_percentage?: number;
  premium_days?: number;
  is_welcome_code?: boolean;
  is_active?: boolean;
  usage_limit?: number | null;
  used_count?: number;
  expires_at?: string;
  user_id?: number;
  username?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

const promoCodes = ref<PromoCode[]>([]);
const loading = ref(false);
const saving = ref(false);
const error = ref('');
const searchQuery = ref('');
const filterType = ref('');
const filterActive = ref('');
const showCreateModal = ref(false);
const editingCode = ref<PromoCode | null>(null);

const formData = ref({
  code: '',
  description: '',
  welcome_bonus: 0,
  first_deposit_bonus_percentage: 0,
  premium_days: 0,
  is_welcome_code: false,
  is_active: true,
  usage_limit: 1,
  expires_at: '',
});

const filteredCodes = computed(() => {
  let filtered = promoCodes.value;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(c => 
      c.code.toLowerCase().includes(query) ||
      (c.description && c.description.toLowerCase().includes(query)) ||
      (c.username && c.username.toLowerCase().includes(query)) ||
      (c.email && c.email.toLowerCase().includes(query))
    );
  }
  
  if (filterType.value !== '') {
    if (filterType.value === 'welcome') {
      filtered = filtered.filter(c => c.type !== 'user_personal' && c.is_welcome_code);
    } else if (filterType.value === 'personal') {
      filtered = filtered.filter(c => c.type === 'user_personal');
    }
  }
  
  if (filterActive.value !== '') {
    const isActive = filterActive.value === 'true';
    filtered = filtered.filter(c => {
      if (c.type === 'user_personal') {
        return isActive; // Les codes personnels sont toujours actifs
      }
      return c.is_active === isActive;
    });
  }
  
  return filtered;
});

const loadPromoCodes = async () => {
  try {
    loading.value = true;
    const response = await apiClient.get('/admin/promo-codes');
    if (response.data.success) {
      promoCodes.value = response.data.data || [];
    }
  } catch (err: any) {
    console.error('Error loading promo codes:', err);
    error.value = 'Erreur lors du chargement des codes promo';
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  formData.value = {
    code: '',
    description: '',
    welcome_bonus: 0,
    first_deposit_bonus_percentage: 0,
    premium_days: 0,
    is_welcome_code: false,
    is_active: true,
    usage_limit: 1,
    expires_at: '',
  };
  editingCode.value = null;
  error.value = '';
};

const closeModal = () => {
  showCreateModal.value = false;
  resetForm();
};

const editCode = (code: PromoCode) => {
  editingCode.value = code;
  
  // Si c'est un code personnel, on ne peut modifier que le code
  if (code.type === 'user_personal') {
    formData.value = {
      code: code.code,
      description: '',
      welcome_bonus: 0,
      first_deposit_bonus_percentage: 0,
      premium_days: 0,
      is_welcome_code: false,
      is_active: true,
      usage_limit: 1,
      expires_at: '',
    };
  } else {
    formData.value = {
      code: code.code,
      description: code.description || '',
      welcome_bonus: code.welcome_bonus || 0,
      first_deposit_bonus_percentage: code.first_deposit_bonus_percentage || 0,
      premium_days: code.premium_days || 0,
      is_welcome_code: code.is_welcome_code || false,
      is_active: code.is_active !== undefined ? code.is_active : true,
      usage_limit: code.usage_limit || 1,
      expires_at: code.expires_at ? new Date(code.expires_at).toISOString().slice(0, 16) : '',
    };
  }
  showCreateModal.value = true;
};

const saveCode = async () => {
  saving.value = true;
  error.value = '';
  
  try {
    // If it's a personal code, send only the code
    if (editingCode.value && editingCode.value.type === 'user_personal') {
      const data = { code: formData.value.code };
      await apiClient.put(`/admin/promo-codes/${editingCode.value.id}`, data);
    } else {
      const data = { ...formData.value };
      
      // Convert expires_at to datetime format if provided
      if (data.expires_at) {
        data.expires_at = new Date(data.expires_at).toISOString();
      } else {
        data.expires_at = '';
      }
      
      if (editingCode.value) {
        await apiClient.put(`/admin/promo-codes/${editingCode.value.id}`, data);
      } else {
        await apiClient.post('/admin/promo-codes', data);
      }
    }
    
    await loadPromoCodes();
    closeModal();
  } catch (err: any) {
    error.value = err.response?.data?.message || err.response?.data?.errors?.code?.[0] || 'Error saving promo code';
  } finally {
    saving.value = false;
  }
};

const deleteCode = async (id: number) => {
  if (!confirm('Are you sure you want to delete this promo code?')) return;
  
  try {
    await apiClient.delete(`/admin/promo-codes/${id}`);
    await loadPromoCodes();
  } catch (err: any) {
    alert(err.response?.data?.message || 'Error deleting promo code');
  }
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  loadPromoCodes();
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #1a1f3a;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.method_card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.method_card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 159, 0, 0.4);
}
</style>

