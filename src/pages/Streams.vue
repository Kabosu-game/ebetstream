<template>
  <div class="page-content-with-space">
    <!-- Section Streaming -->
    <section class="defis_section py-6 position-relative overflow-hidden pb-120">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 gx-0 gx-lg-4">
            <div class="defis__main">
              <!-- Header Section -->
              <div class="row h-100 align-items-center mb-5">
                <div class="col-lg-6 col-md-7">
                  <div class="defis_content" data-aos="fade-right">
                    <span class="hero_badge mb-3 d-inline-block">
                      📺 Live Streaming
                    </span>
                    <h2 class="hero_title mb-4">
                      Watch <span class="text_gradient">Streams</span><br />
                      from your favorite players!
                    </h2>
                    <p class="hero_subtitle mb-5">
                      Regardez les lives des challenges en direct et découvrez les streamers eBetStream.
                    </p>
                    <div class="hero_actions d-flex flex-wrap gap-3">
                      <button v-if="isAuthenticated" class="btn_secondary" @click="goToCreateStream">
                        <i class="fas fa-video me-2"></i>
                        <span>Create a stream</span>
                      </button>
                      <button v-else class="btn_secondary" @click="$router.push('/login')">
                        <i class="fas fa-sign-in-alt me-2"></i>
                        <span>Login to stream</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Colonne image / carte -->
                <div class="col-lg-6 col-md-5 d-none d-md-block">
                  <div class="defis_image" data-aos="fade-left">
                    <div class="floating_card card_defis">
                      <div class="card_icon">📹</div>
                      <div class="card_content">
                        <span class="card_label">Streaming</span>
                        <span class="card_value">Live</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Live Challenge Streams -->
              <div v-if="liveChallenges.length > 0" class="mb-5">
                <h4 class="fw-bold mb-4 text-white">
                  <i class="fas fa-circle text-danger me-2" style="font-size: 0.6rem; animation: pulse 2s infinite;"></i>
                  Challenges en direct
                </h4>
                <div class="row g-4">
                  <div v-for="challenge in liveChallenges" :key="challenge.id" class="col-12 col-md-6 col-lg-4">
                    <div 
                      class="stream_card defi_card n11-bg rounded-8 p-0 h-100 d-flex flex-column overflow-hidden position-relative" 
                      @click="viewChallengeLive(challenge.id)"
                    >
                      <div class="position-absolute top-0 start-0 m-2 z-1">
                        <span class="badge bg-danger px-2 py-1">
                          <i class="fas fa-circle me-1" style="font-size: 0.5rem; animation: pulse 2s infinite;"></i>
                          LIVE
                        </span>
                      </div>
                      <div v-if="challenge.is_live_paused" class="position-absolute top-0 end-0 m-2 z-1">
                        <span class="badge bg-warning text-dark px-2 py-1">EN PAUSE</span>
                      </div>
                      <div class="stream_thumbnail position-relative">
                        <div class="w-100 d-flex align-items-center justify-content-center" style="height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                          <i class="fas fa-gamepad fs-1 text-white" style="opacity: 0.7;"></i>
                        </div>
                      </div>
                      <div class="p-4 flex-grow-1 d-flex flex-column">
                        <h5 class="fw-bold mb-2 text-white">{{ challenge.game }} Challenge</h5>
                        <p class="text-white small mb-3" style="opacity: 0.8;">
                          {{ challenge.creator?.username }} vs {{ challenge.opponent?.username || '?' }}
                        </p>
                        <div class="d-flex align-items-center gap-2 mb-3">
                          <div class="avatar_small rounded-circle d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                            <i class="fas fa-user text-white"></i>
                          </div>
                          <span class="text-white small">{{ challenge.creator?.username }}</span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mt-auto">
                          <span class="badge n10-color">{{ (challenge.bet_amount * 2).toLocaleString() }} EBT</span>
                          <span class="text-white small">
                            <i class="fas fa-eye me-1 text-danger"></i>
                            {{ challenge.viewer_count || 0 }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Search -->
              <div class="mb-4">
                <div class="row justify-content-center">
                  <div class="col-md-6">
                    <div class="input-group">
                      <input 
                        v-model="searchQuery"
                        type="text" 
                        class="form-control n11-bg text-white border-secondary" 
                        placeholder="Search for a stream..."
                        @input="debouncedSearch"
                      />
                      <button class="btn btn-outline-secondary" type="button" style="border-color: #FF9F00; color: #FF9F00;">
                        <i class="fas fa-search"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Liste des streams -->
              <div v-if="loading" class="row mt-5">
                <div class="col-12 text-center py-5">
                  <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
              <div v-else-if="streams.length > 0" class="row mt-5 g-4">
                <div v-for="stream in streams" :key="stream.id" class="col-12 col-md-6 col-lg-4">
                  <div class="stream_card defi_card n11-bg rounded-8 p-0 h-100 d-flex flex-column overflow-hidden" @click="viewStream(stream.id)">
                    <!-- Thumbnail -->
                    <div class="stream_thumbnail position-relative">
                      <img 
                        v-if="stream.thumbnail_url" 
                        :src="stream.thumbnail_url" 
                        :alt="stream.title"
                        class="w-100"
                        style="height: 200px; object-fit: cover;"
                      />
                      <div v-else class="w-100 d-flex align-items-center justify-content-center" style="height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                        <i class="fas fa-video fs-1 text-white" style="opacity: 0.5;"></i>
                      </div>
                      
                      <!-- Live badges removed -->
                    </div>

                    <!-- Stream Info -->
                    <div class="p-4 flex-grow-1 d-flex flex-column">
                      <h5 class="fw-bold mb-2 text-white">{{ stream.title || 'No title' }}</h5>
                      <p class="text-white small mb-3" style="opacity: 0.8; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                        {{ stream.description || 'No description' }}
                      </p>
                      
                      <div class="d-flex align-items-center gap-2 mb-3">
                        <div class="avatar_small rounded-circle d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                          <i class="fas fa-user text-white"></i>
                        </div>
                        <span class="text-white small">{{ stream.user?.username || 'User' }}</span>
                      </div>

                      <div class="d-flex justify-content-between align-items-center mt-auto">
                        <div>
                          <span v-if="stream.category" class="badge bg-secondary me-2">{{ stream.category }}</span>
                          <span v-if="stream.game" class="badge bg-info">{{ stream.game }}</span>
                        </div>
                        <div class="text-white small">
                          <i class="fas fa-heart me-1 text-danger"></i>
                          {{ stream.follower_count }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="row mt-5">
                <div class="col-12 text-center py-5">
                  <div class="mb-4">
                    <i class="fas fa-video-slash fs-1 text-white" style="opacity: 0.7;"></i>
                  </div>
                  <h5 class="mb-2">No streams available</h5>
                  <p class="text-white" style="opacity: 0.9;">There are no streams available at the moment.</p>
                  <button v-if="isAuthenticated" class="btn_primary mt-3" @click="goToCreateStream">
                    <i class="fas fa-video me-2"></i>
                    <span>Create the first stream</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import apiClient from '@/utils/axios';

interface Stream {
  id: number;
  title: string;
  description: string;
  thumbnail: string | null;
  thumbnail_url?: string;
  category: string | null;
  game: string | null;
  is_live: boolean;
  viewer_count: number;
  follower_count: number;
  user: {
    id: number;
    username: string;
  };
}

const router = useRouter();
const streams = ref<Stream[]>([]);
const liveChallenges = ref<any[]>([]);
const loading = ref(false);
const searchQuery = ref("");

const isAuthenticated = computed(() => {
  return !!localStorage.getItem("auth_token");
});

let searchTimeout: NodeJS.Timeout | null = null;

const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    loadStreams();
  }, 500);
};

const loadLiveChallenges = async () => {
  try {
    const response = await apiClient.get("/challenges/live");
    if (response.data.success) {
      liveChallenges.value = response.data.data || [];
    }
  } catch (error: any) {
    liveChallenges.value = [];
  }
};

const loadStreams = async () => {
  try {
    loading.value = true;
    await loadLiveChallenges();
    
    const params: any = { per_page: 20 };
    if (searchQuery.value) {
      params.search = searchQuery.value;
    }

    const response = await apiClient.get("/streams", { params });

    if (response.data.success) {
      const allStreams = response.data.data.data || response.data.data || [];
      streams.value = allStreams.filter((s: Stream) => !s.is_live);
    }
  } catch (error: any) {
    console.error("Error loading streams:", error);
    streams.value = [];
  } finally {
    loading.value = false;
  }
};

const viewChallengeLive = (challengeId: number) => {
  router.push(`/challenges/${challengeId}/live`);
};

const viewStream = (streamId: number) => {
  router.push(`/streams/${streamId}`);
};

const goToCreateStream = () => {
  router.push("/streams/create");
};

// Removed filterLive watch

onMounted(() => {
  loadStreams();
  // Refresh streams every 30s, live challenges every 10s
  setInterval(loadStreams, 30000);
  setInterval(loadLiveChallenges, 10000);
});
</script>

<style scoped>
.defis_section {
  width: 100%;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 24px;
}

.text_gradient {
  background: linear-gradient(90deg, #FF9F00, #FF9F00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
.btn_primary.active {
  background-color: #FF9F00;
  box-shadow: 0 4px 15px rgba(255, 159, 0, 0.4);
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
.btn_secondary.active {
  background-color: #FF9F00;
  color: #000;
}

.floating_card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.card_icon {
  font-size: 3rem;
}

.card_content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card_label {
  font-size: 0.9rem;
  opacity: 0.9;
  font-weight: 500;
}

.card_value {
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
}

.n10-color {
  color: #FF9F00;
}

.stream_card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.stream_card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.hero_badge {
  background: rgba(255, 159, 0, 0.2);
  color: #FF9F00;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.hero_title {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  line-height: 1.2;
}

.hero_subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.page-content-with-space {
  padding-top: 90px;
}

@media (max-width: 768px) {
  .page-content-with-space {
    padding-top: 60px;
  }
  
  .hero_title {
    font-size: 1.8rem;
  }
}
</style>





