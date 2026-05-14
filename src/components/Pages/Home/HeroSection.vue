<template>
  <section class="live-hero">

    <!-- ══ Loading skeleton ══ -->
    <div v-if="loading" class="live-hero__skeleton">
      <div class="sk-featured">
        <div class="sk-thumb"></div>
        <div class="sk-info">
          <div class="sk-line sk-l70"></div>
          <div class="sk-line sk-l45 mt-6"></div>
        </div>
      </div>
      <div class="sk-list">
        <div v-for="n in 4" :key="n" class="sk-item">
          <div class="sk-thumb-sm"></div>
          <div class="sk-item-info">
            <div class="sk-line sk-l80"></div>
            <div class="sk-line sk-l50 mt-4"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ Live streams ══ -->
    <template v-else-if="streams.length > 0">

      <!-- Header row -->
      <div class="live-hero__header">
        <div class="live-hero__header-left">
          <span class="live-pill"><span class="live-dot"></span>LIVE</span>
          <h2 class="live-hero__title">Live Now</h2>
        </div>
        <router-link to="/streams" class="live-hero__see-all">
          See all <i class="fas fa-arrow-right"></i>
        </router-link>
      </div>

      <!-- Main layout: large card + sidebar -->
      <div class="live-hero__layout">

        <!-- Featured card -->
        <div
          class="live-featured"
          @click="viewStream(activeStream.id)"
          @mouseenter="pauseAutoPlay"
          @mouseleave="resumeAutoPlay"
        >
          <div class="live-featured__thumb-wrap">
            <div class="live-featured__thumb" :style="getThumbStyle(activeStream)">
              <div class="live-featured__overlay"></div>
            </div>

            <!-- Top badges -->
            <div class="live-featured__top">
              <span class="badge-live"><span class="badge-live__dot"></span>LIVE</span>
              <span class="badge-viewers"><i class="fas fa-eye"></i> {{ formatViewers(activeStream.viewers_count) }}</span>
            </div>

            <!-- Bottom: title overlay -->
            <div class="live-featured__bottom">
              <p class="live-featured__stream-title">{{ activeStream.title }}</p>
              <span class="live-featured__tag" v-if="activeStream.game?.name">{{ activeStream.game.name }}</span>
            </div>
          </div>

          <!-- Info bar below thumb -->
          <div class="live-featured__info">
            <div class="live-featured__avatar" :style="getAvatarStyle(activeStream)">
              {{ getInitials(activeStream.user?.username || activeStream.title) }}
            </div>
            <div class="live-featured__meta">
              <p class="live-featured__channel">{{ activeStream.user?.username || 'eBetStream' }}</p>
              <p class="live-featured__cat">{{ activeStream.game?.name || 'Gaming' }}</p>
            </div>
            <button class="live-featured__follow" @click.stop>
              <i class="far fa-heart"></i><span class="follow-text"> Follow</span>
            </button>
          </div>

          <!-- Dot navigation -->
          <div v-if="streams.length > 1" class="live-featured__dots">
            <button
              v-for="(s, i) in streams.slice(0, 6)"
              :key="s.id"
              class="dot-btn"
              :class="{ active: i === activeIndex }"
              @click.stop="setActive(i)"
            ></button>
          </div>
        </div>

        <!-- Sidebar: other streams (desktop only) -->
        <div class="live-sidebar" v-if="streams.length > 1">
          <p class="live-sidebar__label">More channels</p>

          <div
            v-for="(stream, idx) in streams.slice(1, 5)"
            :key="stream.id"
            class="live-sidebar__card"
            :class="{ 'live-sidebar__card--active': idx + 1 === activeIndex }"
            @click="viewStream(stream.id)"
            @mouseenter="setActive(idx + 1)"
          >
            <div class="live-sidebar__thumb-wrap">
              <div class="live-sidebar__thumb" :style="getThumbStyle(stream)"></div>
              <span class="badge-live badge-live--xs"><span class="badge-live__dot"></span>LIVE</span>
              <span class="badge-viewers badge-viewers--xs"><i class="fas fa-eye"></i> {{ formatViewers(stream.viewers_count) }}</span>
            </div>
            <div class="live-sidebar__info">
              <div class="live-sidebar__avatar" :style="getAvatarStyle(stream)">
                {{ getInitials(stream.user?.username || stream.title) }}
              </div>
              <div class="live-sidebar__meta">
                <p class="live-sidebar__title">{{ stream.title }}</p>
                <p class="live-sidebar__channel">{{ stream.user?.username || 'eBetStream' }}</p>
                <p class="live-sidebar__cat">{{ stream.game?.name || 'Gaming' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile: horizontal scroll strip of other streams -->
        <div class="live-strip" v-if="streams.length > 1">
          <div
            v-for="(stream, idx) in streams.slice(1, 6)"
            :key="stream.id"
            class="live-strip__card"
            :class="{ 'live-strip__card--active': idx + 1 === activeIndex }"
            @click="viewStream(stream.id)"
            @touchstart="setActive(idx + 1)"
          >
            <div class="live-strip__thumb" :style="getThumbStyle(stream)">
              <span class="badge-live badge-live--xs"><span class="badge-live__dot"></span>LIVE</span>
            </div>
            <p class="live-strip__name">{{ stream.user?.username || 'Stream' }}</p>
          </div>
        </div>
      </div>
    </template>

    <!-- ══ No streams — Hero Banner ══ -->
    <div v-else class="hero-banner">
      <!-- Glow blobs -->
      <div class="hero-banner__blob hero-banner__blob--1"></div>
      <div class="hero-banner__blob hero-banner__blob--2"></div>

      <div class="hero-banner__content">
        <!-- Eyebrow -->
        <div class="hero-banner__eyebrow">
          <span class="live-pill"><span class="live-dot"></span>STREAMING PLATFORM</span>
        </div>

        <!-- Title -->
        <h1 class="hero-banner__title">
          Compete.<br />Stream.<br /><span class="hero-accent">Win.</span>
        </h1>

        <!-- Sub -->
        <p class="hero-banner__sub">
          Join championships, challenge players, stream live and earn real rewards on the ultimate gaming platform.
        </p>

        <!-- CTA buttons -->
        <div class="hero-banner__actions">
          <router-link to="/create-account" class="hero-btn hero-btn--primary">
            Get Started <i class="fas fa-arrow-right"></i>
          </router-link>
          <router-link to="/streams" class="hero-btn hero-btn--ghost">
            <span class="live-dot live-dot--sm"></span> Watch Live
          </router-link>
        </div>

        <!-- Stats (hidden on xs) -->
        <div class="hero-banner__stats">
          <div class="hero-stat">
            <span class="hero-stat__val">10K+</span>
            <span class="hero-stat__lbl">Players</span>
          </div>
          <div class="hero-stat__sep"></div>
          <div class="hero-stat">
            <span class="hero-stat__val">500+</span>
            <span class="hero-stat__lbl">Events</span>
          </div>
          <div class="hero-stat__sep"></div>
          <div class="hero-stat">
            <span class="hero-stat__val">50+</span>
            <span class="hero-stat__lbl">Games</span>
          </div>
        </div>
      </div>

      <!-- Right visual (desktop only) -->
      <div class="hero-banner__visual">
        <div class="hero-visual-card">
          <div class="hero-visual-card__top">
            <span class="badge-live"><span class="badge-live__dot"></span>LIVE</span>
            <span class="badge-viewers"><i class="fas fa-eye"></i> 4.2K</span>
          </div>
          <div class="hero-visual-card__title">Championship Finals</div>
          <div class="hero-visual-card__row">
            <div class="hero-visual-avatar">E</div>
            <div class="hero-visual-meta">
              <p>eBetStream Pro</p>
              <p>PUBG Mobile</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import apiClient from "@/utils/axios";

interface Stream {
  id: number;
  title: string;
  viewers_count?: number;
  thumbnail_url?: string;
  user?: { username: string; avatar_url?: string };
  game?: { name: string };
}

const router = useRouter();
const streams = ref<Stream[]>([]);
const loading = ref(false);
const activeIndex = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

const activeStream = computed(() => streams.value[activeIndex.value] ?? streams.value[0]);

const loadStreams = async () => {
  try {
    loading.value = true;
    const res = await apiClient.get("/streams", { params: { status: "live", per_page: 6 } });
    if (res.data.success) {
      const data = res.data.data;
      streams.value = Array.isArray(data) ? data : data?.data || [];
    }
  } catch { streams.value = []; }
  finally {
    loading.value = false;
    if (streams.value.length > 1) startTimer();
  }
};

const setActive = (i: number) => { activeIndex.value = i; };
const startTimer = () => { timer = setInterval(() => { activeIndex.value = (activeIndex.value + 1) % Math.min(streams.value.length, 6); }, 5000); };
const pauseAutoPlay = () => { if (timer) clearInterval(timer); };
const resumeAutoPlay = () => { if (streams.value.length > 1) startTimer(); };

const viewStream = (id: number) => router.push(`/streams/${id}`);
const formatViewers = (n?: number) => !n ? "0" : n >= 1000 ? (n / 1000).toFixed(1) + "K" : String(n);

const gradients = [
  "linear-gradient(135deg,#febd56,#d4962e)",
  "linear-gradient(135deg,#1a9fff,#0057c8)",
  "linear-gradient(135deg,#ff4d6a,#a01030)",
  "linear-gradient(135deg,#00c8a0,#007a63)",
  "linear-gradient(135deg,#ff9f00,#c86f00)",
  "linear-gradient(135deg,#d4962e,#b87820)",
];

const getThumbStyle  = (s: Stream) => s.thumbnail_url ? { backgroundImage: `url(${s.thumbnail_url})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: gradients[s.id % gradients.length] };
const getAvatarStyle = (s: Stream) => s.user?.avatar_url ? { backgroundImage: `url(${s.user.avatar_url})`, backgroundSize: "cover" } : { background: gradients[s.id % gradients.length] };
const getInitials    = (n: string) => n ? n.slice(0, 2).toUpperCase() : "?";

const particleStyle = (n: number) => ({
  left: `${(n * 31 + 7) % 100}%`,
  top: `${(n * 17 + 11) % 100}%`,
  width: `${4 + (n % 5) * 2}px`,
  height: `${4 + (n % 5) * 2}px`,
  animationDelay: `${(n * 0.4) % 3}s`,
  animationDuration: `${3 + (n % 4)}s`,
});

onMounted(() => loadStreams());
onUnmounted(() => { if (timer) clearInterval(timer); });
</script>

<style scoped>
/* ═══════════════════════════════════════════
   ROOT
═══════════════════════════════════════════ */
.live-hero {
  padding: 20px 0 4px;
}

/* ═══════════════════════════════════════════
   HEADER ROW
═══════════════════════════════════════════ */
.live-hero__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.live-hero__header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.live-hero__title {
  font-size: 18px;
  font-weight: 700;
  color: rgb(var(--n8));
  margin: 0;
}

.live-hero__see-all {
  font-size: 13px;
  font-weight: 600;
  color: rgb(var(--g1));
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 3px;
  white-space: nowrap;
  &:hover { opacity: 0.75; }
}

/* ═══════════════════════════════════════════
   LIVE PILL + DOT
═══════════════════════════════════════════ */
.live-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(var(--r1), 0.12);
  border: 1px solid rgba(var(--r1), 0.3);
  color: rgb(var(--r1));
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 3px 9px;
  border-radius: 12px;
}

.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgb(var(--r1));
  flex-shrink: 0;
  animation: pulseDot 1.6s ease-in-out infinite;
}

.live-dot--sm { width: 6px; height: 6px; }

@keyframes pulseDot {
  0%,100% { opacity:1; transform:scale(1); }
  50%      { opacity:.45; transform:scale(1.4); }
}

/* ═══════════════════════════════════════════
   BADGES
═══════════════════════════════════════════ */
.badge-live {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgb(var(--r1));
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .06em;
  padding: 2px 7px;
  border-radius: 3px;
  text-transform: uppercase;
  box-shadow: 0 2px 8px rgba(var(--r1),.45);

  &--xs { font-size: 9px; padding: 2px 5px; }
}

.badge-live__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255,255,255,.9);
  animation: pulseDot 1.6s ease-in-out infinite;
}

.badge-viewers {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(0,0,0,.6);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 3px;
  backdrop-filter: blur(4px);
  i { font-size: 11px; }
  &--xs { font-size: 10px; padding: 2px 5px; }
}

/* ═══════════════════════════════════════════
   MAIN LAYOUT (desktop: featured + sidebar)
═══════════════════════════════════════════ */
.live-hero__layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  grid-template-rows: auto;
  gap: 14px;

  /* sidebar col (desktop) */
  @media (max-width: 860px) { grid-template-columns: 1fr; }
}

/* ─── Featured card ─── */
.live-featured {
  cursor: pointer;
  min-width: 0;
}

.live-featured__thumb-wrap {
  position: relative;
  aspect-ratio: 16/9;
  border-radius: 8px;
  overflow: hidden;
}

.live-featured__thumb {
  width: 100%;
  height: 100%;
  transition: transform .4s ease, filter .3s ease;
  .live-featured:hover & { transform: scale(1.03); filter: brightness(1.08); }
}

.live-featured__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 35%, rgba(0,0,0,.75) 100%);
  pointer-events: none;
}

.live-featured__top {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 6px;
  z-index: 4;
}

.live-featured__bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 14px 10px;
  z-index: 4;
}

.live-featured__stream-title {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 4px;
  text-shadow: 0 1px 4px rgba(0,0,0,.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.live-featured__tag {
  display: inline-block;
  background: rgba(var(--g1),.88);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 3px;
}

/* Info bar */
.live-featured__info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 4px 4px;
}

.live-featured__avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
  border: 2px solid rgba(var(--g1),.4);
}

.live-featured__meta { flex: 1; min-width: 0; }

.live-featured__channel {
  font-size: 13px;
  font-weight: 600;
  color: rgb(var(--n8));
  margin: 0 0 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.live-featured__cat {
  font-size: 12px;
  color: rgb(var(--n3));
  margin: 0;
}

.live-featured__follow {
  height: 30px;
  padding: 0 14px;
  background: rgb(var(--g1));
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  transition: background .2s, transform .15s;
  &:hover { background: rgba(var(--g1),.82); transform: scale(1.03); }
  i { font-size: 13px; }
}

/* Dot indicators */
.live-featured__dots {
  display: flex;
  gap: 5px;
  justify-content: center;
  margin-top: 10px;
}

.dot-btn {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: rgba(var(--n8),.2);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all .25s;
  &.active { width: 20px; border-radius: 3px; background: rgb(var(--g1)); }
}

/* ─── Sidebar (desktop) ─── */
.live-sidebar {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;

  /* hide on tablet/mobile */
  @media (max-width: 860px) { display: none; }
}

.live-sidebar__label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: rgb(var(--n3));
  margin: 0 0 2px;
}

.live-sidebar__card {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid transparent;
  background: rgb(var(--p2));
  transition: border-color .2s, transform .2s;

  &:hover, &--active {
    border-color: rgba(var(--g1),.4);
    transform: translateX(3px);
  }
}

.live-sidebar__thumb-wrap {
  position: relative;
  width: 100%;
  height: 80px;
  overflow: hidden;
  flex-shrink: 0;
}

.live-sidebar__thumb {
  width: 100%; height: 100%;
  transition: transform .3s;
  .live-sidebar__card:hover & { transform: scale(1.04); }
}

.live-sidebar__info {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 8px;
}

.live-sidebar__avatar {
  width: 24px; height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.live-sidebar__meta { flex: 1; min-width: 0; }

.live-sidebar__title {
  font-size: 11px; font-weight: 600;
  color: rgb(var(--n8)); margin: 0 0 1px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.live-sidebar__channel {
  font-size: 10px; color: rgb(var(--n3)); margin: 0 0 1px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.live-sidebar__cat {
  font-size: 10px; color: rgb(var(--n3)); margin: 0; opacity: .7;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

/* ─── Mobile horizontal strip ─── */
.live-strip {
  display: none;
  grid-column: 1 / -1;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }

  @media (max-width: 860px) { display: flex; }
}

.live-strip__card {
  flex: 0 0 100px;
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: border-color .2s;

  &--active, &:hover { border-color: rgb(var(--g1)); }
}

.live-strip__thumb {
  position: relative;
  width: 100%;
  height: 60px;
  background: rgb(var(--p3));
}

.live-strip__name {
  font-size: 11px;
  font-weight: 600;
  color: rgb(var(--n5));
  padding: 4px 6px 5px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: rgb(var(--p2));
}

/* ═══════════════════════════════════════════
   HERO BANNER (no live streams)
═══════════════════════════════════════════ */
.hero-banner {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: rgb(var(--p2));
  border: 1px solid rgb(var(--n2));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 48px 48px 48px 52px;
  min-height: 320px;

  @media (max-width: 900px) { padding: 40px 36px; min-height: auto; }
  @media (max-width: 640px) { padding: 32px 24px; flex-direction: column; gap: 32px; }
  @media (max-width: 400px) { padding: 28px 20px; }
}

/* Animated blobs */
.hero-banner__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;

  &--1 {
    width: 340px; height: 340px;
    background: rgba(var(--g1), 0.13);
    top: -80px; left: -80px;
  }
  &--2 {
    width: 260px; height: 260px;
    background: rgba(var(--r1), 0.06);
    bottom: -60px; right: 200px;
  }
}

.hero-banner__content {
  position: relative;
  z-index: 2;
  flex: 1;
  min-width: 0;
  max-width: 520px;

  @media (max-width: 640px) { max-width: 100%; text-align: center; }
}

.hero-banner__eyebrow { margin: 0 0 18px; }

.hero-banner__title {
  font-size: clamp(30px, 5vw, 54px);
  font-weight: 900;
  color: rgb(var(--n8));
  line-height: 1.1;
  margin: 0 0 18px;
  letter-spacing: -1px;
}

.hero-accent {
  background: linear-gradient(90deg, rgb(var(--g1)) 0%, #fcd89a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-banner__sub {
  font-size: clamp(13px, 2vw, 15px);
  color: rgb(var(--n3));
  line-height: 1.65;
  margin: 0 0 28px;
}

.hero-banner__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 32px;

  @media (max-width: 640px) { justify-content: center; }
}

/* Buttons */
.hero-btn {
  height: 42px;
  padding: 0 22px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  transition: all .2s;
  white-space: nowrap;

  &--primary {
    background: rgb(var(--g1));
    color: #fff;
    box-shadow: 0 4px 20px rgba(var(--g1),.35);
    &:hover { background: rgba(var(--g1),.85); color:#fff; transform: translateY(-2px); box-shadow: 0 6px 28px rgba(var(--g1),.45); }
  }

  &--ghost {
    background: rgba(var(--n8),.08);
    color: rgb(var(--n8));
    border: 1px solid rgba(var(--n8),.18);
    &:hover { background: rgba(var(--n8),.15); color:rgb(var(--n8)); transform: translateY(-2px); }
  }
}

/* Stats row */
.hero-banner__stats {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 400px) { display: none; }
  @media (max-width: 640px) { justify-content: center; }
}

.hero-stat { display: flex; flex-direction: column; gap: 2px; }
.hero-stat__val { font-size: 22px; font-weight: 800; color: rgb(var(--n8)); line-height: 1; }
.hero-stat__lbl { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: rgb(var(--n3)); }
.hero-stat__sep { width: 1px; height: 32px; background: rgb(var(--n2)); }

/* Right visual card (desktop only) */
.hero-banner__visual {
  position: relative;
  z-index: 2;
  flex-shrink: 0;

  @media (max-width: 900px) { display: none; }
}

.hero-visual-card {
  width: 220px;
  background: rgb(var(--p3));
  border: 1px solid rgb(var(--n2));
  border-radius: 10px;
  padding: 16px;
}

.hero-visual-card__top {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}

.hero-visual-card__title {
  font-size: 13px;
  font-weight: 700;
  color: rgb(var(--n8));
  margin-bottom: 10px;
}

.hero-visual-card__row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hero-visual-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: rgb(var(--g1));
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hero-visual-meta {
  p { font-size: 12px; margin: 0; line-height: 1.4;
    &:first-child { color: rgb(var(--n8)); font-weight: 600; }
    &:last-child  { color: rgb(var(--n3)); }
  }
}

/* ═══════════════════════════════════════════
   SKELETON
═══════════════════════════════════════════ */
.live-hero__skeleton {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 14px;
  @media (max-width: 860px) { grid-template-columns: 1fr; }
}

.sk-featured {
  background: rgb(var(--p2));
  border-radius: 8px;
  overflow: hidden;
}

.sk-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  @media (max-width: 860px) { display: none; }
}

.sk-item {
  display: flex;
  gap: 8px;
  background: rgb(var(--p2));
  border-radius: 6px;
  overflow: hidden;
  height: 72px;
}

.sk-item-info {
  flex: 1;
  padding: 8px;
}

.sk-thumb {
  aspect-ratio: 16/9;
  @extend .sk-shimmer;
}

.sk-thumb-sm {
  width: 120px;
  height: 72px;
  flex-shrink: 0;
  @extend .sk-shimmer;
}

.sk-body { padding: 10px; }

.sk-shimmer {
  background: linear-gradient(90deg, rgb(var(--p2)) 25%, rgb(var(--p3)) 50%, rgb(var(--p2)) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.sk-line {
  height: 12px;
  border-radius: 4px;
  background: linear-gradient(90deg, rgb(var(--p2)) 25%, rgb(var(--p3)) 50%, rgb(var(--p2)) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.sk-l70 { width: 70%; }
.sk-l80 { width: 80%; }
.sk-l50 { width: 50%; }
.sk-l45 { width: 45%; }
.mt-4   { margin-top: 4px; }
.mt-6   { margin-top: 6px; }

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.follow-text {
  @media (max-width: 480px) { display: none; }
}
</style>
