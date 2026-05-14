<template>
  <div class="sc" :class="{ 'sc--live': isLive, 'sc--ended': isEnded, 'sc--challenge': isChallenge }">

    <!-- ① Full-bleed background gradient -->
    <div class="sc__bg" :style="{ background: scheme.bg }" />

    <!-- ② Geometric shapes (depth) -->
    <div class="sc__shapes">
      <div class="sc__shape sc__shape--circle" :style="{ background: scheme.accent + '18' }" />
      <div class="sc__shape sc__shape--ring"   :style="{ borderColor: scheme.accent + '22' }" />
      <div class="sc__shape sc__shape--ring2"  :style="{ borderColor: scheme.accent + '0f' }" />
      <div class="sc__shape sc__shape--tri" />
    </div>

    <!-- ③ Scan-line texture -->
    <div class="sc__scanlines" />

    <!-- ④ Vignette -->
    <div class="sc__vignette" />

    <!-- ⑤ TOP BAR -->
    <div class="sc__topbar">
      <!-- Brand -->
      <div class="sc__brand">
        <span class="sc__brand-icon">
          <i class="fas fa-bolt" />
        </span>
        <span class="sc__brand-name">eBetStream</span>
      </div>

      <!-- LIVE / VOD badge -->
      <span v-if="isLive" class="sc__live-badge">
        <span class="sc__live-dot" />
        LIVE
      </span>
      <span v-else-if="isEnded" class="sc__vod-badge">
        <i class="fas fa-play" />
        VOD
      </span>
      <span v-else-if="isChallenge" class="sc__challenge-badge">
        <i class="fas fa-swords" />
        DUEL
      </span>

      <!-- Viewers -->
      <span v-if="isLive && viewerCount > 0" class="sc__viewers">
        <i class="fas fa-eye" />
        {{ fmtViewers(viewerCount) }}
      </span>
    </div>

    <!-- ⑥ VIEWFINDER corners -->
    <span class="sc__corner sc__corner--tl" :style="{ borderColor: scheme.accent }" />
    <span class="sc__corner sc__corner--tr" :style="{ borderColor: scheme.accent }" />
    <span class="sc__corner sc__corner--bl" :style="{ borderColor: scheme.accent }" />
    <span class="sc__corner sc__corner--br" :style="{ borderColor: scheme.accent }" />

    <!-- ⑦ CENTER: avatar + username -->
    <div class="sc__center">
      <div class="sc__avatar-wrap">
        <div class="sc__avatar-glow" :style="{ boxShadow: `0 0 40px ${scheme.accent}55, 0 0 80px ${scheme.accent}22` }" />
        <div class="sc__avatar" :style="{ background: scheme.avatarBg }">
          <i v-if="isChallenge" class="fas fa-fist-raised sc__avatar-icon" />
          <span v-else class="sc__avatar-initials">{{ avatarText }}</span>
        </div>
      </div>
      <span class="sc__streamer-name">{{ displayUsername }}</span>
    </div>

    <!-- ⑧ BIG game icon watermark -->
    <div class="sc__game-icon" :style="{ color: scheme.accent }">
      <i :class="['fas', scheme.icon]" />
    </div>

    <!-- ⑩ eBetStream diagonal watermark -->
    <div class="sc__watermark" aria-hidden="true">
      <div class="sc__watermark-inner">
        <i class="fas fa-bolt sc__watermark-bolt" />
        <span class="sc__watermark-text">eBetStream</span>
        <i class="fas fa-bolt sc__watermark-bolt" />
        <span class="sc__watermark-text">eBetStream</span>
        <i class="fas fa-bolt sc__watermark-bolt" />
        <span class="sc__watermark-text">eBetStream</span>
      </div>
    </div>

    <!-- ⑨ BOTTOM BAR -->
    <div class="sc__bottombar">
      <div class="sc__bottombar-inner">
        <div class="sc__title">{{ displayTitle }}</div>
        <div class="sc__meta-row">
          <span v-if="game || category" class="sc__tag" :style="{ background: scheme.accent, color: scheme.tagText }">
            {{ game || category }}
          </span>
          <span v-if="isEnded && followerCount" class="sc__meta-viewers">
            <i class="far fa-heart" /> {{ followerCount }}
          </span>
        </div>
      </div>
      <!-- Accent line -->
      <div class="sc__accent-line" :style="{ background: `linear-gradient(90deg, ${scheme.accent}, transparent)` }" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  streamId?: number;
  title?: string;
  username?: string;
  game?: string;
  category?: string;
  isLive?: boolean;
  isEnded?: boolean;
  isChallenge?: boolean;
  viewerCount?: number;
  followerCount?: number;
  thumbnailUrl?: string;
  variant?: string;
}>();

/* ── Color schemes ─────────────────────────────────────────────────────────── */
interface Scheme {
  bg: string;
  accent: string;
  avatarBg: string;
  icon: string;
  tagText: string;
}

const SCHEMES: Record<string, Scheme> = {
  fps: {
    bg: 'linear-gradient(160deg,#0d0000 0%,#1a0000 30%,#3d0008 60%,#1a0304 100%)',
    accent: '#ff3c3c', avatarBg: 'linear-gradient(135deg,#8b0000,#ff3c3c)',
    icon: 'fa-crosshairs', tagText: '#fff',
  },
  shooter: {
    bg: 'linear-gradient(160deg,#0d0000 0%,#1a0000 30%,#3d0008 60%,#1a0304 100%)',
    accent: '#ff3c3c', avatarBg: 'linear-gradient(135deg,#8b0000,#ff3c3c)',
    icon: 'fa-crosshairs', tagText: '#fff',
  },
  moba: {
    bg: 'linear-gradient(160deg,#03000d 0%,#0a0030 35%,#1a006e 65%,#0b0020 100%)',
    accent: '#7c3aed', avatarBg: 'linear-gradient(135deg,#3b0090,#7c3aed)',
    icon: 'fa-dragon', tagText: '#fff',
  },
  strategy: {
    bg: 'linear-gradient(160deg,#03000d 0%,#0a0030 35%,#1a006e 65%,#0b0020 100%)',
    accent: '#818cf8', avatarBg: 'linear-gradient(135deg,#3730a3,#818cf8)',
    icon: 'fa-chess', tagText: '#fff',
  },
  sports: {
    bg: 'linear-gradient(160deg,#000d02 0%,#001a06 35%,#00451a 65%,#001a08 100%)',
    accent: '#10b981', avatarBg: 'linear-gradient(135deg,#064e3b,#10b981)',
    icon: 'fa-futbol', tagText: '#fff',
  },
  football: {
    bg: 'linear-gradient(160deg,#000d02 0%,#001a06 35%,#00451a 65%,#001a08 100%)',
    accent: '#10b981', avatarBg: 'linear-gradient(135deg,#064e3b,#10b981)',
    icon: 'fa-futbol', tagText: '#fff',
  },
  fifa: {
    bg: 'linear-gradient(160deg,#000d02 0%,#001a06 35%,#00451a 65%,#001a08 100%)',
    accent: '#10b981', avatarBg: 'linear-gradient(135deg,#064e3b,#10b981)',
    icon: 'fa-futbol', tagText: '#fff',
  },
  racing: {
    bg: 'linear-gradient(160deg,#00060d 0%,#00123a 35%,#003880 65%,#000e2a 100%)',
    accent: '#38bdf8', avatarBg: 'linear-gradient(135deg,#0c4a6e,#38bdf8)',
    icon: 'fa-flag-checkered', tagText: '#000',
  },
  battle: {
    bg: 'linear-gradient(160deg,#0d0600 0%,#1f0e00 35%,#5c2d00 65%,#1f0e00 100%)',
    accent: '#f59e0b', avatarBg: 'linear-gradient(135deg,#92400e,#f59e0b)',
    icon: 'fa-parachute-box', tagText: '#000',
  },
  royale: {
    bg: 'linear-gradient(160deg,#0d0600 0%,#1f0e00 35%,#5c2d00 65%,#1f0e00 100%)',
    accent: '#f59e0b', avatarBg: 'linear-gradient(135deg,#92400e,#f59e0b)',
    icon: 'fa-parachute-box', tagText: '#000',
  },
  casino: {
    bg: 'linear-gradient(160deg,#0a0700 0%,#1c1200 35%,#3d2900 65%,#1c1200 100%)',
    accent: '#d4af37', avatarBg: 'linear-gradient(135deg,#78350f,#d4af37)',
    icon: 'fa-coins', tagText: '#000',
  },
  poker: {
    bg: 'linear-gradient(160deg,#0a0700 0%,#1c1200 35%,#3d2900 65%,#1c1200 100%)',
    accent: '#d4af37', avatarBg: 'linear-gradient(135deg,#78350f,#d4af37)',
    icon: 'fa-coins', tagText: '#000',
  },
  rpg: {
    bg: 'linear-gradient(160deg,#00080d 0%,#001a25 35%,#004455 65%,#001a25 100%)',
    accent: '#2dd4bf', avatarBg: 'linear-gradient(135deg,#134e4a,#2dd4bf)',
    icon: 'fa-hat-wizard', tagText: '#000',
  },
  challenge: {
    bg: 'linear-gradient(160deg,#0d0500 0%,#2a0f00 35%,#5c2500 65%,#2a0f00 100%)',
    accent: '#febd56', avatarBg: 'linear-gradient(135deg,#92400e,#febd56)',
    icon: 'fa-fist-raised', tagText: '#000',
  },
};

const FALLBACK_KEYS = ['fps', 'moba', 'sports', 'racing', 'battle', 'rpg', 'casino', 'strategy'];

const scheme = computed((): Scheme => {
  if (props.isChallenge) return SCHEMES.challenge;
  const haystack = [props.game, props.category, props.variant].filter(Boolean).join(' ').toLowerCase();
  for (const key of Object.keys(SCHEMES)) {
    if (key !== 'challenge' && haystack.includes(key)) return SCHEMES[key];
  }
  return SCHEMES[FALLBACK_KEYS[(props.streamId ?? 0) % FALLBACK_KEYS.length]];
});

const avatarText    = computed(() => ((props.username || props.title || '?').slice(0, 2).toUpperCase()));
const displayTitle  = computed(() => (props.title || 'Untitled Stream').slice(0, 48) + ((props.title?.length ?? 0) > 48 ? '…' : ''));
const displayUsername = computed(() => props.username || 'eBetStream');
const game          = computed(() => props.game || '');
const category      = computed(() => props.category || '');
const viewerCount   = computed(() => props.viewerCount ?? 0);
const followerCount = computed(() => props.followerCount ?? 0);

const fmtViewers = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
</script>

<style scoped>
/* ══════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════ */
.sc {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 8px;
  isolation: isolate;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  cursor: pointer;
  transition: transform .25s ease;
  &:hover { transform: scale(1.012); }
}

/* ── BG ── */
.sc__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

/* ── GEOMETRIC SHAPES ── */
.sc__shapes { position: absolute; inset: 0; z-index: 1; pointer-events: none; overflow: hidden; }

.sc__shape {
  position: absolute;
  border-radius: 50%;
}

.sc__shape--circle {
  width: 55%;
  aspect-ratio: 1;
  top: -15%;
  right: -15%;
}

.sc__shape--ring {
  width: 70%;
  aspect-ratio: 1;
  bottom: -30%;
  left: -20%;
  background: transparent !important;
  border: 1px solid;
  border-radius: 50%;
}

.sc__shape--ring2 {
  width: 110%;
  aspect-ratio: 1;
  bottom: -50%;
  left: -30%;
  background: transparent !important;
  border: 1px solid;
  border-radius: 50%;
}

.sc__shape--tri {
  width: 0; height: 0;
  border-radius: 0;
  border-left: 80px solid transparent;
  border-right: 0px solid transparent;
  border-bottom: 140px solid rgba(255,255,255,.025);
  top: 0; right: 0;
}

/* ══════════════════════════════════════════════════════
   DIAGONAL WATERMARK
══════════════════════════════════════════════════════ */
.sc__watermark {
  position: absolute;
  inset: 0;
  z-index: 6;
  overflow: hidden;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sc__watermark-inner {
  display: flex;
  align-items: center;
  gap: 14px;
  white-space: nowrap;
  transform: rotate(-28deg) scale(1.4);
  opacity: .065;
  user-select: none;
}

.sc__watermark-text {
  font-size: 18px;
  font-weight: 900;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: #fff;
  font-style: italic;
}

.sc__watermark-bolt {
  font-size: 12px;
  color: #fff;
  opacity: .6;
}

/* ── SCANLINES ── */
.sc__scanlines {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,.06) 2px,
    rgba(0,0,0,.06) 4px
  );
  pointer-events: none;
}

/* ── VIGNETTE ── */
.sc__vignette {
  position: absolute;
  inset: 0;
  z-index: 3;
  background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,.7) 100%);
  pointer-events: none;
}

/* ══════════════════════════════════════════════════════
   TOP BAR
══════════════════════════════════════════════════════ */
.sc__topbar {
  position: absolute;
  top: 0; left: 0; right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  background: linear-gradient(to bottom, rgba(0,0,0,.72) 0%, transparent 100%);
}

/* Brand */
.sc__brand {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: auto;
}

.sc__brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: #febd56;
  border-radius: 3px;
  font-size: 9px;
  color: #000;
  font-weight: 900;
  flex-shrink: 0;
}

.sc__brand-name {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: rgba(255,255,255,.7);
}

/* LIVE badge */
.sc__live-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 3px;
  background: #dc2626;
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .1em;
  text-transform: uppercase;
  box-shadow: 0 0 14px rgba(220,38,38,.7);
}

.sc__live-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #fff;
  animation: scBlink 1.2s ease-in-out infinite;
}

@keyframes scBlink {
  0%,100% { opacity: 1; transform: scale(1); }
  50%      { opacity: .2; transform: scale(1.5); }
}

/* VOD badge */
.sc__vod-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 3px;
  background: rgba(255,255,255,.15);
  border: 1px solid rgba(255,255,255,.2);
  color: rgba(255,255,255,.7);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  backdrop-filter: blur(4px);
}

/* Challenge badge */
.sc__challenge-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 3px;
  background: #febd56;
  color: #000;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
  box-shadow: 0 0 14px rgba(254,189,86,.5);
}

/* Viewer count */
.sc__viewers {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 3px;
  background: rgba(0,0,0,.5);
  color: rgba(255,255,255,.85);
  font-size: 10px;
  font-weight: 600;
  backdrop-filter: blur(4px);
  i { font-size: 10px; }
}

/* ══════════════════════════════════════════════════════
   VIEWFINDER CORNERS
══════════════════════════════════════════════════════ */
.sc__corner {
  position: absolute;
  z-index: 10;
  width: 14px;
  height: 14px;
  border-style: solid;
  border-color: #febd56;
  opacity: .7;
  pointer-events: none;
}
.sc__corner--tl { top: 6px; left: 6px;   border-width: 1.5px 0 0 1.5px; }
.sc__corner--tr { top: 6px; right: 6px;  border-width: 1.5px 1.5px 0 0; }
.sc__corner--bl { bottom: 6px; left: 6px;  border-width: 0 0 1.5px 1.5px; }
.sc__corner--br { bottom: 6px; right: 6px;  border-width: 0 1.5px 1.5px 0; }

/* ══════════════════════════════════════════════════════
   CENTER: AVATAR + USERNAME
══════════════════════════════════════════════════════ */
.sc__center {
  position: absolute;
  inset: 0;
  z-index: 8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  /* push up to leave room for bottom bar */
  padding-bottom: 26%;
}

.sc__avatar-wrap {
  position: relative;
  width: 52px;
  height: 52px;
  flex-shrink: 0;
}

.sc__avatar-glow {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  pointer-events: none;
}

.sc__avatar {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255,255,255,.25);
  overflow: hidden;
}

.sc__avatar-initials {
  font-size: 20px;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 1px 6px rgba(0,0,0,.6);
  letter-spacing: -.5px;
}

.sc__avatar-icon {
  font-size: 18px;
  color: #fff;
}

.sc__streamer-name {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255,255,255,.75);
  letter-spacing: .08em;
  text-transform: uppercase;
  text-shadow: 0 1px 4px rgba(0,0,0,.8);
}

/* ══════════════════════════════════════════════════════
   GAME ICON WATERMARK
══════════════════════════════════════════════════════ */
.sc__game-icon {
  position: absolute;
  right: 10px;
  bottom: 38px;
  z-index: 5;
  font-size: 36px;
  opacity: .12;
  pointer-events: none;
  filter: blur(0.5px);
}

/* ══════════════════════════════════════════════════════
   BOTTOM BAR
══════════════════════════════════════════════════════ */
.sc__bottombar {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  z-index: 9;
  background: linear-gradient(to top, rgba(0,0,0,.88) 0%, rgba(0,0,0,.55) 70%, transparent 100%);
  padding: 20px 10px 8px;
}

.sc__accent-line {
  height: 2px;
  border-radius: 1px;
  margin-top: 6px;
  opacity: .8;
}

.sc__title {
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  line-height: 1.3;
  text-shadow: 0 1px 6px rgba(0,0,0,.9);
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 4px;
}

.sc__meta-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.sc__tag {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: .09em;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 3px;
}

.sc__meta-viewers {
  font-size: 10px;
  color: rgba(255,255,255,.55);
  display: flex;
  align-items: center;
  gap: 3px;
  i { font-size: 9px; }
}

/* ══════════════════════════════════════════════════════
   LIVE: border glow
══════════════════════════════════════════════════════ */
.sc--live::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 8px;
  box-shadow: inset 0 0 0 1.5px rgba(220,38,38,.5);
  z-index: 11;
  pointer-events: none;
}

/* ══════════════════════════════════════════════════════
   ENDED: desaturated + play overlay
══════════════════════════════════════════════════════ */
.sc--ended .sc__bg { filter: saturate(.3) brightness(.55); }
.sc--ended .sc__shapes { opacity: .4; }
.sc--ended .sc__center { opacity: .7; }
</style>
