<template>
  <div class="pay_method__paymethod p-3 p-md-4 p-lg-6 p2-bg rounded-8">
    <div class="pay_method__paymethod-title mb-5 mb-md-6 d-flex justify-content-between align-items-center">
      <div>
        <h2 class="text-white fw-bold mb-2">Games Management</h2>
        <p class="text-white-50">Manage platform games</p>
      </div>
      <button class="btn_primary" @click="showCreateModal = true">
        <IconPlus :size="18" class="me-2" />New Game
      </button>
    </div>

    <!-- Filters -->
    <div class="d-flex gap-3 mb-4 flex-wrap">
      <select v-model="selectedCategory" @change="loadGames" class="form-select n11-bg text-white border-secondary" style="max-width: 300px;">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else class="row g-4">
      <div v-for="game in filteredGames" :key="game.id" class="col-md-6 col-lg-4">
        <div class="defi_card n11-bg rounded-8 p-4">
          <div class="d-flex align-items-center gap-3 mb-3">
            <div class="game_icon rounded-circle overflow-hidden d-flex align-items-center justify-content-center" 
                 style="width: 60px; height: 60px; border: 2px solid rgba(255, 255, 255, 0.3); background: rgba(255, 255, 255, 0.1);">
              <i :class="getGameIcon(game.name)" class="text-white fs-4"></i>
            </div>
            <div class="flex-grow-1">
              <h5 class="fw-bold text-white mb-1">{{ game.name }}</h5>
              <p class="text-white-50 small mb-0">{{ game.category?.name || 'N/A' }}</p>
            </div>
          </div>
          <div v-if="game.description" class="mb-3">
            <p class="text-white-50 small mb-0">{{ game.description }}</p>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-warning flex-fill d-flex align-items-center justify-content-center gap-1" @click="editGame(game)">
              <IconEdit :size="16" />Edit
            </button>
            <button class="btn btn-sm btn-danger d-flex align-items-center justify-content-center" @click="deleteGame(game.id)">
              <IconTrash :size="16" />
            </button>
          </div>
        </div>
      </div>
      <div v-if="filteredGames.length === 0" class="col-12 text-center py-5">
        <p class="text-white-50">No games</p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || editingGame" class="popup-overlay" @click.self="closeModal">
      <div class="popup-box p-5 rounded-4 shadow-lg n11-bg" style="max-width: 600px; max-height: 90vh; overflow-y: auto;">
        <h3 class="fw-bold mb-4 text-center text-white">
          {{ editingGame ? 'Edit Game' : 'New Game' }}
        </h3>
        <form @submit.prevent="saveGame">
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Category *</label>
            <select v-model="form.game_category_id" class="form-select n11-bg text-white border-secondary" required>
              <option value="">Select a category</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Name *</label>
            <input v-model="form.name" type="text" class="form-control n11-bg text-white border-secondary" required />
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Description</label>
            <textarea v-model="form.description" rows="3" class="form-control n11-bg text-white border-secondary"></textarea>
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Position</label>
            <input v-model.number="form.position" type="number" class="form-control n11-bg text-white border-secondary" min="0" />
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Icon</label>
            <input type="file" @change="handleIconChange" accept="image/*" class="form-control n11-bg text-white border-secondary" />
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">Image</label>
            <input type="file" @change="handleImageChange" accept="image/*" class="form-control n11-bg text-white border-secondary" />
          </div>
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block">
              <input type="checkbox" v-model="form.is_active" class="me-2" />
              Active
            </label>
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
import { ref, computed, onMounted } from 'vue';
import apiClient from '@/utils/axios';
import { IconPlus, IconEdit, IconTrash, IconDeviceGamepad2 } from '@tabler/icons-vue';

interface Game {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon_url?: string;
  image_url?: string;
  position: number;
  is_active: boolean;
  game_category_id: number;
  category?: { name: string };
}

interface GameCategory {
  id: number;
  name: string;
}

const games = ref<Game[]>([]);
const categories = ref<GameCategory[]>([]);
const loading = ref(false);
const selectedCategory = ref<number | ''>('');
const showCreateModal = ref(false);
const editingGame = ref<Game | null>(null);
const saving = ref(false);
const error = ref('');
const iconFile = ref<File | null>(null);
const imageFile = ref<File | null>(null);

const form = ref<{
  game_category_id: string | number;
  name: string;
  description: string;
  position: number;
  is_active: boolean;
}>({
  game_category_id: '',
  name: '',
  description: '',
  position: 0,
  is_active: true,
});

const filteredGames = computed(() => {
  if (!selectedCategory.value) return games.value;
  return games.value.filter(g => g.game_category_id === Number(selectedCategory.value));
});

const loadCategories = async () => {
  try {
    const response = await apiClient.get('/game-categories');
    if (response.data.success) {
      categories.value = response.data.data;
    }
  } catch (err: any) {
    console.error('Error loading categories:', err);
  }
};

const loadGames = async () => {
  try {
    loading.value = true;
    const params: any = {};
    if (selectedCategory.value) {
      params.category_id = selectedCategory.value;
    }
    const response = await apiClient.get('/games', { params });
    if (response.data.success) {
      games.value = response.data.data;
    }
  } catch (err: any) {
    console.error('Error loading games:', err);
  } finally {
    loading.value = false;
  }
};

const saveGame = async () => {
  try {
    saving.value = true;
    error.value = '';
    
    const formData = new FormData();
    Object.keys(form.value).forEach(key => {
      const value = form.value[key as keyof typeof form.value];
      if (value !== null && value !== '' && value !== undefined) {
        // Handle is_active as boolean (0 or 1)
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
    if (imageFile.value) {
      formData.append('image', imageFile.value);
    }
    
    if (editingGame.value) {
      await apiClient.put(`/admin/games/${editingGame.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } else {
      await apiClient.post('/admin/games', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    
    closeModal();
    await loadGames();
  } catch (err: any) {
    console.error('Error saving game:', err);
    error.value = err.response?.data?.message || err.response?.data?.errors 
      ? Object.values(err.response.data.errors).flat().join(', ') 
      : 'Error saving game';
  } finally {
    saving.value = false;
  }
};

const editGame = (game: Game) => {
  editingGame.value = game;
  form.value = {
    game_category_id: String(game.game_category_id),
    name: game.name,
    description: game.description || '',
    position: game.position,
    is_active: game.is_active,
  };
};

const deleteGame = async (id: number) => {
  if (!confirm('Are you sure you want to delete this game? This action is irreversible.')) return;
  try {
    await apiClient.delete(`/admin/games/${id}`);
    await loadGames();
  } catch (err: any) {
    console.error('Error deleting game:', err);
    alert(err.response?.data?.message || 'Error deleting game');
  }
};

const handleIconChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    iconFile.value = target.files[0];
  }
};

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    imageFile.value = target.files[0];
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  editingGame.value = null;
  form.value = { game_category_id: '', name: '', description: '', position: 0, is_active: true };
  iconFile.value = null;
  imageFile.value = null;
  error.value = '';
};

const getGameIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('pubg')) return 'ti ti-device-gamepad-2';
  if (lower.includes('free fire') || lower.includes('garena')) return 'ti ti-flame';
  if (lower.includes('mobile legends') || lower.includes('mlbb')) return 'ti ti-swords';
  if (lower.includes('football') || lower.includes('soccer')) return 'ti ti-ball-football';
  if (lower.includes('basketball')) return 'ti ti-ball-basketball';
  if (lower.includes('baseball')) return 'ti ti-ball-baseball';
  if (lower.includes('tennis')) return 'ti ti-ball-tennis';
  if (lower.includes('volleyball')) return 'ti ti-ball-volleyball';
  if (lower.includes('hockey')) return 'ti ti-ball-ice';
  if (lower.includes('cricket')) return 'ti ti-cricket';
  if (lower.includes('rugby')) return 'ti ti-ball-rugby';
  if (lower.includes('boxing') || lower.includes('mma') || lower.includes('fighting')) return 'ti ti-box';
  if (lower.includes('cycling')) return 'ti ti-bike';
  if (lower.includes('darts')) return 'ti ti-target';
  if (lower.includes('handball')) return 'ti ti-ball-handball';
  if (lower.includes('kabaddi')) return 'ti ti-users';
  if (lower.includes('squash')) return 'ti ti-ball-tennis';
  if (lower.includes('wrestling')) return 'ti ti-arm-wrestling';
  if (lower.includes('penalty')) return 'ti ti-ball-football';
  if (lower.includes('futsal')) return 'ti ti-ball-football';
  if (lower.includes('floorball')) return 'ti ti-ball-ice';
  if (lower.includes('bandy')) return 'ti ti-ball-ice';
  if (lower.includes('aussie')) return 'ti ti-ball-rugby';
  if (lower.includes('nba')) return 'ti ti-ball-basketball';
  if (lower.includes('nfl')) return 'ti ti-ball-football';
  if (lower.includes('fifa') || lower.includes('volta')) return 'ti ti-ball-football';
  if (lower.includes('rocket league')) return 'ti ti-car';
  if (lower.includes('shooter') || lower.includes('cod')) return 'ti ti-gun';
  if (lower.includes('ecricket')) return 'ti ti-cricket';
  if (lower.includes('efighting')) return 'ti ti-box';
  if (lower.includes('erocket')) return 'ti ti-car';
  if (lower.includes('eshooter')) return 'ti ti-gun';
  return 'ti ti-gamepad';
};

onMounted(() => {
  loadCategories();
  loadGames();
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

