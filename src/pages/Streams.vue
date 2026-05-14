<template>
  <div class="streams-page">

    <!-- Top bar -->
    <div class="streams-topbar">
      <div class="streams-topbar__left">
        <h1 class="streams-topbar__title">{{ $t('ui.browse_streams') }}</h1>
        <span v-if="liveStreams.length > 0" class="st-live-pill">
          <span class="st-dot"></span>{{ liveStreams.length }} Live
        </span>
        <span v-if="liveChallenges.length > 0" class="st-challenge-pill">
          <i class="fas fa-fist-raised"></i>{{ liveChallenges.length }} Challenges
        </span>
      </div>
      <button v-if="isAuthenticated" class="st-stream-btn" @click="$router.push('/streams/create')">
        <i class="fas fa-video"></i><span class="btn-text">{{ $t('ui.go_live_2') }}</span>
      </button>
      <button v-else class="st-stream-btn st-stream-btn--ghost" @click="$router.push('/login')">
        <i class="fas fa-sign-in-alt"></i><span class="btn-text">{{ $t('ui.login_to_stream') }}</span>
      </button>
    </div>

    <!-- Controls: tabs + search -->
    <div class="streams-controls">
      <div class="st-tabs">
        <button class="st-tab" :class="{ active: activeTab === 'all' }"        @click="activeTab = 'all'">
          All<span class="st-tab-count">{{ allStreams.length + liveChallenges.length }}</span>
        </button>
        <button class="st-tab" :class="{ active: activeTab === 'live' }"       @click="activeTab = 'live'">
          <span class="st-dot"></span>{{ $t('betting.live') }}<span class="st-tab-count" v-if="liveStreams.length">{{ liveStreams.length }}</span>
        </button>
        <button class="st-tab" :class="{ active: activeTab === 'challenges' }" @click="activeTab = 'challenges'">
          <i class="fas fa-fist-raised"></i>{{ $t('nav.challenges') }}<span class="st-tab-count" v-if="liveChallenges.length">{{ liveChallenges.length }}</span>
        </button>
        <button class="st-tab" :class="{ active: activeTab === 'offline' }"    @click="activeTab = 'offline'">
          Recent<span class="st-tab-count" v-if="offlineStreams.length">{{ offlineStreams.length }}</span>
        </button>
      </div>

      <div class="st-search">
        <i class="ti ti-search st-search__icon"></i>
        <input
          v-model="searchQuery"
          type="text"
          class="st-search__input"
          :placeholder="$t('ui.search_streams')"
          @input="debouncedSearch"
        />
        <button v-if="searchQuery" class="st-search__clear" @click="searchQuery = ''; loadStreams()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="st-grid">
      <div v-for="n in 8" :key="n" class="st-skeleton">
        <div class="st-skeleton__thumb"></div>
        <div class="st-skeleton__info">
          <div class="st-skeleton__avatar"></div>
          <div class="st-skeleton__lines">
            <div class="st-skeleton__line st-l70"></div>
            <div class="st-skeleton__line st-l50"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <template v-else>

      <!-- Challenges (shown in 'all' and 'challenges' tabs) -->
      <div
        v-if="liveChallenges.length > 0 && (activeTab === 'all' || activeTab === 'challenges')"
        class="st-section"
      >
        <div class="st-section-header">
          <span class="st-section-dot st-section-dot--red"></span>
          <h2 class="st-section-title">{{ $t('ui.live_challenges') }}</h2>
          <span class="st-section-count">{{ liveChallenges.length }}</span>
        </div>
        <div class="st-grid">
          <div
            v-for="ch in liveChallenges"
            :key="ch.id"
            class="st-card"
            @click="$router.push(`/challenges/${ch.id}/live`)"
          >
            <StreamCover
              :stream-id="ch.id"
              :title="`${ch.game || 'Challenge'} · ${ch.creator?.username} VS ${ch.opponent?.username || '?'}`"
              :username="ch.creator?.username"
              :game="ch.game"
              :is-live="true"
              :is-challenge="true"
              :viewer-count="ch.viewer_count || 0"
            />
            <div class="st-card__info">
              <div class="st-card__avatar st-card__avatar--challenge">
                <i class="fas fa-fist-raised"></i>
              </div>
              <div class="st-card__meta">
                <p class="st-card__title">{{ ch.game }} Challenge</p>
                <p class="st-card__channel">
                  {{ ch.creator?.username }}<span class="st-vs"> VS </span>{{ ch.opponent?.username || '?' }}
                </p>
                <span class="st-tag st-tag--ebt">
                  <i class="fas fa-coins"></i> {{ (ch.bet_amount * 2).toLocaleString() }} EBT
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Live streams -->
      <div
        v-if="liveStreams.length > 0 && (activeTab === 'all' || activeTab === 'live')"
        class="st-section"
      >
        <div class="st-section-header">
          <span class="st-section-dot st-section-dot--red"></span>
          <h2 class="st-section-title">{{ $t('ui.live_now') }}</h2>
          <span class="st-section-count">{{ liveStreams.length }}</span>
        </div>
        <div class="st-grid">
          <div
            v-for="stream in liveStreams"
            :key="stream.id"
            class="st-card"
            @click="$router.push(`/streams/${stream.id}`)"
          >
            <StreamCover
              :stream-id="stream.id"
              :title="stream.title"
              :username="stream.user?.username"
              :game="stream.game"
              :category="stream.category"
              :is-live="true"
              :viewer-count="stream.viewer_count"
              :thumbnail-url="stream.thumbnail_url"
            />
            <div class="st-card__info">
              <div class="st-card__avatar" :style="avatarStyle(stream.id)">
                {{ initials(stream.user?.username || stream.title) }}
              </div>
              <div class="st-card__meta">
                <p class="st-card__title">{{ stream.title || 'Untitled Stream' }}</p>
                <p class="st-card__channel">{{ stream.user?.username || '—' }}</p>
                <span v-if="stream.game" class="st-tag">{{ stream.game }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Offline / recent streams -->
      <div
        v-if="offlineStreams.length > 0 && (activeTab === 'all' || activeTab === 'offline')"
        class="st-section"
      >
        <div class="st-section-header">
          <span class="st-section-dot"></span>
          <h2 class="st-section-title">{{ $t('ui.recent_streams') }}</h2>
          <span class="st-section-count">{{ offlineStreams.length }}</span>
        </div>
        <div class="st-grid">
          <div
            v-for="stream in offlineStreams"
            :key="stream.id"
            class="st-card"
            @click="$router.push(`/streams/${stream.id}`)"
          >
            <StreamCover
              :stream-id="stream.id"
              :title="stream.title"
              :username="stream.user?.username"
              :game="stream.game"
              :category="stream.category"
              :is-ended="true"
              :follower-count="stream.follower_count"
              :thumbnail-url="stream.thumbnail_url"
            />
            <div class="st-card__info">
              <div class="st-card__avatar" :style="avatarStyle(stream.id)">
                {{ initials(stream.user?.username || stream.title) }}
              </div>
              <div class="st-card__meta">
                <p class="st-card__title">{{ stream.title || 'Untitled Stream' }}</p>
                <p class="st-card__channel">{{ stream.user?.username || '—' }}</p>
                <div class="st-card__tags">
                  <span v-if="stream.game" class="st-tag">{{ stream.game }}</span>
                  <span class="st-card__viewers">
                    <i class="far fa-heart"></i> {{ stream.follower_count ?? 0 }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty states per tab -->
      <div v-if="activeTab === 'live' && liveStreams.length === 0" class="st-empty">
        <i class="ti ti-broadcast-off st-empty__icon"></i>
        <h3 class="st-empty__title">{{ $t('ui.no_live_streams_right_now') }}</h3>
        <p class="st-empty__sub">{{ $t('ui.be_the_first_to_go_live') }}</p>
        <button v-if="isAuthenticated" class="st-btn-primary" @click="$router.push('/streams/create')">
          <i class="fas fa-video"></i>{{ $t('ui.start_streaming') }}</button>
      </div>

      <div v-if="activeTab === 'challenges' && liveChallenges.length === 0" class="st-empty">
        <i class="fas fa-fist-raised st-empty__icon"></i>
        <h3 class="st-empty__title">{{ $t('ui.no_live_challenges') }}</h3>
        <p class="st-empty__sub">{{ $t('ui.start_a_challenge_to_see_it_here') }}</p>
        <router-link to="/challenges" class="st-btn-primary">{{ $t('ui.browse_challenges') }}</router-link>
      </div>

      <div v-if="activeTab === 'offline' && offlineStreams.length === 0" class="st-empty">
        <i class="fas fa-video-slash st-empty__icon"></i>
        <h3 class="st-empty__title">{{ $t('ui.no_streams_found') }}</h3>
        <p class="st-empty__sub">{{ $t('ui.try_adjusting_your_search') }}</p>
      </div>

      <!-- Global empty (all tabs, nothing at all) -->
      <div
        v-if="activeTab === 'all' && allStreams.length === 0 && liveChallenges.length === 0"
        class="st-empty"
      >
        <i class="fas fa-video-slash st-empty__icon"></i>
        <h3 class="st-empty__title">{{ $t('ui.no_streams_available') }}</h3>
        <p class="st-empty__sub">{{ $t('ui.be_the_first_to_stream_on_ebetstream') }}</p>
        <button v-if="isAuthenticated" class="st-btn-primary" @click="$router.push('/streams/create')">
          <i class="fas fa-video"></i>{{ $t('ui.create_a_stream') }}</button>
        <router-link v-else to="/login" class="st-btn-primary">{{ $t('ui.login_to_start') }}</router-link>
      </div>

    </template>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/utils/axios';
import { formatViewers, initials, STREAM_GRADIENTS } from '@/utils/formatters';
import StreamCover from '@/components/Shared/StreamCover.vue';

const avatarStyle = (id: number) => ({ background: STREAM_GRADIENTS[id % STREAM_GRADIENTS.length] });

const router = useRouter();

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

const allStreams     = ref<Stream[]>([]);
const liveChallenges = ref<any[]>([]);
const loading        = ref(false);
const searchQuery    = ref('');
const activeTab      = ref<'all' | 'live' | 'challenges' | 'offline'>('all');

const isAuthenticated = computed(() => !!localStorage.getItem('auth_token'));
const liveStreams      = computed(() => allStreams.value.filter(s => s.is_live));
const offlineStreams   = computed(() => allStreams.value.filter(s => !s.is_live));

// ── Data loading ──────────────────────────────────────────────────────────────
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
    const params: Record<string, unknown> = { per_page: 20 };
    if (searchQuery.value) params.search = searchQuery.value;
    const res = await apiClient.get('/streams', { params });
    if (res.data.success) {
      const fresh: Stream[] = res.data.data.data ?? res.data.data ?? [];
      // Only update if data actually changed (avoids spurious re-renders on polls)
      if (JSON.stringify(fresh) !== JSON.stringify(allStreams.value))
        allStreams.value = fresh;
    }
  } catch {
    allStreams.value = [];
  } finally {
    loading.value = false;
  }
};

const timers: ReturnType<typeof setInterval>[] = [];

onMounted(() => {
  loadStreams();
  loadLiveChallenges();
  timers.push(setInterval(loadStreams, 30_000));
  timers.push(setInterval(loadLiveChallenges, 10_000));
});

onBeforeUnmount(() => {
  timers.forEach(clearInterval);
  if (searchTimer) clearTimeout(searchTimer);
});
</script>

<style scoped>
/* ── Page ── */
.streams-page { padding: 20px 0 48px; }

/* ── Top bar ── */
.streams-topbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.streams-topbar__left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  flex-wrap: wrap;
  min-width: 0;
}

.streams-topbar__title {
  font-size: 22px;
  font-weight: 800;
  color: rgb(var(--n8));
  margin: 0;
  letter-spacing: -.3px;
  white-space: nowrap;
}

.st-live-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(var(--r1), .1);
  border: 1px solid rgba(var(--r1), .28);
  color: rgb(var(--r1));
  font-size: 11px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: .04em;
  white-space: nowrap;
}

.st-challenge-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(var(--g1), .1);
  border: 1px solid rgba(var(--g1), .28);
  color: rgb(var(--g1));
  font-size: 11px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: .04em;
  white-space: nowrap;
  i { font-size: 12px; }
}

/* ── Go Live button ── */
.st-stream-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 18px;
  background: rgb(var(--g1));
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: 0 3px 14px rgba(var(--g1), .28);
  transition: all .2s;
  i { font-size: 16px; }
  &:hover { background: rgba(var(--g1), .84); transform: translateY(-1px); }

  &--ghost {
    background: rgba(var(--n8), .08);
    border: 1px solid rgba(var(--n8), .15);
    color: rgb(var(--n8));
    box-shadow: none;
    &:hover { background: rgba(var(--n8), .14); transform: translateY(-1px); }
  }
}

@media (max-width: 400px) {
  .btn-text { display: none; }
  .st-stream-btn { padding: 0 12px; }
}

/* ── Controls ── */
.streams-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

/* Tabs */
.st-tabs {
  display: flex;
  gap: 2px;
  background: rgb(var(--p2));
  border: 1px solid rgb(var(--n2));
  border-radius: 7px;
  padding: 4px;
  flex-wrap: wrap;
}

.st-tab {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 32px;
  padding: 0 13px;
  background: none;
  border: none;
  border-radius: 5px;
  font-size: 13px;
  font-weight: 600;
  color: rgb(var(--n3));
  cursor: pointer;
  transition: background .15s, color .15s;
  white-space: nowrap;
  i { font-size: 13px; }
  &:hover { background: rgba(var(--n8), .06); color: rgb(var(--n8)); }
  &.active { background: rgb(var(--p3)); color: rgb(var(--n8)); }
}

.st-tab-count {
  background: rgba(var(--n8), .1);
  color: rgb(var(--n3));
  font-size: 10px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 8px;
  .st-tab.active & { background: rgba(var(--g1), .18); color: rgb(var(--g1)); }
}

/* Live dot */
.st-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgb(var(--r1));
  display: inline-block;
  flex-shrink: 0;
  animation: pulse-dot 1.6s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: .4; transform: scale(1.4); }
}

/* Search */
.st-search {
  position: relative;
  width: 260px;
  flex-shrink: 0;
  @media (max-width: 640px) { width: 100%; }
}

.st-search__icon {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: rgb(var(--n3));
  pointer-events: none;
}

.st-search__input {
  width: 100%;
  height: 38px;
  background: rgb(var(--p2));
  border: 1px solid rgb(var(--n2));
  border-radius: 6px;
  color: rgb(var(--n8));
  font-size: 13px;
  padding: 0 34px;
  outline: none;
  font-family: var(--body-font);
  transition: border-color .2s;
  &::placeholder { color: rgb(var(--n3)); }
  &:focus { border-color: rgb(var(--g1)); }
}

.st-search__clear {
  position: absolute;
  right: 9px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgb(var(--n3));
  cursor: pointer;
  padding: 2px;
  font-size: 14px;
  line-height: 1;
  &:hover { color: rgb(var(--n8)); }
}

/* ── Section ── */
.st-section { margin-bottom: 32px; }

.st-section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.st-section-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(var(--n8), .25);
  flex-shrink: 0;
  &--red { background: rgb(var(--r1)); animation: pulse-dot 1.6s ease-in-out infinite; }
}

.st-section-title {
  font-size: 16px;
  font-weight: 700;
  color: rgb(var(--n8));
  margin: 0;
}

.st-section-count {
  font-size: 12px;
  color: rgb(var(--n3));
}

/* ── Grid ── */
.st-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  @media (max-width: 1200px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 768px)  { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  @media (max-width: 400px)  { grid-template-columns: 1fr; }
}

/* ── Card ── */
.st-card {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  transition: transform .22s ease;
  &:hover { transform: translateY(-4px); }
  &:hover .st-card__thumb-img { transform: scale(1.04); }
}

.st-card__thumb {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 6px;
  background: rgb(var(--p3));
}

.st-card__thumb-img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
  transition: transform .35s ease;
}

.st-card__thumb-bg {
  width: 100%; height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  &--challenge { background: linear-gradient(135deg,#b87820,#d4962e) !important; }
}

.st-card__thumb-icon { font-size: 2.2rem; color: rgba(255,255,255,.22); }

.st-card__thumb-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,.55) 100%);
  pointer-events: none;
}

.st-badge-live {
  position: absolute;
  top: 8px; left: 8px;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgb(var(--r1));
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 3px;
  box-shadow: 0 2px 8px rgba(var(--r1), .45);
}

.st-badge-viewers {
  position: absolute;
  bottom: 8px; left: 8px;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(0,0,0,.65);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 3px;
  backdrop-filter: blur(4px);
  i { font-size: 11px; }
}

/* Card info */
.st-card__info {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 9px 2px 4px;
}

.st-card__avatar {
  width: 34px; height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
  margin-top: 1px;
  &--challenge {
    background: rgba(var(--g1), .18) !important;
    color: rgb(var(--g1));
    i { font-size: 14px; }
  }
}

.st-card__meta { flex: 1; min-width: 0; }

.st-card__title {
  font-size: 13px;
  font-weight: 700;
  color: rgb(var(--n8));
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

.st-card__channel {
  font-size: 12px;
  color: rgb(var(--n3));
  margin: 0 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.st-vs { color: rgb(var(--r1)); font-weight: 800; font-size: 10px; }

.st-card__tags { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }

.st-tag {
  font-size: 10px;
  font-weight: 600;
  background: rgba(var(--n8), .08);
  color: rgb(var(--n3));
  padding: 2px 6px;
  border-radius: 3px;
  &--ebt { background: rgba(var(--g1), .14); color: rgb(var(--g1)); i { font-size: 10px; } }
}

.st-card__viewers {
  font-size: 11px;
  color: rgb(var(--n3));
  display: flex;
  align-items: center;
  gap: 3px;
  margin-left: auto;
  i { font-size: 11px; }
}

/* ── Skeleton ── */
.st-skeleton { border-radius: 8px; overflow: hidden; }

.st-skeleton__thumb {
  aspect-ratio: 16/9;
  border-radius: 6px;
  background: linear-gradient(90deg, rgb(var(--p2)) 25%, rgb(var(--p3)) 50%, rgb(var(--p2)) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.st-skeleton__info { display: flex; gap: 8px; padding: 9px 2px 4px; }

.st-skeleton__avatar {
  width: 34px; height: 34px;
  border-radius: 50%;
  flex-shrink: 0;
  background: linear-gradient(90deg, rgb(var(--p2)) 25%, rgb(var(--p3)) 50%, rgb(var(--p2)) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.st-skeleton__lines { flex: 1; display: flex; flex-direction: column; gap: 6px; padding-top: 4px; }

.st-skeleton__line {
  height: 12px;
  border-radius: 4px;
  background: linear-gradient(90deg, rgb(var(--p2)) 25%, rgb(var(--p3)) 50%, rgb(var(--p2)) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.st-l70 { width: 70%; }
.st-l50 { width: 50%; }

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Empty state ── */
.st-empty {
  text-align: center;
  padding: 64px 20px;
  color: rgb(var(--n3));
}

.st-empty__icon {
  font-size: 52px;
  display: block;
  margin-bottom: 16px;
  opacity: .3;
}

.st-empty__title { font-size: 18px; font-weight: 700; color: rgb(var(--n5)); margin: 0 0 8px; }
.st-empty__sub   { font-size: 14px; color: rgb(var(--n3)); margin: 0 0 24px; }

/* ── Primary button ── */
.st-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 20px;
  background: rgb(var(--g1));
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 0 3px 14px rgba(var(--g1), .28);
  transition: all .2s;
  &:hover { background: rgba(var(--g1), .83); color: #fff; transform: translateY(-1px); }
}
</style>
