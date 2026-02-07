<template>
  <div class="pay_method__paymethod p-3 p-md-4 p-lg-6 p2-bg rounded-8">
    <div class="pay_method__paymethod-title mb-5 mb-md-6 d-flex justify-content-between align-items-center">
      <div>
        <h2 class="text-white fw-bold mb-2">Categories</h2>
        <p class="text-white-50">Manage game categories</p>
      </div>
        <button class="btn_primary" @click="showCreateModal = true; resetForm()">
        <IconPlus :size="18" class="me-2" />New Category
      </button>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else class="row g-4">
      <div v-for="category in categories" :key="category.id" class="col-md-6 col-lg-4">
        <div class="defi_card n11-bg rounded-8 p-4">
          <div class="d-flex align-items-center gap-3 mb-3">
            <div class="category_icon rounded-circle overflow-hidden d-flex align-items-center justify-content-center" 
                 style="width: 60px; height: 60px; border: 2px solid rgba(255, 255, 255, 0.3); background: rgba(255, 255, 255, 0.1);">
              <img 
                v-if="category.icon_url" 
                :src="category.icon_url" 
                :alt="category.name"
                class="w-100 h-100"
                style="object-fit: cover;"
              />
              <IconCategory :size="24" v-else class="text-white" />
            </div>
            <div class="flex-grow-1">
              <h5 class="fw-bold text-white mb-1">{{ category.name }}</h5>
              <p class="text-white-50 small mb-0">{{ category.games?.length || 0 }} games</p>
            </div>
          </div>
          <div v-if="category.description" class="mb-3">
            <p class="text-white-50 small mb-0">{{ category.description }}</p>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-warning flex-fill d-flex align-items-center justify-content-center gap-1" @click="editCategory(category)">
              <IconEdit :size="16" />Edit
            </button>
            <button class="btn btn-sm btn-danger d-flex align-items-center justify-content-center" @click="deleteCategory(category.id)" title="Delete">
              <IconTrash :size="16" />
            </button>
          </div>
        </div>
      </div>
      <div v-if="categories.length === 0" class="col-12 text-center py-5">
        <p class="text-white-50">No categories available</p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || editingCategory" class="popup-overlay" @click.self="closeModal">
      <div class="popup-box p-5 rounded-4 shadow-lg n11-bg" style="max-width: 600px; max-height: 90vh; overflow-y: auto;">
        <h3 class="fw-bold mb-4 text-center text-white">
          {{ editingCategory ? 'Edit Category' : 'New Category' }}
        </h3>
        <form @submit.prevent="saveCategory">
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Name *</label>
            <input v-model="form.name" type="text" class="form-control n11-bg text-white border-secondary" required placeholder="Ex: PUBG Mobile" />
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Description</label>
            <textarea v-model="form.description" rows="3" class="form-control n11-bg text-white border-secondary" placeholder="Category description (optional)"></textarea>
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Position</label>
            <input v-model.number="form.position" type="number" class="form-control n11-bg text-white border-secondary" min="0" placeholder="0" />
            <small class="text-white-50">Display order (smaller = displayed first)</small>
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Icon</label>
            <input type="file" @change="handleIconChange" accept="image/*" class="form-control n11-bg text-white border-secondary" />
            <small class="text-white-50">Category icon image (optional)</small>
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">
              <input type="checkbox" v-model="form.is_active" class="me-2" />
              Active Category
            </label>
            <small class="text-white-50">If disabled, the category will not be visible to users</small>
          </div>
          <div v-if="error" class="alert alert-danger mb-4">{{ error }}</div>
          <div class="d-flex gap-3">
            <button type="submit" class="btn_primary flex-fill" :disabled="saving">
              <span v-if="saving">Saving...</span>
              <span v-else>{{ editingCategory ? 'Update' : 'Create' }}</span>
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
import { IconPlus, IconEdit, IconTrash, IconCategory } from '@tabler/icons-vue';

interface GameCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon_url?: string;
  position: number;
  is_active: boolean;
  games?: any[];
}

const categories = ref<GameCategory[]>([]);
const loading = ref(false);
const showCreateModal = ref(false);
const editingCategory = ref<GameCategory | null>(null);
const saving = ref(false);
const error = ref('');
const iconFile = ref<File | null>(null);

const form = ref({
  name: '',
  description: '',
  position: 0,
  is_active: true,
});

const loadCategories = async () => {
  try {
    loading.value = true;
    // Use admin route to get all categories (active and inactive)
    const response = await apiClient.get('/admin/game-categories');
    if (response.data.success) {
      categories.value = response.data.data;
    }
  } catch (err: any) {
    console.error('Error loading categories:', err);
    error.value = 'Error loading categories';
  } finally {
    loading.value = false;
  }
};

const saveCategory = async () => {
  try {
    saving.value = true;
    error.value = '';
    
    const formData = new FormData();
    Object.keys(form.value).forEach(key => {
      const value = form.value[key as keyof typeof form.value];
      if (value !== null && value !== '' && value !== undefined) {
        if (key === 'is_active') {
          formData.append(key, value ? '1' : '0');
        } else {
          formData.append(key, String(value));
        }
      }
    });
    if (iconFile.value) {
      formData.append('icon', iconFile.value);
    }
    
    if (editingCategory.value) {
      await apiClient.put(`/admin/game-categories/${editingCategory.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } else {
      await apiClient.post('/admin/game-categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    
    closeModal();
    await loadCategories();
  } catch (err: any) {
    console.error('Error saving category:', err);
    error.value = err.response?.data?.message || err.response?.data?.errors 
      ? Object.values(err.response.data.errors).flat().join(', ') 
      : 'Error saving category';
  } finally {
    saving.value = false;
  }
};

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    position: 0,
    is_active: true,
  };
  iconFile.value = null;
  error.value = '';
  editingCategory.value = null;
};

const editCategory = (category: GameCategory) => {
  editingCategory.value = category;
  form.value = {
    name: category.name,
    description: category.description || '',
    position: category.position,
    is_active: category.is_active,
  };
  iconFile.value = null;
  error.value = '';
  showCreateModal.value = true;
};

const deleteCategory = async (id: number) => {
  if (!confirm('Are you sure you want to delete this category? This action is irreversible.')) return;
  try {
    await apiClient.delete(`/admin/game-categories/${id}`);
    await loadCategories();
  } catch (err: any) {
    console.error('Error deleting category:', err);
    alert(err.response?.data?.message || 'Error deleting category');
  }
};

const handleIconChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    iconFile.value = target.files[0];
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  resetForm();
};

onMounted(() => {
  loadCategories();
});
</script>

<style scoped>
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



