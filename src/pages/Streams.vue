<template>
  <div class="page-content-with-space">
    <section class="streams-section">
      <div class="container-fluid">

        <!-- ── Header ──────────────────────────────────────────────────────── -->
        <div class="streams-header">
          <div>
            <span class="hero-badge">📺 Live Streaming</span>
            <h2 class="hero-title mt-3">
              Regardez les <span class="text-gradient">Streams</span> en direct
            </h2>
            <p class="hero-sub">Découvrez les streamers et suivez les challenges live.</p>
          </div>

          <button v-if="isAuthenticated" class="btn-primary" @click="$router.push('/streams/create')">
            <i class="fas fa-video me-2"></i>Créer un stream
          </button>
          <button v-else class="btn-primary" @click="$router.push('/login')">
            <i class="fas fa-sign-in-alt me-2"></i>Se connecter pour streamer
          </button>
        </div>

        <!-- ── Challenges EN DIRECT ───────────────────────────────────────── -->
        <template v-if="liveChallenges.length > 0">
          <div class="section-label">
            <span class="live-dot" />
            Challenges en direct
          </div>
          <div class="cards-grid mb-5">
            <div v-for="challenge in liveChallenges" :key="'c-' + challenge.id" class="stream-card"
              @click="$router.push(`/challenges/${challenge.id}/live`)">
              <div class="card-thumb challenge-thumb">
                <i class="fas fa-gamepad fs-1 text-white opacity-50" />
                <span class="badge-live">🔴 LIVE</span>
                <span v-if="challenge.is_live_paused" class="badge-pause">EN PAUSE</span>
              </div>
              <div class="card-body">
                <h5 class="card-title">{{ challenge.game }} Challenge</h5>
                <p class="card-meta">
                  {{ challenge.creator?.username }} vs {{ challenge.opponent?.username || '?' }}
                </p>
                <div class="card-footer">
                  <span class="badge-ebt">{{ (challenge.bet_amount * 2).toLocaleString() }} EBT</span>
                  <span class="viewers">
                    <i class="fas fa-eye me-1" />{{ challenge.viewer_count || 0 }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- ── Streams LIVE ───────────────────────────────────────────────── -->
        <template v-if="liveStreams.length > 0">
          <div class="section-label">
            <span class="live-dot" />
            Streams en direct
          </div>
          <div class="cards-grid mb-5">
            <StreamCard v-for="stream in liveStreams" :key="'ls-' + stream.id" :stream="stream" :live="true"
              @click="$router.push(`/streams/${stream.id}/watch`)" />
          </div>
        </template>

        <!-- ── Recherche ──────────────────────────────────────────────────── -->
        <div class="search-bar">
          <i class="fas fa-search" />
          <input v-model="searchQuery" type="text" placeholder="Rechercher un stream..." @input="debouncedSearch" />
        </div>

        <!-- ── Tous les streams ───────────────────────────────────────────── -->
        <div class="section-label">Tous les streams</div>

        <!-- Loading -->
        <div v-if="loading" class="empty-state">
          <div class="spinner" />
        </div>

        <!-- Streams -->
        <div v-else-if="offlineStreams.length > 0" class="cards-grid">
          <StreamCard v-for="stream in offlineStreams" :key="'s-' + stream.id" :stream="stream" :live="false"
            @click="$router.push(`/streams/${stream.id}`)" />
        </div>

        <!-- Vide -->
        <div v-else class="empty-state">
          <i class="fas fa-video-slash fs-1 mb-4 opacity-50" />
          <p>Aucun stream disponible pour le moment.</p>
          <button v-if="isAuthenticated" class="btn-primary mt-3" @click="$router.push('/streams/create')">
            <i class="fas fa-video me-2" />Créer le premier stream
          </button>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import apiClient from '@/utils/axios';

// ── Types ────────────────────────────────────────────────────────────────────
interface Stream {
  id: number;
  title: string;
  description: string;
  thumbnail_url?: string;
  category?: string;
  game?: string;
  is_live: boolean;
  viewer_count: number;
  follower_count: number;
  user: { id: number; username: string };
}

// ── State ────────────────────────────────────────────────────────────────────
const streams = ref<Stream[]>([]);
const liveChallenges = ref<any[]>([]);
const loading = ref(false);
const searchQuery = ref('');

// ── Auth ─────────────────────────────────────────────────────────────────────
const isAuthenticated = computed(() => !!localStorage.getItem('auth_token'));

// ── Computed ─────────────────────────────────────────────────────────────────
const liveStreams = computed(() => streams.value.filter((s) => s.is_live));
const offlineStreams = computed(() => streams.value.filter((s) => !s.is_live));

// ── Load ─────────────────────────────────────────────────────────────────────
const loadStreams = async () => {
  loading.value = true;
  try {
    const [streamsRes, challengesRes] = await Promise.allSettled([
      apiClient.get('/streams', {
        params: { per_page: 30, search: searchQuery.value || undefined },
      }),
      apiClient.get('/challenges/live'),
    ]);

    if (streamsRes.status === 'fulfilled' && streamsRes.value.data.success) {
      const raw = streamsRes.value.data.data?.data ?? streamsRes.value.data.data ?? [];
      streams.value = raw;
    }

    if (challengesRes.status === 'fulfilled' && challengesRes.value.data.success) {
      liveChallenges.value = challengesRes.value.data.data ?? [];
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

// ── Debounce search ───────────────────────────────────────────────────────────
let searchTimer: ReturnType<typeof setTimeout>;
const debouncedSearch = () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(loadStreams, 400);
};

// ── Polling ───────────────────────────────────────────────────────────────────
let pollInterval: ReturnType<typeof setInterval>;

onMounted(() => {
  loadStreams();
  pollInterval = setInterval(loadStreams, 20000);
});

onBeforeUnmount(() => {
  clearInterval(pollInterval);
  clearTimeout(searchTimer);
});
</script>

<!-- ── StreamCard (composant inline) ───────────────────────────────────────── -->
<script lang="ts">
import { defineComponent, PropType } from 'vue';

const StreamCard = defineComponent({
  name: 'StreamCard',
  props: {
    stream: { type: Object as PropType<any>, required: true },
    live: { type: Boolean, default: false },
  },
  emits: ['click'],
  template: `
    <div class="stream-card" @click="$emit('click')">
      <div class="card-thumb">
        <img v-if="stream.thumbnail_url" :src="stream.thumbnail_url" :alt="stream.title" />
        <div v-else class="thumb-placeholder">
          <i class="fas fa-video fs-2 opacity-40" />
        </div>
        <span v-if="live" class="badge-live">🔴 LIVE</span>
        <span v-if="live" class="viewers-overlay">
          <i class="fas fa-eye me-1" />{{ stream.viewer_count || 0 }}
        </span>
      </div>
      <div class="card-body">
        <h5 class="card-title">{{ stream.title || 'Sans titre' }}</h5>
        <p class="card-meta line-clamp">{{ stream.description || 'Aucune description' }}</p>
        <div class="card-user">
          <div class="avatar"><i class="fas fa-user" /></div>
          <span>{{ stream.user?.username || 'Inconnu' }}</span>
        </div>
        <div class="card-footer">
          <div class="badges">
            <span v-if="stream.category" class="badge-tag">{{ stream.category }}</span>
            <span v-if="stream.game" class="badge-tag info">{{ stream.game }}</span>
          </div>
          <span class="viewers">
            <i class="fas fa-heart me-1" />{{ stream.follower_count || 0 }}
          </span>
        </div>
      </div>
    </div>
  `,
});

export default { components: { StreamCard } };
</script>

<style scoped>
/* ── Layout ────────────────────────────────────────────────────────────────── */
.page-content-with-space {
  padding-top: 90px;
}

.streams-section {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  border-radius: 24px;
  padding: 2.5rem 0 5rem;
  color: #fff;
}

/* ── Header ──────────────────────────────────────────────────────────────── */
.streams-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.hero-badge {
  background: rgba(255, 159, 0, 0.18);
  color: #FF9F00;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.hero-title {
  font-size: 2.4rem;
  font-weight: 800;
  line-height: 1.2;
  color: #fff;
  margin-bottom: 0.5rem;
}

.text-gradient {
  background: linear-gradient(90deg, #FF9F00, #ffca6e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-sub {
  color: rgba(255, 255, 255, 0.65);
  font-size: 1rem;
  margin: 0;
}

/* ── Section label ───────────────────────────────────────────────────────── */
.section-label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 1.25rem;
}

.live-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: #ef4444;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

/* ── Grid cards ──────────────────────────────────────────────────────────── */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* ── Stream card ─────────────────────────────────────────────────────────── */
.stream-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.25s, box-shadow 0.25s;
  display: flex;
  flex-direction: column;
}

.stream-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
}

/* Thumbnail */
.card-thumb {
  position: relative;
  height: 190px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #fff;
}

.challenge-thumb {
  background: linear-gradient(135deg, #1a1f3a 0%, #4a1942 100%);
}

/* Badges */
.badge-live {
  position: absolute;
  top: 0.6rem;
  left: 0.6rem;
  background: #ef4444;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  letter-spacing: 0.04em;
}

.badge-pause {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  background: #f59e0b;
  color: #000;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
}

.viewers-overlay {
  position: absolute;
  bottom: 0.6rem;
  right: 0.6rem;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  font-size: 0.78rem;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
}

/* Body */
.card-body {
  padding: 1rem 1.1rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.card-meta {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.55);
  margin: 0;
}

.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-user {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.7);
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: #fff;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 0.5rem;
}

.badges {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.badge-tag {
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.72rem;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
}

.badge-tag.info {
  background: rgba(14, 165, 233, 0.2);
  color: #7dd3fc;
}

.badge-ebt {
  background: rgba(255, 159, 0, 0.18);
  color: #FF9F00;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
}

.viewers {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

/* ── Recherche ───────────────────────────────────────────────────────────── */
.search-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 0.7rem 1.1rem;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.5);
}

.search-bar input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 0.95rem;
}

.search-bar input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

/* ── Buttons ─────────────────────────────────────────────────────────────── */
.btn-primary {
  background: #FF9F00;
  color: #000;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  white-space: nowrap;
}

.btn-primary:hover {
  opacity: 0.88;
  transform: translateY(-1px);
}

/* ── Empty / Loading ─────────────────────────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: #FF9F00;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* ── Animations ──────────────────────────────────────────────────────────── */
@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.35;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── Responsive ──────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .page-content-with-space {
    padding-top: 60px;
  }

  .hero-title {
    font-size: 1.7rem;
  }

  .streams-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>