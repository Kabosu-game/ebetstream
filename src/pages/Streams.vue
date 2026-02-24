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
                  <div class="defis_content" data-aos="fade-right">
                    <span class="hero_badge mb-3 d-inline-block">📺 Live Streaming</span>
                    <h2 class="hero_title mb-4">
                      Watch <span class="text_gradient">Streams</span><br />
                      from your favorite players!
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
                  <div class="defis_image" data-aos="fade-left">
                    <div class="floating_card">
                      <div class="card_icon">📹</div>
                      <div class="card_content">
                        <span class="card_label">Streaming</span>
                        <span class="card_value">Live</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ── Challenges en direct ── -->
              <div v-if="liveChallenges.length > 0" class="mb-5">
                <h4 class="fw-bold mb-4 text-white">
                  <i class="fas fa-circle text-danger me-2" style="font-size:.6rem;animation:pulse 2s infinite;"></i>
                  Challenges en direct
                </h4>
                <div class="row g-4">
                  <div v-for="challenge in liveChallenges" :key="challenge.id" class="col-12 col-md-6 col-lg-4">
                    <div
                      class="stream_card defi_card n11-bg rounded-8 p-0 h-100 d-flex flex-column overflow-hidden position-relative"
                      @click="$router.push(`/challenges/${challenge.id}/live`)">
                      <span class="badge bg-danger position-absolute top-0 start-0 m-2 z-1 px-2 py-1">
                        <i class="fas fa-circle me-1" style="font-size:.5rem;animation:pulse 2s infinite;"></i>LIVE
                      </span>
                      <div class="w-100 d-flex align-items-center justify-content-center"
                        style="height:200px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);">
                        <i class="fas fa-gamepad fs-1 text-white" style="opacity:.7;"></i>
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

              <!-- ── Streams LIVE ── -->
              <div v-if="liveStreams.length > 0" class="mb-5">
                <h4 class="fw-bold mb-4 text-white">
                  <i class="fas fa-circle text-danger me-2" style="font-size:.6rem;animation:pulse 2s infinite;"></i>
                  Streams en direct ({{ liveStreams.length }})
                </h4>
                <div class="row g-4">
                  <div v-for="stream in liveStreams" :key="stream.id" class="col-12 col-md-6 col-lg-4">
                    <StreamCard :stream="stream" @click="$router.push(`/streams/${stream.id}`)" />
                  </div>
                </div>
              </div>

              <!-- ── Barre de recherche ── -->
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

              <!-- ── Streams offline ── -->
              <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status" style="width:3rem;height:3rem;">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <template v-else>
                <h4 v-if="offlineStreams.length > 0" class="fw-bold mb-4 text-white">
                  Tous les streams
                </h4>
                <div v-if="offlineStreams.length > 0" class="row g-4">
                  <div v-for="stream in offlineStreams" :key="stream.id" class="col-12 col-md-6 col-lg-4">
                    <StreamCard :stream="stream" @click="$router.push(`/streams/${stream.id}`)" />
                  </div>
                </div>

                <!-- Vide -->
                <div v-if="liveStreams.length === 0 && offlineStreams.length === 0 && liveChallenges.length === 0"
                  class="text-center py-5">
                  <i class="fas fa-video-slash fs-1 text-white mb-4" style="opacity:.7;"></i>
                  <h5 class="mb-2 text-white">No streams available</h5>
                  <p class="text-white" style="opacity:.7;">There are no streams at the moment.</p>
                  <button v-if="isAuthenticated" class="btn_primary mt-3" @click="$router.push('/streams/create')">
                    <i class="fas fa-video me-2"></i>Create the first stream
                  </button>
                </div>
              </template>

            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/utils/axios';

// ── Mini composant interne StreamCard ────────────────────────────────────────
// (Défini ici pour ne pas créer de fichier supplémentaire)
import { defineComponent, h } from 'vue';
const StreamCard = defineComponent({
  props: { stream: Object },
  emits: ['click'],
  setup(props, { emit }) {
    return () => h('div', {
      class: 'stream_card defi_card n11-bg rounded-8 p-0 h-100 d-flex flex-column overflow-hidden position-relative',
      onClick: () => emit('click'),
    }, [
      // Badge LIVE
      props.stream?.is_live ? h('span', {
        class: 'badge bg-danger position-absolute top-0 start-0 m-2 z-1 px-2 py-1'
      }, [
        h('i', { class: 'fas fa-circle me-1', style: 'font-size:.5rem;animation:pulse 2s infinite;' }),
        'LIVE'
      ]) : null,
      // Thumbnail
      props.stream?.thumbnail_url
        ? h('img', { src: props.stream.thumbnail_url, alt: props.stream.title, class: 'w-100', style: 'height:200px;object-fit:cover;' })
        : h('div', { class: 'w-100 d-flex align-items-center justify-content-center', style: 'height:200px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);' },
          [h('i', { class: 'fas fa-video fs-1 text-white', style: 'opacity:.5;' })]),
      // Body
      h('div', { class: 'p-4 flex-grow-1 d-flex flex-column' }, [
        h('h5', { class: 'fw-bold mb-2 text-white' }, props.stream?.title || 'No title'),
        h('p', { class: 'text-white small mb-3', style: 'opacity:.8;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;' },
          props.stream?.description || 'No description'),
        h('div', { class: 'd-flex align-items-center gap-2 mb-3' }, [
          h('div', { class: 'rounded-circle d-flex align-items-center justify-content-center', style: 'width:32px;height:32px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);' },
            [h('i', { class: 'fas fa-user text-white' })]),
          h('span', { class: 'text-white small' }, props.stream?.user?.username || 'User'),
        ]),
        h('div', { class: 'd-flex justify-content-between align-items-center mt-auto' }, [
          h('div', {}, [
            props.stream?.category ? h('span', { class: 'badge bg-secondary me-2' }, props.stream.category) : null,
            props.stream?.game ? h('span', { class: 'badge bg-info' }, props.stream.game) : null,
          ]),
          h('div', { class: 'text-white small' }, [
            h('i', { class: 'fas fa-heart me-1 text-danger' }),
            String(props.stream?.follower_count ?? 0),
          ]),
        ]),
      ]),
    ]);
  },
});

const router = useRouter();

interface Stream {
  id: number; title: string; description: string;
  thumbnail_url?: string; category?: string; game?: string;
  is_live: boolean; viewer_count: number; follower_count: number;
  user: { id: number; username: string; };
}

const allStreams = ref<Stream[]>([]);
const liveChallenges = ref<any[]>([]);
const loading = ref(false);
const searchQuery = ref('');

const isAuthenticated = computed(() => !!localStorage.getItem('auth_token'));
// Streams live VS offline — le filtre était inversé dans l'ancienne version !
const liveStreams = computed(() => allStreams.value.filter(s => s.is_live));
const offlineStreams = computed(() => allStreams.value.filter(s => !s.is_live));

let searchTimer: ReturnType<typeof setTimeout> | null = null;
const debouncedSearch = () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(loadStreams, 500);
};

const loadLiveChallenges = async () => {
  try {
    const res = await apiClient.get('/challenges/live/list');
    if (res.data.success) liveChallenges.value = res.data.data || [];
  } catch { liveChallenges.value = []; }
};

const loadStreams = async () => {
  loading.value = true;
  try {
    const params: Record<string, any> = { per_page: 20 };
    if (searchQuery.value) params.search = searchQuery.value;

    const res = await apiClient.get('/streams', { params });
    if (res.data.success) {
      allStreams.value = res.data.data.data ?? res.data.data ?? [];
    }
  } catch (err: any) {
    console.error('Error loading streams:', err);
    allStreams.value = [];
  } finally {
    loading.value = false;
  }
};

let timers: ReturnType<typeof setInterval>[] = [];

onMounted(() => {
  loadStreams();
  loadLiveChallenges();
  timers.push(setInterval(loadStreams, 30000));
  timers.push(setInterval(loadLiveChallenges, 10000));
});

onBeforeUnmount(() => timers.forEach(clearInterval));
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
  background: linear-gradient(90deg, #FF9F00, #e67e00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn_primary {
  background-color: #FF9F00;
  color: #000;
  border: none;
  padding: .75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  transition: .3s;
  cursor: pointer;
}

.btn_primary:hover {
  transform: translateY(-2px);
}

.btn_secondary {
  background: transparent;
  border: 2px solid #FF9F00;
  color: #FF9F00;
  padding: .75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  transition: .3s;
  cursor: pointer;
}

.btn_secondary:hover {
  background-color: #FF9F00;
  color: #000;
}

.stream_card {
  cursor: pointer;
  transition: transform .3s ease, box-shadow .3s ease;
}

.stream_card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, .4);
}

.floating_card {
  background: rgba(255, 255, 255, .15);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, .3);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, .3);
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

.defi_card {
  background: rgba(255, 255, 255, .1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}

.hero_badge {
  background: rgba(255, 159, 0, .2);
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
  color: rgba(255, 255, 255, .8);
  line-height: 1.6;
}

.n10-color {
  color: #FF9F00;
}

.form-control {
  color: white;
}

.form-control::placeholder {
  color: rgba(255, 255, 255, .5);
}

.form-control:focus {
  background-color: rgba(255, 255, 255, .1);
  border-color: #FF9F00;
  color: white;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: .5;
  }
}

.page-content-with-space {
  padding-top: 90px;
}

@media (max-width:768px) {
  .page-content-with-space {
    padding-top: 60px;
  }

  .hero_title {
    font-size: 1.8rem;
  }
}
</style>