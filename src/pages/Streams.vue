<template>
  <div class="page-content-with-space">
    <section class="defis_section py-6 position-relative overflow-hidden pb-120">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 gx-0 gx-lg-4">
            <div class="defis__main">

              <!-- Header -->
              <div class="row h-100 align-items-center mb-5">
                <div class="col-lg-6 col-md-7">
                  <div class="defis_content">
                    <span class="hero_badge mb-3 d-inline-block">📺 Live Streaming</span>
                    <h2 class="hero_title mb-4">
                      Watch <span class="text_gradient">Streams</span><br />from your favorite players!
                    </h2>
                    <p class="hero_subtitle mb-5">
                      Regardez les lives des challenges en direct et découvrez les streamers eBetStream.
                    </p>
                    <div class="hero_actions d-flex flex-wrap gap-3">
                      <button v-if="isAuthenticated" class="btn_secondary" @click="$router.push('/streams/create')">
                        <i class="fas fa-video me-2"></i>Create a stream
                      </button>
                      <button v-else class="btn_secondary" @click="$router.push('/login')">
                        <i class="fas fa-sign-in-alt me-2"></i>Login to stream
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-lg-6 col-md-5 d-none d-md-block">
                  <div class="defis_image">
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

              <!-- Challenges en direct -->
              <div v-if="liveChallenges.length > 0" class="mb-5">
                <h4 class="fw-bold mb-4 text-white">
                  <i class="fas fa-circle text-danger me-2" style="font-size:.6rem;animation:pulse 2s infinite;"></i>
                  Challenges en direct
                </h4>
                <div class="row g-4">
                  <div v-for="challenge in liveChallenges" :key="challenge.id" class="col-12 col-md-6 col-lg-4">
                    <div
                      class="stream_card defi_card n11-bg rounded-8 p-0 h-100 d-flex flex-column overflow-hidden position-relative"
                      @click="$router.push(`/challenges/${challenge.id}/live/list`)">
                      <div class="position-absolute top-0 start-0 m-2" style="z-index:1;">
                        <span class="badge bg-danger px-2 py-1">
                          <i class="fas fa-circle me-1" style="font-size:.5rem;animation:pulse 2s infinite;"></i>LIVE
                        </span>
                      </div>
                      <div v-if="challenge.is_live_paused" class="position-absolute top-0 end-0 m-2" style="z-index:1;">
                        <span class="badge bg-warning text-dark px-2 py-1">EN PAUSE</span>
                      </div>
                      <div class="stream_thumbnail position-relative">
                        <div class="w-100 d-flex align-items-center justify-content-center"
                          style="height:200px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);">
                          <i class="fas fa-gamepad fs-1 text-white" style="opacity:.7;"></i>
                        </div>
                      </div>
                      <div class="p-4 flex-grow-1 d-flex flex-column">
                        <h5 class="fw-bold mb-2 text-white">{{ challenge.game }} Challenge</h5>
                        <p class="text-white small mb-3" style="opacity:.8;">
                          {{ challenge.creator?.username }} vs {{ challenge.opponent?.username || '?' }}
                        </p>
                        <div class="d-flex justify-content-between align-items-center mt-auto">
                          <span class="badge n10-color">{{ (challenge.bet_amount * 2).toLocaleString() }} EBT</span>
                          <span class="text-white small">
                            <i class="fas fa-eye me-1 text-danger"></i>{{ challenge.viewer_count || 0 }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Streams EN DIRECT -->
              <div v-if="liveStreams.length > 0" class="mb-5">
                <h4 class="fw-bold mb-4 text-white">
                  <i class="fas fa-circle text-danger me-2" style="font-size:.6rem;animation:pulse 2s infinite;"></i>
                  Streams en direct
                </h4>
                <div class="row g-4">
                  <div v-for="stream in liveStreams" :key="'l' + stream.id" class="col-12 col-md-6 col-lg-4">
                    <div class="stream_card defi_card n11-bg rounded-8 p-0 h-100 d-flex flex-column overflow-hidden"
                      @click="$router.push(`/streams/${stream.id}/watch`)">
                      <div class="stream_thumbnail position-relative">
                        <img v-if="stream.thumbnail_url" :src="stream.thumbnail_url" :alt="stream.title" class="w-100"
                          style="height:200px;object-fit:cover;" />
                        <div v-else class="w-100 d-flex align-items-center justify-content-center"
                          style="height:200px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);">
                          <i class="fas fa-video fs-1 text-white" style="opacity:.5;"></i>
                        </div>
                        <div class="position-absolute top-0 start-0 m-2">
                          <span class="badge bg-danger px-2 py-1">
                            <i class="fas fa-circle me-1" style="font-size:.5rem;animation:pulse 2s infinite;"></i>LIVE
                          </span>
                        </div>
                        <div class="position-absolute bottom-0 end-0 m-2">
                          <span class="badge bg-dark px-2 py-1">
                            <i class="fas fa-eye me-1"></i>{{ stream.viewer_count || 0 }}
                          </span>
                        </div>
                      </div>
                      <div class="p-4 flex-grow-1 d-flex flex-column">
                        <h5 class="fw-bold mb-2 text-white">{{ stream.title || 'Sans titre' }}</h5>
                        <div class="d-flex align-items-center gap-2 mb-3">
                          <div class="avatar_small rounded-circle d-flex align-items-center justify-content-center"
                            style="width:32px;height:32px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);">
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
                            <i class="fas fa-heart me-1 text-danger"></i>{{ stream.follower_count }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recherche -->
              <div class="mb-4">
                <div class="row justify-content-center">
                  <div class="col-md-6">
                    <div class="input-group">
                      <input v-model="searchQuery" type="text" class="form-control n11-bg text-white border-secondary"
                        placeholder="Search for a stream..." @input="debouncedSearch" />
                      <button class="btn btn-outline-secondary" type="button"
                        style="border-color:#FF9F00;color:#FF9F00;">
                        <i class="fas fa-search"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tous les streams (offline) -->
              <div v-if="loading" class="row mt-5">
                <div class="col-12 text-center py-5">
                  <div class="spinner-border text-primary" role="status" style="width:3rem;height:3rem;">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              </div>
              <div v-else-if="offlineStreams.length > 0" class="row mt-5 g-4">
                <div v-for="stream in offlineStreams" :key="stream.id" class="col-12 col-md-6 col-lg-4">
                  <div class="stream_card defi_card n11-bg rounded-8 p-0 h-100 d-flex flex-column overflow-hidden"
                    @click="$router.push(`/streams/${stream.id}`)">
                    <div class="stream_thumbnail position-relative">
                      <img v-if="stream.thumbnail_url" :src="stream.thumbnail_url" :alt="stream.title" class="w-100"
                        style="height:200px;object-fit:cover;" />
                      <div v-else class="w-100 d-flex align-items-center justify-content-center"
                        style="height:200px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);">
                        <i class="fas fa-video fs-1 text-white" style="opacity:.5;"></i>
                      </div>
                    </div>
                    <div class="p-4 flex-grow-1 d-flex flex-column">
                      <h5 class="fw-bold mb-2 text-white">{{ stream.title || 'No title' }}</h5>
                      <p class="text-white small mb-3"
                        style="opacity:.8;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
                        {{ stream.description || 'No description' }}
                      </p>
                      <div class="d-flex align-items-center gap-2 mb-3">
                        <div class="avatar_small rounded-circle d-flex align-items-center justify-content-center"
                          style="width:32px;height:32px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);">
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
                          <i class="fas fa-heart me-1 text-danger"></i>{{ stream.follower_count }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else-if="!loading" class="row mt-5">
                <div class="col-12 text-center py-5">
                  <div class="mb-4">
                    <i class="fas fa-video-slash fs-1 text-white" style="opacity:.7;"></i>
                  </div>
                  <h5 class="mb-2">No streams available</h5>
                  <p class="text-white" style="opacity:.9;">There are no streams available at the moment.</p>
                  <button v-if="isAuthenticated" class="btn_primary mt-3" @click="$router.push('/streams/create')">
                    <i class="fas fa-video me-2"></i>Create the first stream
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import apiClient from '@/utils/axios';

interface Stream {
  id: number; title: string; description: string; thumbnail_url?: string;
  category?: string; game?: string; is_live: boolean;
  viewer_count: number; follower_count: number;
  user: { id: number; username: string; };
}

const streams = ref<Stream[]>([]);
const liveChallenges = ref<any[]>([]);
const loading = ref(false);
const searchQuery = ref('');

const isAuthenticated = computed(() => !!localStorage.getItem('auth_token'));
const liveStreams = computed(() => streams.value.filter(s => s.is_live));
const offlineStreams = computed(() => streams.value.filter(s => !s.is_live));

const loadStreams = async () => {
  loading.value = true;
  try {
    const [sr, cr] = await Promise.allSettled([
      apiClient.get('/streams', { params: { per_page: 30, search: searchQuery.value || undefined } }),
      apiClient.get('/challenges/live'),
    ]);
    if (sr.status === 'fulfilled' && sr.value.data.success) {
      streams.value = sr.value.data.data?.data ?? sr.value.data.data ?? [];
    }
    if (cr.status === 'fulfilled' && cr.value.data.success) {
      liveChallenges.value = cr.value.data.data ?? [];
    }
  } catch (e) { console.error(e); } finally { loading.value = false; }
};

let searchTimer: ReturnType<typeof setTimeout>;
const debouncedSearch = () => { clearTimeout(searchTimer); searchTimer = setTimeout(loadStreams, 500); };

let pollInterval: ReturnType<typeof setInterval>;
onMounted(() => { loadStreams(); pollInterval = setInterval(loadStreams, 20000); });
onBeforeUnmount(() => { clearInterval(pollInterval); clearTimeout(searchTimer); });
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
  gap: .5rem;
}

.card_label {
  font-size: .9rem;
  opacity: .9;
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
  padding: .5rem 1rem;
  border-radius: 20px;
  font-size: .9rem;
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

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
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