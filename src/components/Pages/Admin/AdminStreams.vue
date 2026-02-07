<template>
  <div class="pay_method__paymethod p-3 p-md-4 p-lg-6 p2-bg rounded-8">
    <div class="pay_method__paymethod-title mb-5 mb-md-6 d-flex justify-content-between align-items-center flex-wrap gap-3">
      <div>
        <h2 class="text-white fw-bold mb-2">Stream Management</h2>
        <p class="text-white-50">Manage all platform streams</p>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="row g-3 mb-4">
      <div class="col-md-3 col-sm-6">
        <div class="stat-card n11-bg rounded-8 p-3">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <p class="text-white-50 small mb-1">Total Streams</p>
              <h3 class="text-white mb-0">{{ stats.total_streams || 0 }}</h3>
            </div>
            <div class="stat-icon bg-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
              <i class="fas fa-video text-white"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-sm-6">
        <div class="stat-card n11-bg rounded-8 p-3">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <p class="text-white-50 small mb-1">Live Now</p>
              <h3 class="text-danger mb-0">{{ stats.live_streams || 0 }}</h3>
            </div>
            <div class="stat-icon bg-danger rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
              <i class="fas fa-circle text-white"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-sm-6">
        <div class="stat-card n11-bg rounded-8 p-3">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <p class="text-white-50 small mb-1">Total Viewers</p>
              <h3 class="text-white mb-0">{{ stats.total_viewers || 0 }}</h3>
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
              <p class="text-white-50 small mb-1">Total Followers</p>
              <h3 class="text-white mb-0">{{ stats.total_followers || 0 }}</h3>
            </div>
            <div class="stat-icon bg-success rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
              <i class="fas fa-heart text-white"></i>
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
        placeholder="Search by title, streamer..."
        style="max-width: 300px;"
      />
      <select v-model="filterStatus" class="form-select n11-bg text-white border-secondary" style="max-width: 200px;">
        <option value="">All Status</option>
        <option value="live">Live</option>
        <option value="offline">Offline</option>
      </select>
      <select v-model="filterCategory" class="form-select n11-bg text-white border-secondary" style="max-width: 200px;">
        <option value="">All Categories</option>
        <option value="Gaming">Gaming</option>
        <option value="Esports">Esports</option>
        <option value="Just Chatting">Just Chatting</option>
        <option value="Music">Music</option>
        <option value="IRL">IRL</option>
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
              <th class="text-white p-3">Title</th>
              <th class="text-white p-3">Streamer</th>
              <th class="text-white p-3">Category</th>
              <th class="text-white p-3">Game</th>
              <th class="text-white p-3">Viewers</th>
              <th class="text-white p-3">Followers</th>
              <th class="text-white p-3">Status</th>
              <th class="text-white p-3">Created</th>
              <th class="text-white p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stream in filteredStreams" :key="stream.id" class="border-top border-secondary">
              <td class="text-white p-3">{{ stream.id }}</td>
              <td class="text-white p-3">{{ stream.title }}</td>
              <td class="text-white p-3">{{ stream.user?.username || 'N/A' }}</td>
              <td class="text-white p-3">{{ stream.category || 'N/A' }}</td>
              <td class="text-white p-3">{{ stream.game || 'N/A' }}</td>
              <td class="text-white p-3">{{ stream.viewer_count || 0 }}</td>
              <td class="text-white p-3">{{ stream.follower_count || 0 }}</td>
              <td class="p-3">
                <span :class="['badge', stream.is_live ? 'bg-danger' : 'bg-secondary']">
                  <i :class="['fas', stream.is_live ? 'fa-circle' : 'fa-circle', 'me-1']" style="font-size: 0.5rem;"></i>
                  {{ stream.is_live ? 'Live' : 'Offline' }}
                </span>
              </td>
              <td class="text-white p-3">{{ formatDate(stream.created_at) }}</td>
              <td class="p-3">
                <div class="d-flex gap-2 justify-content-center">
                  <button 
                    class="btn btn-sm btn-info" 
                    @click="viewStreamDetails(stream)" 
                    title="View Details"
                  >
                    <IconEye :size="16" />
                  </button>
                  <button 
                    v-if="stream.is_live"
                    class="btn btn-sm btn-warning" 
                    @click="forceStopStream(stream.id)" 
                    title="Force Stop"
                  >
                    <i class="fas fa-stop"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-primary" 
                    @click="editStream(stream)" 
                    title="Edit"
                  >
                    <IconPencil :size="16" />
                  </button>
                  <button 
                    class="btn btn-sm btn-danger" 
                    @click="deleteStream(stream.id)" 
                    title="Delete"
                  >
                    <IconTrash :size="16" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredStreams.length === 0">
              <td colspan="10" class="text-white p-5 text-center">No streams found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Stream Details Modal -->
    <Teleport to="body">
      <div v-if="showDetailsModal" class="popup-overlay" @click.self="closeDetailsModal">
        <div class="popup-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="text-white fw-bold mb-0">
              Stream Details - {{ selectedStream?.title }}
            </h3>
            <button class="btn-close btn-close-white" @click="closeDetailsModal"></button>
          </div>

          <div v-if="loadingDetails" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <div v-else-if="streamDetails">
            <!-- Stream Info -->
            <div class="row g-4 mb-4">
              <div class="col-md-6">
                <div class="n11-bg rounded-8 p-4">
                  <h5 class="text-white mb-3">Stream Information</h5>
                  <div class="mb-2">
                    <small class="text-white-50">Streamer:</small>
                    <p class="text-white mb-0">{{ streamDetails.user?.username }}</p>
                  </div>
                  <div class="mb-2">
                    <small class="text-white-50">Category:</small>
                    <p class="text-white mb-0">{{ streamDetails.category || 'N/A' }}</p>
                  </div>
                  <div class="mb-2">
                    <small class="text-white-50">Game:</small>
                    <p class="text-white mb-0">{{ streamDetails.game || 'N/A' }}</p>
                  </div>
                  <div class="mb-2">
                    <small class="text-white-50">Status:</small>
                    <span :class="['badge', streamDetails.is_live ? 'bg-danger' : 'bg-secondary']">
                      {{ streamDetails.is_live ? 'Live' : 'Offline' }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="n11-bg rounded-8 p-4">
                  <h5 class="text-white mb-3">Statistics</h5>
                  <div class="mb-2">
                    <small class="text-white-50">Total Sessions:</small>
                    <p class="text-white mb-0">{{ streamStats.total_sessions || 0 }}</p>
                  </div>
                  <div class="mb-2">
                    <small class="text-white-50">Total Chat Messages:</small>
                    <p class="text-white mb-0">{{ streamStats.total_chat_messages || 0 }}</p>
                  </div>
                  <div class="mb-2">
                    <small class="text-white-50">Total Followers:</small>
                    <p class="text-white mb-0">{{ streamStats.total_followers || 0 }}</p>
                  </div>
                  <div class="mb-2">
                    <small class="text-white-50">Peak Viewers:</small>
                    <p class="text-white mb-0">{{ streamStats.peak_viewers || 0 }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tabs -->
            <ul class="nav nav-tabs mb-3">
              <li class="nav-item">
                <button 
                  class="nav-link" 
                  :class="{ 'active': activeTab === 'sessions' }"
                  @click="activeTab = 'sessions'"
                >
                  Sessions
                </button>
              </li>
              <li class="nav-item">
                <button 
                  class="nav-link" 
                  :class="{ 'active': activeTab === 'chat' }"
                  @click="activeTab = 'chat'"
                >
                  Chat Messages
                </button>
              </li>
            </ul>

            <!-- Sessions Tab -->
            <div v-if="activeTab === 'sessions'" class="n11-bg rounded-8 p-4">
              <div v-if="loadingSessions" class="text-center py-3">
                <div class="spinner-border spinner-border-sm text-primary"></div>
              </div>
              <div v-else>
                <div class="table-responsive">
                  <table class="table table-dark table-sm">
                    <thead>
                      <tr>
                        <th>Session ID</th>
                        <th>Status</th>
                        <th>Started</th>
                        <th>Ended</th>
                        <th>Peak Viewers</th>
                        <th>Total Viewers</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="session in sessions" :key="session.id">
                        <td>{{ session.session_id || session.id }}</td>
                        <td>
                          <span :class="['badge', session.status === 'live' ? 'bg-danger' : 'bg-secondary']">
                            {{ session.status }}
                          </span>
                        </td>
                        <td>{{ formatDateTime(session.started_at) }}</td>
                        <td>{{ session.ended_at ? formatDateTime(session.ended_at) : 'N/A' }}</td>
                        <td>{{ session.peak_viewers || 0 }}</td>
                        <td>{{ session.total_viewers || 0 }}</td>
                      </tr>
                      <tr v-if="sessions.length === 0">
                        <td colspan="6" class="text-center text-white-50 py-3">No sessions found</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Chat Tab -->
            <div v-if="activeTab === 'chat'" class="n11-bg rounded-8 p-4">
              <div v-if="loadingChat" class="text-center py-3">
                <div class="spinner-border spinner-border-sm text-primary"></div>
              </div>
              <div v-else>
                <div class="table-responsive">
                  <table class="table table-dark table-sm">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Message</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="message in chatMessages" :key="message.id">
                        <td>{{ message.user?.username || 'N/A' }}</td>
                        <td>{{ message.message }}</td>
                        <td>{{ formatDateTime(message.created_at) }}</td>
                        <td>
                          <button 
                            class="btn btn-sm btn-danger"
                            @click="deleteChatMessage(message.id)"
                            title="Delete"
                          >
                            <i class="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                      <tr v-if="chatMessages.length === 0">
                        <td colspan="4" class="text-center text-white-50 py-3">No messages found</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Edit Stream Modal -->
    <Teleport to="body">
      <div v-if="showEditModal" class="popup-overlay" @click.self="closeEditModal">
        <div class="popup-box p-5 rounded-4 shadow-lg n11-bg" style="max-width: 600px; max-height: 90vh; overflow-y: auto;">
          <h3 class="fw-bold mb-4 text-center text-white">Edit Stream</h3>
          
          <form @submit.prevent="saveStream">
            <div class="form-group mb-3">
              <label class="text-white mb-2">Title *</label>
              <input 
                v-model="editForm.title"
                type="text" 
                class="form-control n11-bg text-white border-secondary" 
                required
              />
            </div>

            <div class="form-group mb-3">
              <label class="text-white mb-2">Description</label>
              <textarea 
                v-model="editForm.description"
                class="form-control n11-bg text-white border-secondary" 
                rows="3"
              ></textarea>
            </div>

            <div class="form-group mb-3">
              <label class="text-white mb-2">Category</label>
              <input 
                v-model="editForm.category"
                type="text" 
                class="form-control n11-bg text-white border-secondary"
              />
            </div>

            <div class="form-group mb-3">
              <label class="text-white mb-2">Game</label>
              <input 
                v-model="editForm.game"
                type="text" 
                class="form-control n11-bg text-white border-secondary"
              />
            </div>

            <div class="form-group mb-3">
              <label class="text-white mb-2">Thumbnail URL</label>
              <input 
                v-model="editForm.thumbnail"
                type="url" 
                class="form-control n11-bg text-white border-secondary"
              />
            </div>

            <div class="form-group mb-4">
              <div class="form-check">
                <input 
                  v-model="editForm.is_live" 
                  class="form-check-input" 
                  type="checkbox" 
                  id="isLive"
                />
                <label class="form-check-label text-white" for="isLive">
                  Stream is Live
                </label>
              </div>
            </div>

            <div v-if="error" class="alert alert-danger mb-4">{{ error }}</div>
            
            <div class="d-flex gap-2 justify-content-end">
              <button type="button" class="btn_secondary" @click="closeEditModal">Cancel</button>
              <button type="submit" class="btn_primary" :disabled="saving">
                <span v-if="saving">Saving...</span>
                <span v-else>Update Stream</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import apiClient from '@/utils/axios';
import { IconEye, IconPencil, IconTrash } from '@tabler/icons-vue';

interface Stream {
  id: number;
  title: string;
  description?: string;
  category?: string;
  game?: string;
  thumbnail?: string;
  is_live: boolean;
  viewer_count?: number;
  follower_count?: number;
  created_at: string;
  user?: { username: string };
}

interface StreamDetails extends Stream {
  user?: {
    id: number;
    username: string;
  };
  sessions?: any[];
  chatMessages?: any[];
}

interface StreamSession {
  id: number;
  session_id?: string;
  status: string;
  started_at: string;
  ended_at?: string;
  peak_viewers?: number;
  total_viewers?: number;
}

interface ChatMessage {
  id: number;
  message: string;
  user?: { username: string };
  created_at: string;
}

const streams = ref<Stream[]>([]);
const loading = ref(false);
const searchQuery = ref('');
const filterStatus = ref('');
const filterCategory = ref('');
const stats = ref({
  total_streams: 0,
  live_streams: 0,
  total_viewers: 0,
  total_followers: 0,
});

const showDetailsModal = ref(false);
const selectedStream = ref<Stream | null>(null);
const streamDetails = ref<StreamDetails | null>(null);
const streamStats = ref<any>({});
const loadingDetails = ref(false);
const activeTab = ref('sessions');
const sessions = ref<StreamSession[]>([]);
const chatMessages = ref<ChatMessage[]>([]);
const loadingSessions = ref(false);
const loadingChat = ref(false);

const showEditModal = ref(false);
const editingStream = ref<Stream | null>(null);
const saving = ref(false);
const error = ref('');
const editForm = ref({
  title: '',
  description: '',
  category: '',
  game: '',
  thumbnail: '',
  is_live: false,
});

const filteredStreams = computed(() => {
  let filtered = streams.value;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(s => 
      s.title.toLowerCase().includes(query) ||
      (s.user?.username && s.user.username.toLowerCase().includes(query)) ||
      (s.description && s.description.toLowerCase().includes(query))
    );
  }
  
  if (filterStatus.value) {
    if (filterStatus.value === 'live') {
      filtered = filtered.filter(s => s.is_live);
    } else if (filterStatus.value === 'offline') {
      filtered = filtered.filter(s => !s.is_live);
    }
  }
  
  if (filterCategory.value) {
    filtered = filtered.filter(s => s.category === filterCategory.value);
  }
  
  return filtered;
});

const loadStreams = async () => {
  try {
    loading.value = true;
    const response = await apiClient.get('/admin/streams', {
      params: { per_page: 100 }
    });
    if (response.data.success) {
      streams.value = response.data.data?.data || response.data.data || [];
      if (response.data.stats) {
        stats.value = response.data.stats;
      }
    }
  } catch (err: any) {
    console.error('Error loading streams:', err);
  } finally {
    loading.value = false;
  }
};

const viewStreamDetails = async (stream: Stream) => {
  selectedStream.value = stream;
  showDetailsModal.value = true;
  loadingDetails.value = true;
  activeTab.value = 'sessions';
  streamDetails.value = null;
  streamStats.value = {};
  sessions.value = [];
  chatMessages.value = [];

  try {
    const response = await apiClient.get(`/admin/streams/${stream.id}`);
    if (response.data.success) {
      streamDetails.value = response.data.data;
      streamStats.value = response.data.stats || {};
      await loadSessions();
    }
  } catch (err: any) {
    console.error('Error loading stream details:', err);
    alert('Error loading stream details: ' + (err.response?.data?.message || err.message));
  } finally {
    loadingDetails.value = false;
  }
};

const loadSessions = async () => {
  if (!selectedStream.value) return;
  
  loadingSessions.value = true;
  try {
    const response = await apiClient.get(`/admin/streams/${selectedStream.value.id}/sessions`);
    if (response.data.success) {
      sessions.value = response.data.data || [];
    }
  } catch (err: any) {
    console.error('Error loading sessions:', err);
  } finally {
    loadingSessions.value = false;
  }
};

const loadChatMessages = async () => {
  if (!selectedStream.value) return;
  
  loadingChat.value = true;
  try {
    const response = await apiClient.get(`/admin/streams/${selectedStream.value.id}/chat`);
    if (response.data.success) {
      chatMessages.value = response.data.data || [];
    }
  } catch (err: any) {
    console.error('Error loading chat messages:', err);
  } finally {
    loadingChat.value = false;
  }
};

watch(activeTab, (newTab) => {
  if (newTab === 'chat' && chatMessages.value.length === 0) {
    loadChatMessages();
  }
});

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedStream.value = null;
  streamDetails.value = null;
  activeTab.value = 'sessions';
};

const editStream = (stream: Stream) => {
  editingStream.value = stream;
  editForm.value = {
    title: stream.title,
    description: stream.description || '',
    category: stream.category || '',
    game: stream.game || '',
    thumbnail: stream.thumbnail || '',
    is_live: stream.is_live,
  };
  showEditModal.value = true;
  error.value = '';
};

const closeEditModal = () => {
  showEditModal.value = false;
  editingStream.value = null;
  error.value = '';
};

const saveStream = async () => {
  if (!editingStream.value) return;
  
  saving.value = true;
  error.value = '';
  
  try {
    const response = await apiClient.put(`/admin/streams/${editingStream.value.id}`, editForm.value);
    if (response.data.success) {
      await loadStreams();
      closeEditModal();
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error updating stream';
  } finally {
    saving.value = false;
  }
};

const deleteStream = async (id: number) => {
  if (!confirm('Are you sure you want to delete this stream? This will also delete all sessions, chat messages, and followers.')) {
    return;
  }
  
  try {
    const response = await apiClient.delete(`/admin/streams/${id}`);
    if (response.data.success) {
      await loadStreams();
    }
  } catch (err: any) {
    alert(err.response?.data?.message || 'Error deleting stream');
  }
};

const forceStopStream = async (id: number) => {
  if (!confirm('Are you sure you want to force stop this stream?')) {
    return;
  }
  
  try {
    const response = await apiClient.post(`/admin/streams/${id}/force-stop`);
    if (response.data.success) {
      await loadStreams();
      alert('Stream stopped successfully');
    }
  } catch (err: any) {
    alert(err.response?.data?.message || 'Error stopping stream');
  }
};

const deleteChatMessage = async (messageId: number) => {
  if (!selectedStream.value) return;
  
  if (!confirm('Are you sure you want to delete this chat message?')) {
    return;
  }
  
  try {
    const response = await apiClient.delete(`/admin/streams/${selectedStream.value.id}/chat/${messageId}`);
    if (response.data.success) {
      await loadChatMessages();
    }
  } catch (err: any) {
    alert(err.response?.data?.message || 'Error deleting message');
  }
};

const formatDate = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatDateTime = (date: string) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

watch([searchQuery, filterStatus, filterCategory], () => {
  // Les filtres sont appliqués via computed, pas besoin de recharger
});

onMounted(() => {
  loadStreams();
});
</script>

<style scoped>
.stat-card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.stat-icon {
  opacity: 0.8;
}

.nav-tabs {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-tabs .nav-link {
  color: rgba(255, 255, 255, 0.7);
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
}

.nav-tabs .nav-link:hover {
  color: white;
  border-bottom-color: rgba(255, 255, 255, 0.3);
}

.nav-tabs .nav-link.active {
  color: white;
  border-bottom-color: #FF9F00;
  background: transparent;
}

.popup-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background: rgba(0, 0, 0, 0.7) !important;
  backdrop-filter: blur(5px);
  display: flex !important;
  align-items: center;
  justify-content: center;
  z-index: 99999 !important;
  padding: 1rem;
  overflow-y: auto;
}

.popup-content {
  background: #1a1f3a;
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.popup-box {
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  z-index: 100000;
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
