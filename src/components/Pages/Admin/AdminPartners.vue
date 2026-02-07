<template>
  <div class="pay_method__paymethod p-3 p-md-4 p-lg-6 p2-bg rounded-8">
    <div class="pay_method__paymethod-title mb-5 mb-md-6 d-flex justify-content-between align-items-center">
      <div>
        <h2 class="text-white fw-bold mb-2">Partner Management</h2>
        <p class="text-white-50">Manage partner developers</p>
      </div>
      <button class="btn_primary" @click="showCreateModal = true">
        <IconPlus :size="18" class="me-2" />New Partner
      </button>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else class="row g-4">
      <div v-for="partner in partners" :key="partner.id" class="col-md-6 col-lg-4">
        <div class="defi_card n11-bg rounded-8 p-4">
          <div class="d-flex align-items-center gap-3 mb-3">
            <div class="partner_avatar rounded-circle overflow-hidden" 
                 style="width: 60px; height: 60px; border: 2px solid rgba(255, 255, 255, 0.3);">
              <img 
                v-if="partner.avatar_url" 
                :src="partner.avatar_url" 
                :alt="partner.name"
                class="w-100 h-100"
                style="object-fit: cover;"
              />
              <div v-else class="w-100 h-100 d-flex align-items-center justify-content-center" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <IconBuilding :size="24" class="text-white" />
              </div>
            </div>
            <div class="flex-grow-1">
              <h5 class="fw-bold text-white mb-1">{{ partner.name }}</h5>
              <p class="text-white-50 small mb-0">{{ partner.specialty || 'Developer' }}</p>
            </div>
          </div>
          <div class="mb-3">
            <span v-if="partner.country" class="text-white-50 small d-flex align-items-center">
              <IconMapPin :size="14" class="me-1" />{{ partner.country }}
            </span>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-warning flex-fill d-flex align-items-center justify-content-center gap-1" @click="editPartner(partner)">
              <IconEdit :size="16" />Edit
            </button>
            <button class="btn btn-sm btn-danger d-flex align-items-center justify-content-center" @click="deletePartner(partner.id)">
              <IconTrash :size="16" />
            </button>
          </div>
        </div>
      </div>
      <div v-if="partners.length === 0" class="col-12 text-center py-5">
        <p class="text-white-50">No partners</p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || editingPartner" class="popup-overlay" @click.self="closeModal">
      <div class="popup-box p-5 rounded-4 shadow-lg n11-bg" style="max-width: 600px; max-height: 90vh; overflow-y: auto;">
        <h3 class="fw-bold mb-4 text-center text-white">
          {{ editingPartner ? 'Edit Partner' : 'New Partner' }}
        </h3>
        <form @submit.prevent="savePartner">
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Name</label>
            <input v-model="form.name" type="text" class="form-control n11-bg text-white border-secondary" required />
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Specialty</label>
            <input v-model="form.specialty" type="text" class="form-control n11-bg text-white border-secondary" />
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Website</label>
            <input v-model="form.website" type="url" class="form-control n11-bg text-white border-secondary" />
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Country</label>
            <input v-model="form.country" type="text" class="form-control n11-bg text-white border-secondary" />
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Bio</label>
            <textarea v-model="form.bio" rows="3" class="form-control n11-bg text-white border-secondary"></textarea>
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Logo/Photo</label>
            <input type="file" @change="handleFileChange" accept="image/*" class="form-control n11-bg text-white border-secondary" />
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
import { ref, onMounted } from 'vue';
import apiClient from '@/utils/axios';
import { IconPlus, IconEdit, IconTrash, IconBuilding, IconMapPin } from '@tabler/icons-vue';
import { fixImageUrl } from '@/utils/imageFixer';

interface Partner {
  id: number;
  name: string;
  specialty?: string;
  website?: string;
  country?: string;
  bio?: string;
  avatar_url?: string;
}

const partners = ref<Partner[]>([]);
const loading = ref(false);
const showCreateModal = ref(false);
const editingPartner = ref<Partner | null>(null);
const saving = ref(false);
const error = ref('');
const avatarFile = ref<File | null>(null);

const form = ref({
  name: '',
  specialty: '',
  website: '',
  country: '',
  bio: '',
});

const loadPartners = async () => {
  try {
    loading.value = true;
    const response = await apiClient.get('/partners', {
      params: { limit: 100 }
    });
    if (response.data.success) {
      // Corriger les URLs des avatars
      partners.value = response.data.data.map((partner: Partner) => ({
        ...partner,
        avatar_url: partner.avatar_url ? fixImageUrl(partner.avatar_url) : undefined
      }));
    }
  } catch (err: any) {
    console.error('Error loading partners:', err);
  } finally {
    loading.value = false;
  }
};

const savePartner = async () => {
  try {
    saving.value = true;
    error.value = '';
    
    const formData = new FormData();
    Object.keys(form.value).forEach(key => {
      if (form.value[key as keyof typeof form.value]) {
        formData.append(key, form.value[key as keyof typeof form.value] as string);
      }
    });
    if (avatarFile.value) {
      formData.append('avatar', avatarFile.value);
    }
    
    let response;
    if (editingPartner.value) {
      response = await apiClient.put(`/admin/partners/${editingPartner.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } else {
      response = await apiClient.post('/admin/partners', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    
    if (response.data.success) {
      closeModal();
      await loadPartners();
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error saving partner';
  } finally {
    saving.value = false;
  }
};

const editPartner = (partner: Partner) => {
  editingPartner.value = partner;
  form.value = {
    name: partner.name,
    specialty: partner.specialty || '',
    website: partner.website || '',
    country: partner.country || '',
    bio: partner.bio || '',
  };
};

const deletePartner = async (id: number) => {
  if (!confirm('Are you sure you want to delete this partner?')) return;
  try {
    await apiClient.delete(`/admin/partners/${id}`);
    await loadPartners();
  } catch (err: any) {
    alert(err.response?.data?.message || 'Error deleting partner');
  }
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    avatarFile.value = target.files[0];
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  editingPartner.value = null;
  form.value = { name: '', specialty: '', website: '', country: '', bio: '' };
  avatarFile.value = null;
  error.value = '';
};

onMounted(() => {
  loadPartners();
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

.pay_method__paymethod {
  width: 100%;
  max-width: 100%;
  margin: 0;
}

.pay_method__paymethod .row {
  margin-left: 0;
  margin-right: 0;
}

.pay_method__paymethod .row > * {
  padding-left: calc(var(--bs-gutter-x) * 0.5);
  padding-right: calc(var(--bs-gutter-x) * 0.5);
}

.defi_card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  transition: transform 0.3s ease;
}

.defi_card:hover {
  transform: translateY(-5px);
}
</style>

