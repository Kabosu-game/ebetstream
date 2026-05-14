<template>
  <div class="sc-page">

    <!-- ══════════════════════════════════════════════════════
         PHASE SETUP — Configuration du stream
    ══════════════════════════════════════════════════════ -->
    <div v-if="phase === 'setup'" class="sc-setup">
      <button class="sc-back" @click="$router.push('/streams')">
        <i class="fas fa-arrow-left"></i>{{ $t('ui.retour') }}</button>

      <div class="sc-setup__header">
        <h1 class="sc-setup__title">
          <i class="fas fa-video sc-setup__icon"></i>
          Créer votre Stream
        </h1>
        <p class="sc-setup__sub">{{ $t('ui.configurez_votre_stream_puis_d_marrez_en_direct_depuis_votre') }}</p>
      </div>

      <div class="sc-setup__card">
        <form @submit.prevent="handleSubmit">
          <div class="sc-field">
            <label class="sc-label">{{ $t('ui.titre_du_stream') }}</label>
            <input v-model="form.title" type="text" class="sc-input" :placeholder="$t('ui.ex_gaming_session_soir')" required maxlength="255" />
          </div>

          <div class="sc-field">
            <label class="sc-label">{{ $t('common.description') }}</label>
            <textarea v-model="form.description" class="sc-input sc-textarea" :placeholder="$t('ui.d_crivez_votre_stream')" rows="3" maxlength="1000"></textarea>
          </div>

          <div class="sc-row-2">
            <div class="sc-field">
              <label class="sc-label">{{ $t('ui.cat_gorie') }}</label>
              <select v-model="form.category" class="sc-input sc-select">
                <option value="">{{ $t('ui.s_lectionner') }}</option>
                <option>{{ $t('ui.gaming') }}</option>
                <option>{{ $t('ui.esports') }}</option>
                <option>{{ $t('ui.just_chatting') }}</option>
                <option>{{ $t('labels.irl') }}</option>
                <option>{{ $t('ui.music') }}</option>
                <option>{{ $t('ui.creative') }}</option>
              </select>
            </div>
            <div class="sc-field">
              <label class="sc-label">{{ $t('ui.jeu') }}</label>
              <input v-model="form.game" type="text" class="sc-input" :placeholder="$t('ui.fc_mobile_cod')" maxlength="100" />
            </div>
          </div>

          <div class="sc-field">
            <label class="sc-label">{{ $t('ui.miniature') }}</label>
            <input ref="thumbnailInput" type="file" accept="image/jpeg,image/png,image/gif,image/webp" class="sc-input sc-file" @change="handleThumbnailChange" />
            <small class="sc-hint">{{ $t('ui.jpeg_png_gif_webp_max_5_mb') }}</small>
            <img v-if="thumbnailPreview" :src="thumbnailPreview" class="sc-thumb-preview" />
          </div>

          <div v-if="error" class="sc-alert sc-alert--error" :class="errorType === 'compat' ? 'sc-alert--warn' : ''">
            <i class="fas fa-exclamation-circle"></i>
            <span v-html="error"></span>
            <button @click="error = ''"><i class="fas fa-times"></i></button>
          </div>
          <div v-if="successMsg" class="sc-alert sc-alert--success">
            <i class="fas fa-check-circle"></i>
            <span v-html="successMsg"></span>
          </div>

          <div class="sc-btn-row">
            <button v-if="!streamId" type="submit" class="sc-btn sc-btn--primary" :disabled="loading">
              <i class="fas fa-spinner fa-spin" v-if="loading"></i>
              <i class="fas fa-video" v-else></i>
              {{ loading ? $t('ui.creating') : $t('streamStudio.createStream') }}
            </button>
            <button v-else type="button" class="sc-btn sc-btn--primary" @click="updateStream" :disabled="loading">
              <i class="fas fa-save"></i>{{ $t('ui.sauvegarder') }}</button>
            <button type="button" class="sc-btn sc-btn--ghost" @click="$router.push('/streams')">{{ $t('ui.annuler') }}</button>
          </div>
        </form>

        <!-- ── Go Live section ── -->
        <div v-if="streamId" class="sc-golive">
          <div class="sc-golive__info">
            <i class="fas fa-info-circle"></i>
            Stream <strong>#{{ streamId }}</strong>{{ $t('ui.configur_choisissez_la_source_et_d_marrez') }}</div>

          <!-- Source mobile : écran + caméra avant/arrière -->
          <div v-if="isMobile" class="sc-sources">
            <button class="sc-source" :class="{ active: sourceMode === 'screen' }" @click="sourceMode = 'screen'">
              <i class="fas fa-mobile-alt"></i><span>{{ $t('ui.partage_d_cran') }}</span>
            </button>
            <button class="sc-source" :class="{ active: sourceMode === 'camera-back' }" @click="sourceMode = 'camera-back'">
              <i class="fas fa-camera"></i><span>{{ $t('ui.cam_ra_arri_re') }}</span>
            </button>
            <button class="sc-source" :class="{ active: sourceMode === 'camera-front' }" @click="sourceMode = 'camera-front'">
              <i class="fas fa-user-circle"></i><span>{{ $t('ui.cam_ra_avant') }}</span>
            </button>
          </div>
          <!-- Source desktop : partage d'écran uniquement -->
          <div v-else class="sc-sources">
            <div class="sc-source active" style="cursor:default;">
              <i class="fas fa-desktop"></i><span>{{ $t('ui.partage_d_cran_bureau') }}</span>
            </div>
          </div>

          <button class="sc-btn sc-btn--live" @click="goLive" :disabled="startingStream">
            <span v-if="startingStream"><i class="fas fa-spinner fa-spin"></i>{{ $t('ui.d_marrage') }}</span>
            <span v-else><span class="sc-live-dot"></span>{{ $t('ui.go_live') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════
         PHASE LIVE — Studio de streaming professionnel
    ══════════════════════════════════════════════════════ -->
    <div v-if="phase === 'live'" class="studio">

      <!-- ── Top bar ── -->
      <div class="studio__topbar">
        <div class="studio__topbar-left">
          <span class="studio__live-badge"><span class="sc-live-dot"></span>{{ $t('ui.en_direct_2') }}</span>
          <!-- Titre éditable inline -->
          <div class="studio__title-wrap">
            <input
              v-if="editingTitle"
              v-model="form.title"
              class="studio__title-input"
              @blur="saveTitle"
              @keyup.enter="saveTitle"
              ref="titleInputRef"
              maxlength="255"
            />
            <span v-else class="studio__title" @click="startEditTitle">
              {{ form.title }} <i class="fas fa-pencil-alt studio__title-edit"></i>
            </span>
          </div>
        </div>

        <div class="studio__topbar-center">
          <div class="studio__timer">
            <i class="fas fa-clock"></i> {{ liveDuration }}
          </div>
        </div>

        <div class="studio__topbar-right">
          <div class="studio__viewers">
            <i class="fas fa-eye"></i> {{ viewerCount }}
          </div>
          <div class="studio__peers" title="Connexions WebRTC actives">
            <i class="fas fa-wifi"></i> {{ peerCount }}
          </div>
          <div class="studio__signal" :class="`studio__signal--${connectionQuality}`" :title="`Signal : ${connectionQuality}`">
            <i class="fas fa-circle"></i><i class="fas fa-circle"></i><i class="fas fa-circle"></i><i class="fas fa-circle"></i>
          </div>
          <button class="studio__stop-btn" @click="showConfirmStop = true">
            <i class="fas fa-stop"></i>{{ $t('ui.arr_ter') }}</button>
        </div>
      </div>

      <!-- ── Main content ── -->
      <div class="studio__body">

        <!-- ── Left: video + controls ── -->
        <div class="studio__left">

          <!-- Video preview -->
          <div class="studio__preview">
            <video ref="localVideo" autoplay muted playsinline class="studio__video"></video>

            <!-- Overlays when cam/mic off -->
            <div v-if="camOff" class="studio__cam-off">
              <i class="fas fa-video-slash"></i>
              <span>{{ $t('ui.cam_ra_d_sactiv_e') }}</span>
            </div>

            <!-- Audio level VU meter -->
            <div class="studio__vu">
              <div class="studio__vu-bar" :style="{ height: audioLevel + '%', opacity: micMuted ? .3 : 1 }"></div>
            </div>

            <!-- Mic muted indicator -->
            <div v-if="micMuted" class="studio__mic-badge">
              <i class="fas fa-microphone-slash"></i>
            </div>

            <!-- Donation alert popup -->
            <transition name="studio-alert">
              <div v-if="donationAlert" class="studio__donation-alert">
                <i class="fas fa-coins"></i>
                <strong>{{ donationAlert.donor }}</strong>{{ $t('ui.a_envoy') }}<strong>{{ donationAlert.amount }} EBT</strong>
                <p v-if="donationAlert.message">{{ donationAlert.message }}</p>
              </div>
            </transition>
          </div>

          <!-- ── Control toolbar ── -->
          <div class="studio__toolbar">

            <!-- Micro -->
            <button class="studio__tool" :class="{ 'studio__tool--active': !micMuted, 'studio__tool--danger': micMuted }" @click="toggleMic" :title="micMuted ? 'Activer le micro' : 'Couper le micro'">
              <i :class="micMuted ? 'fas fa-microphone-slash' : 'fas fa-microphone'"></i>
              <span>{{ micMuted ? 'Micro off' : 'Micro' }}</span>
            </button>

            <!-- Caméra -->
            <button class="studio__tool" :class="{ 'studio__tool--active': !camOff, 'studio__tool--danger': camOff }" @click="toggleCam" :title="camOff ? t('streamStudio.enableCamera') : t('streamStudio.disableCamera')">
              <i :class="camOff ? 'fas fa-video-slash' : 'fas fa-video'"></i>
              <span>{{ camOff ? t('streamStudio.camOff') : t('streamStudio.camera') }}</span>
            </button>

            <!-- Screen share switch -->
            <button class="studio__tool" :class="{ 'studio__tool--active': sourceMode === 'screen' }" @click="switchSource" :disabled="switchingSource">
              <i class="fas fa-desktop"></i>
              <span>{{ switchingSource ? '…' : t('streamStudio.screen') }}</span>
            </button>

            <!-- Caméra switch (mobile: avant/arrière) -->
            <button v-if="isMobile && sourceMode !== 'screen'" class="studio__tool studio__tool--cam-flip" @click="flipCamera" :disabled="switchingSource">
              <i class="fas fa-sync-alt"></i>
              <span>{{ $t('ui.retourner_cam') }}</span>
            </button>

            <div class="studio__toolbar-sep"></div>

            <!-- Volume slider -->
            <div class="studio__volume">
              <i class="fas fa-volume-up"></i>
              <input type="range" min="0" max="100" v-model="outputVolume" class="studio__range" title="Volume sortie" />
              <span class="studio__volume-val">{{ outputVolume }}%</span>
            </div>

            <div class="studio__toolbar-sep"></div>

            <!-- Qualité vidéo -->
            <div class="studio__quality-select">
              <i class="fas fa-cog"></i>
              <select v-model="selectedQuality" class="studio__select" @change="applyQuality">
                <option value="auto">{{ $t('ui.auto') }}</option>
                <option value="1080">{{ $t('ui.1080p') }}</option>
                <option value="720">{{ $t('ui.720p') }}</option>
                <option value="480">{{ $t('ui.480p') }}</option>
                <option value="360">{{ $t('ui.360p') }}</option>
              </select>
            </div>

            <!-- Plein écran preview -->
            <button class="studio__tool" @click="toggleFullscreen" :title="t('streamStudio.fullscreen')">
              <i :class="isFullscreen ? 'fas fa-compress' : 'fas fa-expand'"></i>
              <span>{{ isFullscreen ? t('streamStudio.exitFullscreen') : t('streamStudio.fullscreen') }}</span>
            </button>

          </div>

          <!-- ── Stats bar ── -->
          <div class="studio__stats">
            <div class="studio__stat">
              <span class="studio__stat-label">{{ $t('ui.r_solution') }}</span>
              <span class="studio__stat-val">{{ streamResolution }}</span>
            </div>
            <div class="studio__stat">
              <span class="studio__stat-label">{{ $t('labels.fps') }}</span>
              <span class="studio__stat-val">{{ streamFps }}</span>
            </div>
            <div class="studio__stat">
              <span class="studio__stat-label">{{ $t('ui.websocket') }}</span>
              <span class="studio__stat-val" :class="wsConnected ? 'studio__stat-val--ok' : 'studio__stat-val--err'">
                {{ wsConnected ? t('streamStudio.connected') : t('streamStudio.disconnected') }}
              </span>
            </div>
            <div class="studio__stat">
              <span class="studio__stat-label">{{ $t('ui.source') }}</span>
              <span class="studio__stat-val" :class="localStream ? 'studio__stat-val--ok' : 'studio__stat-val--err'">
                {{ localStream ? 'Active' : 'Perdue' }}
              </span>
            </div>
            <div class="studio__stat">
              <span class="studio__stat-label">{{ $t('ui.pairs') }}</span>
              <span class="studio__stat-val">{{ peerCount }}</span>
            </div>
          </div>

          <div v-if="error" class="sc-alert sc-alert--error">
            <i class="fas fa-exclamation-circle"></i>
            <span>{{ error }}</span>
            <button @click="error = ''"><i class="fas fa-times"></i></button>
          </div>
        </div>

        <!-- ── Right sidebar: chat + tools ── -->
        <div class="studio__right">

          <!-- Tabs -->
          <div class="studio__tabs">
            <button class="studio__tab" :class="{ active: studioTab === 'chat' }" @click="studioTab = 'chat'">
              <i class="fas fa-comment-dots"></i>{{ $t('ui.chat') }}<span v-if="unreadChat > 0" class="studio__tab-badge">{{ unreadChat }}</span>
            </button>
            <button class="studio__tab" :class="{ active: studioTab === 'tools' }" @click="studioTab = 'tools'; unreadChat = 0">
              <i class="fas fa-sliders-h"></i>{{ $t('ui.outils') }}</button>
            <button class="studio__tab" :class="{ active: studioTab === 'donations' }" @click="studioTab = 'donations'">
              <i class="fas fa-coins"></i>{{ $t('ui.dons') }}</button>
          </div>

          <!-- Chat tab -->
          <div v-if="studioTab === 'chat'" class="studio__panel">
            <div class="studio__chat-messages" ref="chatContainer">
              <div v-if="chatMessages.length === 0" class="studio__chat-empty">
                <i class="fas fa-comment-slash"></i>
                <span>{{ $t('ui.aucun_message') }}</span>
              </div>
              <div v-for="msg in chatMessages" :key="msg.id" class="studio__msg">
                <div class="studio__msg-avatar">{{ (msg.user?.username || '?').slice(0,2).toUpperCase() }}</div>
                <div class="studio__msg-body">
                  <div class="studio__msg-top">
                    <span class="studio__msg-name">{{ msg.user?.username || 'User' }}</span>
                    <span v-if="msg.is_moderator" class="studio__msg-badge">MOD</span>
                    <span class="studio__msg-time">{{ formatTime(msg.created_at) }}</span>
                    <button class="studio__msg-del" @click="deleteMsg(msg.id)" title="Supprimer">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                  <p class="studio__msg-text">{{ msg.message }}</p>
                </div>
              </div>
            </div>
            <div class="studio__chat-input">
              <input
                v-model="newChatMessage"
                class="studio__chat-field"
                :placeholder="$t('ui.r_pondre_au_chat')"
                @keyup.enter="sendChatMessage"
                maxlength="500"
              />
              <button class="studio__chat-send" @click="sendChatMessage" :disabled="!newChatMessage.trim()">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>

          <!-- Tools tab -->
          <div v-if="studioTab === 'tools'" class="studio__panel studio__panel--tools">
            <h4 class="studio__tools-title"><i class="fas fa-edit"></i>{{ $t('ui.infos_du_stream') }}</h4>
            <div class="sc-field">
              <label class="sc-label">{{ $t('ui.titre') }}</label>
              <input v-model="form.title" class="sc-input" @blur="saveTitle" maxlength="255" />
            </div>
            <div class="sc-field">
              <label class="sc-label">{{ $t('ui.cat_gorie') }}</label>
              <select v-model="form.category" class="sc-input sc-select" @change="saveTitle">
                <option value="">—</option>
                <option>{{ $t('ui.gaming') }}</option><option>{{ $t('ui.esports') }}</option>
                <option>{{ $t('ui.just_chatting') }}</option><option>{{ $t('labels.irl') }}</option>
                <option>{{ $t('ui.music') }}</option><option>{{ $t('ui.creative') }}</option>
              </select>
            </div>
            <div class="sc-field">
              <label class="sc-label">{{ $t('ui.jeu') }}</label>
              <input v-model="form.game" class="sc-input" @blur="saveTitle" maxlength="100" />
            </div>
            <button class="sc-btn sc-btn--primary sc-btn--sm" @click="saveTitle" :disabled="loading">
              <i class="fas fa-save"></i>{{ $t('ui.sauvegarder') }}</button>

            <div class="studio__tools-sep"></div>

            <h4 class="studio__tools-title"><i class="fas fa-bullhorn"></i>{{ $t('ui.annonce') }}</h4>
            <textarea v-model="announcementText" class="sc-input sc-textarea" rows="2" :placeholder="$t('ui.message_envoyer_au_chat')"></textarea>
            <button class="sc-btn sc-btn--primary sc-btn--sm" @click="sendAnnouncement" :disabled="!announcementText.trim()">
              <i class="fas fa-paper-plane"></i>{{ $t('ui.envoyer_au_chat') }}</button>

            <div class="studio__tools-sep"></div>

            <h4 class="studio__tools-title"><i class="fas fa-shield-alt"></i>{{ $t('ui.mod_ration') }}</h4>
            <button class="sc-btn sc-btn--ghost sc-btn--sm" @click="clearChat">
              <i class="fas fa-trash"></i>{{ $t('ui.vider_le_chat') }}</button>
          </div>

          <!-- Donations tab -->
          <div v-if="studioTab === 'donations'" class="studio__panel">
            <div class="studio__don-stats">
              <div class="studio__don-stat">
                <span class="studio__don-val">{{ totalDonations.toFixed(2) }}</span>
                <span class="studio__don-lbl">{{ $t('ui.ebt_re_us') }}</span>
              </div>
              <div class="studio__don-stat">
                <span class="studio__don-val">{{ donationList.length }}</span>
                <span class="studio__don-lbl">{{ $t('ui.donateurs') }}</span>
              </div>
            </div>
            <div class="studio__don-list">
              <div v-if="donationList.length === 0" class="studio__chat-empty">
                <i class="fas fa-coins"></i>
                <span>{{ $t('ui.aucun_don_encore') }}</span>
              </div>
              <div v-for="don in donationList" :key="don.id" class="studio__don-item">
                <div class="studio__don-avatar">{{ (don.donor || '?').slice(0,2).toUpperCase() }}</div>
                <div class="studio__don-info">
                  <span class="studio__don-name">{{ don.donor }}</span>
                  <span class="studio__don-msg" v-if="don.message">{{ don.message }}</span>
                </div>
                <span class="studio__don-amount">+{{ don.streamer_amount }} EBT</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- ── Bouton stop flottant (mobile uniquement) ── -->
      <button class="studio__fab-stop" @click="showConfirmStop = true">
        <i class="fas fa-stop"></i>
        <span>Arrêter le live</span>
      </button>

      <!-- ── Confirm stop modal ── -->
      <div v-if="showConfirmStop" class="studio__overlay" @click.self="showConfirmStop = false">
        <div class="studio__confirm">
          <div class="studio__confirm-icon"><i class="fas fa-stop-circle"></i></div>
          <h3>{{ $t('ui.arr_ter_le_live_2') }}</h3>
          <p>{{ viewerCount }} spectateur{{ viewerCount !== 1 ? 's' : '' }} regarde{{ viewerCount !== 1 ? 'nt' : '' }} votre stream.</p>
          <div class="studio__confirm-btns">
            <button class="sc-btn sc-btn--ghost" @click="showConfirmStop = false">{{ $t('ui.continuer') }}</button>
            <button class="sc-btn sc-btn--danger" @click="stopStream" :disabled="stoppingStream">
              <i class="fas fa-stop"></i> {{ stoppingStream ? t('streamStudio.stopping') : t('streamStudio.yesStop') }}
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/utils/axios';
import { Capacitor } from '@capacitor/core';
import { getNativeScreenStream } from '@/utils/nativeScreenCapture';

const router = useRouter();

// ── Form ──────────────────────────────────────────────────────────────────────
const form           = ref({ title: '', description: '', category: '', game: '' });
const thumbnailFile  = ref<File | null>(null);
const thumbnailPreview = ref<string | null>(null);
const thumbnailInput   = ref<HTMLInputElement | null>(null);
const streamId         = ref<number | null>(null);

// ── UI state ──────────────────────────────────────────────────────────────────
const phase         = ref<'setup' | 'live'>('setup');
const loading       = ref(false);
const startingStream = ref(false);
const stoppingStream = ref(false);
const error         = ref('');
const errorType     = ref<'error' | 'compat'>('error');
const successMsg    = ref('');
const editingTitle  = ref(false);
const titleInputRef = ref<HTMLInputElement | null>(null);
const showConfirmStop = ref(false);
const studioTab     = ref<'chat' | 'tools' | 'donations'>('chat');

// ── Device detection ──────────────────────────────────────────────────────────
const ua              = navigator.userAgent;
const isIOS           = /iPhone|iPad|iPod/i.test(ua);
const isAndroid       = /Android/i.test(ua);
const isMobile        = isIOS || isAndroid;
const supportsDisplayMedia = typeof (navigator.mediaDevices as any)?.getDisplayMedia === 'function';
const sourceMode      = ref<'screen' | 'camera-back' | 'camera-front'>('screen');

// ── Media controls ────────────────────────────────────────────────────────────
const micMuted         = ref(false);
const camOff           = ref(false);
const outputVolume     = ref(100);
const selectedQuality  = ref('auto');
const switchingSource  = ref(false);
const isFullscreen     = ref(false);

// ── Stream stats ──────────────────────────────────────────────────────────────
const streamResolution  = ref('—');
const streamFps         = ref('—');
const audioLevel        = ref(0);
const connectionQuality = ref<'excellent'|'good'|'poor'|'disconnected'>('disconnected');

// ── Live timer ────────────────────────────────────────────────────────────────
const liveDuration  = ref('00:00:00');
const liveStartTime = ref<number>(0);
let timerInterval: ReturnType<typeof setInterval> | null = null;

// ── WebRTC ────────────────────────────────────────────────────────────────────
const localVideo  = ref<HTMLVideoElement | null>(null);
const localStream = ref<MediaStream | null>(null);
const wsConnected = ref(false);
const viewerCount = ref(0);
const peerCount   = ref(0);
const peerConnections: Record<string, RTCPeerConnection> = {};
let ws: WebSocket | null = null;
let audioCtx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let animFrame: number | null = null;

const WS_BASE = (import.meta.env.VITE_STREAM_WS_URL || 'wss://ebetstream.com/ws').replace(/\/$/, '');
let nativeScreenStop: (() => Promise<void>) | null = null;
const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

// ── Chat ──────────────────────────────────────────────────────────────────────
const chatMessages   = ref<any[]>([]);
const newChatMessage = ref('');
const chatContainer  = ref<HTMLElement | null>(null);
const unreadChat     = ref(0);
const announcementText = ref('');
let chatInterval: ReturnType<typeof setInterval> | null = null;

// ── Donations ─────────────────────────────────────────────────────────────────
const donationList   = ref<any[]>([]);
const totalDonations = ref(0);
const donationAlert  = ref<{ donor: string; amount: number; message?: string } | null>(null);
let donationInterval: ReturnType<typeof setInterval> | null = null;

// ── Thumbnail ─────────────────────────────────────────────────────────────────
const handleThumbnailChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { error.value = t('errors.imageTooLarge'); return; }
  thumbnailFile.value = file;
  const reader = new FileReader();
  reader.onload = ev => { thumbnailPreview.value = ev.target?.result as string; };
  reader.readAsDataURL(file);
};

// ── Create / update ───────────────────────────────────────────────────────────
const handleSubmit = async () => {
  error.value = ''; successMsg.value = '';
  loading.value = true;
  try {
    const fd = new FormData();
    fd.append('title', form.value.title);
    fd.append('description', form.value.description || '');
    fd.append('category', form.value.category || '');
    fd.append('game', form.value.game || '');
    if (thumbnailFile.value) fd.append('thumbnail', thumbnailFile.value);
    const res = await apiClient.post('/streams', fd);
    if (res.data.success) {
      streamId.value = res.data.data.id;
      successMsg.value = t('streamStudio.streamCreated');
    }
  } catch (err: any) {
    if (err.response?.status === 400 && err.response.data.message?.includes('already have')) {
      successMsg.value = t('streamStudio.streamExistsLoading');
      await loadExistingStream();
    } else {
      const errs = err.response?.data?.errors;
      error.value = errs ? Object.values(errs).flat().join(', ') : (err.response?.data?.message || t('errors.generic'));
    }
  } finally { loading.value = false; }
};

const updateStream = async () => {
  if (!streamId.value) return;
  error.value = ''; loading.value = true;
  try {
    const fd = new FormData();
    fd.append('title', form.value.title);
    fd.append('description', form.value.description || '');
    fd.append('category', form.value.category || '');
    fd.append('game', form.value.game || '');
    if (thumbnailFile.value) fd.append('thumbnail', thumbnailFile.value);
    await apiClient.put(`/streams/${streamId.value}`, fd);
    successMsg.value = t('streamStudio.streamUpdated');
  } catch (err: any) {
    error.value = err.response?.data?.message || t('errors.generic');
  } finally { loading.value = false; }
};

const loadExistingStream = async () => {
  try {
    const res = await apiClient.get('/stream-key');
    if (res.data.success) {
      streamId.value = res.data.data.stream_id;
      if (streamId.value) {
        const detail = await apiClient.get(`/streams/${streamId.value}`);
        if (detail.data.success) {
          const s = detail.data.data;
          form.value = { title: s.title || '', description: s.description || '', category: s.category || '', game: s.game || '' };
          if (s.thumbnail_url) thumbnailPreview.value = s.thumbnail_url;
        }
      }
    }
  } catch { }
};

// ── Save title inline ─────────────────────────────────────────────────────────
const startEditTitle = async () => {
  editingTitle.value = true;
  await nextTick();
  titleInputRef.value?.focus();
};

const saveTitle = async () => {
  editingTitle.value = false;
  if (!streamId.value) return;
  try {
    await apiClient.put(`/streams/${streamId.value}`, {
      title: form.value.title,
      category: form.value.category,
      game: form.value.game,
    });
  } catch { }
};

// ── Capture media ─────────────────────────────────────────────────────────────
const captureMedia = async (): Promise<MediaStream> => {
  const mode = sourceMode.value;
  if (mode === 'screen' && !supportsDisplayMedia) {
    throw Object.assign(new Error('COMPAT'), {
      name: 'CompatError',
      friendly: isIOS ? t('streamStudio.screenShareIos') : t('streamStudio.screenShareUnsupported'),
    });
  }
  if (mode === 'camera-back' || mode === 'camera-front') {
    return navigator.mediaDevices.getUserMedia({
      video: { facingMode: mode === 'camera-front' ? 'user' : 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: true,
    });
  }

  // Partage d'écran — on tente directement sans guard de compatibilité.
  // Sur Android WebView 92+ / Android 12+ ça fonctionne nativement.
  // Si getDisplayMedia n'est pas disponible, on bascule automatiquement sur la caméra.
  if (isIOS) {
    throw Object.assign(new Error('COMPAT'), {
      name: 'CompatError',
      friendly: 'Le partage d\'écran n\'est pas disponible sur iOS.',
    });
  }

  // Sur Android Capacitor : plugin natif MediaProjection
  // dialog + service + stream en un seul appel (token Android 14 non expiré)
  if (Capacitor.isNativePlatform()) {
    const { stream, stop } = await getNativeScreenStream();
    nativeScreenStop = stop;
    return stream;
  }

  // Sur navigateur desktop : getDisplayMedia standard
  const screenStream: MediaStream = await (navigator.mediaDevices as any).getDisplayMedia({
    video: { width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 30 } },
    audio: true,
  });
  if (screenStream.getAudioTracks().length === 0) {
    try {
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      micStream.getAudioTracks().forEach((t: MediaStreamTrack) => screenStream.addTrack(t));
    } catch { }
  }
  return screenStream;
};

// ── Go Live ───────────────────────────────────────────────────────────────────
const goLive = async () => {
  if (!streamId.value) return;
  error.value = ''; errorType.value = 'error';
  startingStream.value = true;
  try {
    const stream = await captureMedia();
    localStream.value = stream;
    stream.getTracks()[0]?.addEventListener('ended', () => stopStream());
    await apiClient.post(`/streams/${streamId.value}/start`);
    phase.value = 'live';
    await nextTick();
    if (localVideo.value) { localVideo.value.srcObject = stream; localVideo.value.muted = true; }
    connectSignaling();
    startLiveTimer();
    initAudioMeter();
    startChatPolling();
    startDonationPolling();
    updateStreamStats();
  } catch (err: any) {
    localStream.value?.getTracks().forEach(t => t.stop());
    localStream.value = null;
    phase.value = 'setup';
    if (err.name === 'CompatError') { errorType.value = 'compat'; error.value = err.friendly; }
    else if (err.name === 'NotAllowedError') { error.value = t('errors.permissionDenied'); }
    else if (err.name === 'NotFoundError') { errorType.value = 'compat'; error.value = t('errors.noCameraDetected'); }
    else { error.value = err.response?.data?.message || err.message || t('errors.streamStartError'); }
  } finally { startingStream.value = false; }
};

// ── Live timer ────────────────────────────────────────────────────────────────
const startLiveTimer = () => {
  liveStartTime.value = Date.now();
  timerInterval = setInterval(() => {
    const secs = Math.floor((Date.now() - liveStartTime.value) / 1000);
    const h = Math.floor(secs / 3600).toString().padStart(2, '0');
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    liveDuration.value = `${h}:${m}:${s}`;
  }, 1000);
};

// ── Audio VU meter ────────────────────────────────────────────────────────────
const initAudioMeter = () => {
  if (!localStream.value) return;
  const tracks = localStream.value.getAudioTracks();
  if (tracks.length === 0) return;
  try {
    audioCtx = new AudioContext();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    const src = audioCtx.createMediaStreamSource(localStream.value);
    src.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser!.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      audioLevel.value = Math.min(100, Math.round(avg * 1.5));
      animFrame = requestAnimationFrame(tick);
    };
    tick();
  } catch { }
};

// ── Stream stats (resolution, FPS) ───────────────────────────────────────────
const updateStreamStats = () => {
  if (!localVideo.value) return;
  const v = localVideo.value;
  if (v.videoWidth && v.videoHeight) {
    streamResolution.value = `${v.videoWidth}×${v.videoHeight}`;
  }
  // Estimate FPS via requestAnimationFrame
  let frames = 0;
  let start = performance.now();
  const count = () => {
    frames++;
    if (performance.now() - start >= 1000) {
      streamFps.value = frames.toString();
      frames = 0;
      start = performance.now();
    }
    requestAnimationFrame(count);
  };
  requestAnimationFrame(count);
};

// ── Mic toggle ────────────────────────────────────────────────────────────────
const toggleMic = () => {
  if (!localStream.value) return;
  localStream.value.getAudioTracks().forEach(t => { t.enabled = micMuted.value; });
  micMuted.value = !micMuted.value;
};

// ── Camera toggle ─────────────────────────────────────────────────────────────
const toggleCam = () => {
  if (!localStream.value) return;
  localStream.value.getVideoTracks().forEach(t => { t.enabled = camOff.value; });
  camOff.value = !camOff.value;
};

// ── Switch source (screen ↔ camera) ──────────────────────────────────────────
const switchSource = async () => {
  if (switchingSource.value) return;
  switchingSource.value = true;
  try {
    const newMode = sourceMode.value === 'screen' ? (isMobile ? 'camera-back' : 'camera-back') : 'screen';
    sourceMode.value = newMode;
    const newStream = await captureMedia();
    // Replace tracks in existing peer connections
    const newVideoTrack = newStream.getVideoTracks()[0];
    if (newVideoTrack) {
      Object.values(peerConnections).forEach(pc => {
        const sender = pc.getSenders().find(s => s.track?.kind === 'video');
        sender?.replaceTrack(newVideoTrack);
      });
    }
    localStream.value?.getVideoTracks().forEach(t => t.stop());
    const oldAudio = localStream.value?.getAudioTracks() || [];
    const combined = new MediaStream([newVideoTrack, ...oldAudio]);
    localStream.value = combined;
    if (localVideo.value) localVideo.value.srcObject = combined;
  } catch (e: any) {
    error.value = e.message || t('errors.sourceChangeError');
  } finally { switchingSource.value = false; }
};

// ── Flip camera (mobile) ──────────────────────────────────────────────────────
const flipCamera = async () => {
  sourceMode.value = sourceMode.value === 'camera-back' ? 'camera-front' : 'camera-back';
  await switchSource();
};

// ── Fullscreen ────────────────────────────────────────────────────────────────
const toggleFullscreen = async () => {
  if (!localVideo.value) return;
  if (!document.fullscreenElement) {
    await localVideo.value.requestFullscreen?.();
    isFullscreen.value = true;
  } else {
    await document.exitFullscreen?.();
    isFullscreen.value = false;
  }
};

// ── Quality change ────────────────────────────────────────────────────────────
const applyQuality = () => {
  if (!localStream.value) return;
  const q = selectedQuality.value;
  const resolutions: Record<string, { width: number; height: number }> = {
    '1080': { width: 1920, height: 1080 },
    '720':  { width: 1280, height: 720 },
    '480':  { width: 854, height: 480 },
    '360':  { width: 640, height: 360 },
  };
  if (q !== 'auto' && resolutions[q]) {
    localStream.value.getVideoTracks().forEach(t => {
      t.applyConstraints({ width: resolutions[q].width, height: resolutions[q].height }).catch(() => { });
    });
  }
};

// ── Chat ──────────────────────────────────────────────────────────────────────
const startChatPolling = () => {
  fetchChat();
  chatInterval = setInterval(fetchChat, 5000);
};

const fetchChat = async () => {
  if (!streamId.value) return;
  try {
    const res = await apiClient.get(`/streams/${streamId.value}/chat`, { params: { limit: 50 } });
    if (res.data.success) {
      const prev = chatMessages.value.length;
      chatMessages.value = res.data.data;
      if (chatMessages.value.length > prev && studioTab.value !== 'chat') {
        unreadChat.value += chatMessages.value.length - prev;
      }
      await nextTick();
      if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  } catch { }
};

const sendChatMessage = async () => {
  if (!newChatMessage.value.trim() || !streamId.value) return;
  const text = newChatMessage.value.trim();
  newChatMessage.value = '';
  try {
    await apiClient.post(`/streams/${streamId.value}/chat`, { message: text });
    fetchChat();
  } catch { }
};

const sendAnnouncement = async () => {
  if (!announcementText.value.trim() || !streamId.value) return;
  try {
    await apiClient.post(`/streams/${streamId.value}/chat`, { message: `📢 ${announcementText.value}` });
    announcementText.value = '';
    fetchChat();
  } catch { }
};

const deleteMsg = async (msgId: number) => {
  if (!streamId.value) return;
  try {
    await apiClient.delete(`/streams/${streamId.value}/chat/${msgId}`);
    chatMessages.value = chatMessages.value.filter(m => m.id !== msgId);
  } catch { }
};

const clearChat = async () => {
  chatMessages.value = [];
};

const formatTime = (d: string) => {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'maintenant';
  if (m < 60) return `${m}min`;
  return `${Math.floor(m / 60)}h`;
};

// ── Donations polling ─────────────────────────────────────────────────────────
const startDonationPolling = () => {
  fetchDonations();
  donationInterval = setInterval(fetchDonations, 10000);
};

const fetchDonations = async () => {
  if (!streamId.value) return;
  try {
    const res = await apiClient.get(`/streams/${streamId.value}/donations`);
    if (res.data.success) {
      const prev = donationList.value.length;
      donationList.value = res.data.data;
      totalDonations.value = donationList.value.reduce((s: number, d: any) => s + (d.streamer_amount || 0), 0);
      // Show alert for new donation
      if (donationList.value.length > prev && prev > 0) {
        const newest = donationList.value[0];
        donationAlert.value = { donor: newest.donor, amount: newest.amount, message: newest.message };
        setTimeout(() => { donationAlert.value = null; }, 5000);
      }
    }
  } catch { }
};

// ── WebSocket signaling ───────────────────────────────────────────────────────
const connectSignaling = () => {
  const token = localStorage.getItem('auth_token') || '';
  ws = new WebSocket(`${WS_BASE}/stream/${streamId.value}?token=${encodeURIComponent(token)}`);
  ws.onopen  = () => { wsConnected.value = true; connectionQuality.value = 'excellent'; };
  ws.onerror = () => { wsConnected.value = false; connectionQuality.value = 'disconnected'; error.value = t('errors.websocketError'); };
  ws.onclose = () => { wsConnected.value = false; connectionQuality.value = 'disconnected'; };
  ws.onmessage = async (evt) => {
    let msg: any;
    try { msg = JSON.parse(evt.data); } catch { return; }
    switch (msg.type) {
      case 'ready': viewerCount.value = msg.viewerCount ?? 0; break;
      case 'viewer-joined': viewerCount.value = msg.count ?? viewerCount.value; await createOffer(msg.viewerId); break;
      case 'answer': if (peerConnections[msg.viewerId]) await peerConnections[msg.viewerId].setRemoteDescription(new RTCSessionDescription(msg.sdp)); break;
      case 'ice-candidate': if (peerConnections[msg.viewerId] && msg.candidate) { try { await peerConnections[msg.viewerId].addIceCandidate(new RTCIceCandidate(msg.candidate)); } catch { } } break;
      case 'viewer-left': viewerCount.value = msg.count ?? viewerCount.value; closePeer(msg.viewerId); break;
    }
  };
};

const createOffer = async (viewerId: string) => {
  if (!localStream.value) return;
  if (peerConnections[viewerId]) closePeer(viewerId);
  const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
  peerConnections[viewerId] = pc;
  peerCount.value = Object.keys(peerConnections).length;
  localStream.value.getTracks().forEach(track => pc.addTrack(track, localStream.value!));
  pc.onicecandidate = ({ candidate }) => { if (candidate && ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'ice-candidate', viewerId, candidate })); };
  pc.oniceconnectionstatechange = () => { if (pc.iceConnectionState === 'failed') pc.restartIce(); };
  pc.onconnectionstatechange = () => {
    const s = pc.connectionState;
    if (s === 'connected') connectionQuality.value = 'excellent';
    else if (s === 'connecting') connectionQuality.value = 'good';
    else if (s === 'failed' || s === 'closed') { closePeer(viewerId); if (Object.keys(peerConnections).length === 0) connectionQuality.value = 'poor'; }
  };
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  ws?.send(JSON.stringify({ type: 'offer', viewerId, sdp: offer }));
};

const closePeer = (viewerId: string) => {
  if (peerConnections[viewerId]) { peerConnections[viewerId].close(); delete peerConnections[viewerId]; peerCount.value = Object.keys(peerConnections).length; }
};

// ── Stop stream ───────────────────────────────────────────────────────────────
const stopStream = async () => {
  if (stoppingStream.value) return;
  stoppingStream.value = true;
  showConfirmStop.value = false;
  try {
    if (timerInterval) clearInterval(timerInterval);
    if (chatInterval) clearInterval(chatInterval);
    if (donationInterval) clearInterval(donationInterval);
    if (animFrame) cancelAnimationFrame(animFrame);
    audioCtx?.close();
    Object.keys(peerConnections).forEach(closePeer);
    localStream.value?.getTracks().forEach(t => t.stop());
    localStream.value = null;
    if (localVideo.value) localVideo.value.srcObject = null;
    if (ws) { ws.close(); ws = null; }
    if (nativeScreenStop) { await nativeScreenStop().catch(() => {}); nativeScreenStop = null; }
    wsConnected.value = false;
    if (streamId.value) await apiClient.post(`/streams/${streamId.value}/stop`).catch(() => { });
    setTimeout(() => router.push('/streams'), 1500);
  } finally { stoppingStream.value = false; }
};

// ── Lifecycle ─────────────────────────────────────────────────────────────────
onMounted(async () => {
  if (!localStorage.getItem('auth_token')) { router.push('/login'); return; }
  await loadExistingStream();
});

onBeforeUnmount(() => {
  if (timerInterval) clearInterval(timerInterval);
  if (chatInterval) clearInterval(chatInterval);
  if (donationInterval) clearInterval(donationInterval);
  if (animFrame) cancelAnimationFrame(animFrame);
  audioCtx?.close();
  Object.keys(peerConnections).forEach(closePeer);
  localStream.value?.getTracks().forEach(t => t.stop());
  if (ws) ws.close();
});

// Sync volume to video element
watch(outputVolume, v => { if (localVideo.value) localVideo.value.volume = v / 100; });
</script>

<style scoped>
/* ══════════════════════════════════════════════════════
   SETUP PHASE
══════════════════════════════════════════════════════ */
.sc-page { padding: 20px 0 48px; }

.sc-back {
  display: inline-flex; align-items: center; gap: 7px;
  height: 32px; padding: 0 14px;
  background: rgba(var(--n8),.07); border: 1px solid rgba(var(--n8),.12);
  border-radius: 5px; color: rgb(var(--n5)); font-size: 13px; font-weight: 600;
  cursor: pointer; margin-bottom: 20px; transition: all .15s;
  &:hover { background: rgba(var(--n8),.13); color: rgb(var(--n8)); }
  i { font-size: 13px; }
}

.sc-setup { max-width: 680px; margin: 0 auto; }

.sc-setup__header { margin-bottom: 24px; }
.sc-setup__title { font-size: 24px; font-weight: 800; color: rgb(var(--n8)); margin: 0 0 8px; display: flex; align-items: center; gap: 10px; }
.sc-setup__icon { color: rgb(var(--g1)); font-size: 22px; }
.sc-setup__sub { font-size: 14px; color: rgb(var(--n3)); margin: 0; }

.sc-setup__card {
  background: rgb(var(--p2)); border: 1px solid rgb(var(--n2));
  border-radius: 10px; padding: 28px 32px;
  @media (max-width: 576px) { padding: 20px; }
}

.sc-field { margin-bottom: 18px; }
.sc-label { display: block; font-size: 12px; font-weight: 700; color: rgb(var(--n3)); text-transform: uppercase; letter-spacing: .06em; margin-bottom: 7px; }
.sc-input {
  width: 100%; height: 40px;
  background: rgb(var(--p1)); border: 1px solid rgb(var(--n2));
  border-radius: 5px; color: rgb(var(--n8)); font-size: 14px;
  padding: 0 14px; outline: none; font-family: var(--body-font);
  transition: border-color .2s;
  &::placeholder { color: rgb(var(--n3)); }
  &:focus { border-color: rgb(var(--g1)); }
}
.sc-textarea { height: auto; padding: 10px 14px; resize: vertical; min-height: 80px; }
.sc-select { appearance: none; cursor: pointer; }
.sc-file { padding: 8px 14px; cursor: pointer; font-size: 13px; }
.sc-hint { font-size: 11px; color: rgb(var(--n3)); margin-top: 5px; display: block; }
.sc-thumb-preview { width: 180px; height: 100px; object-fit: cover; border-radius: 6px; margin-top: 10px; display: block; }
.sc-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; @media (max-width: 480px) { grid-template-columns: 1fr; } }

.sc-alert {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 12px 14px; border-radius: 6px; font-size: 13px; margin-bottom: 16px;
  button { background: none; border: none; cursor: pointer; padding: 2px; margin-left: auto; flex-shrink: 0; font-size: 14px; }
  &--error { background: rgba(var(--r1),.1); border: 1px solid rgba(var(--r1),.25); color: rgb(var(--r1)); button { color: rgb(var(--r1)); } }
  &--warn { background: rgba(255,180,0,.1); border: 1px solid rgba(255,180,0,.25); color: #ffb400; }
  &--success { background: rgba(0,200,83,.1); border: 1px solid rgba(0,200,83,.25); color: #00c853; }
}

.sc-btn-row { display: flex; gap: 10px; flex-wrap: wrap; }
.sc-btn {
  display: inline-flex; align-items: center; gap: 7px;
  height: 40px; padding: 0 20px; border: none; border-radius: 6px;
  font-size: 14px; font-weight: 700; cursor: pointer; transition: all .2s; white-space: nowrap;
  &:disabled { opacity: .5; cursor: not-allowed; }
  &--primary { background: rgb(var(--g1)); color: rgb(var(--p1)); &:hover:not(:disabled) { background: rgba(var(--g1),.84); } }
  &--ghost { background: rgba(var(--n8),.08); color: rgb(var(--n8)); border: 1px solid rgba(var(--n8),.15); &:hover { background: rgba(var(--n8),.14); } }
  &--live { background: #e91916; color: #fff; width: 100%; height: 48px; font-size: 15px; justify-content: center; box-shadow: 0 4px 20px rgba(233,25,22,.35); &:hover:not(:disabled) { background: #c41412; } }
  &--danger { background: rgba(var(--r1),.12); color: rgb(var(--r1)); border: 1px solid rgba(var(--r1),.3); &:hover { background: rgba(var(--r1),.22); } }
  &--sm { height: 34px; padding: 0 14px; font-size: 13px; }
}

.sc-live-dot {
  width: 8px; height: 8px; border-radius: 50%; background: #fff;
  animation: pulse-live 1.2s ease-in-out infinite; flex-shrink: 0;
}
@keyframes pulse-live { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.5; transform:scale(1.4); } }

.sc-golive {
  margin-top: 24px; padding-top: 24px; border-top: 1px solid rgb(var(--n2));
}

.sc-golive__info {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 14px; border-radius: 6px; font-size: 13px; color: rgb(var(--n5));
  background: rgba(var(--g1),.08); border: 1px solid rgba(var(--g1),.2);
  margin-bottom: 16px;
  strong { color: rgb(var(--n8)); }
  i { color: rgb(var(--g1)); }
}

.sc-sources { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
.sc-source {
  flex: 1; min-width: 120px;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 14px 10px; background: rgb(var(--p3)); border: 2px solid rgb(var(--n2));
  border-radius: 8px; color: rgb(var(--n3)); font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all .2s;
  i { font-size: 20px; }
  &.active { border-color: rgb(var(--g1)); color: rgb(var(--g1)); background: rgba(var(--g1),.1); }
  &:hover:not(.active) { border-color: rgba(var(--n8),.25); color: rgb(var(--n8)); }
}

/* ══════════════════════════════════════════════════════
   LIVE STUDIO
══════════════════════════════════════════════════════ */
.studio {
  display: flex; flex-direction: column;
  height: calc(100vh - 50px); /* fill below header */
  overflow: hidden;
  background: rgb(var(--p1));
}

/* Top bar */
.studio__topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 16px; height: 48px; flex-shrink: 0;
  background: rgb(var(--p2)); border-bottom: 1px solid rgb(var(--n2));
  gap: 12px; flex-wrap: wrap;
}

.studio__topbar-left, .studio__topbar-right { display: flex; align-items: center; gap: 10px; }
.studio__topbar-center { display: flex; align-items: center; }

.studio__live-badge {
  display: inline-flex; align-items: center; gap: 5px;
  background: #e91916; color: #fff; font-size: 11px; font-weight: 800;
  letter-spacing: .08em; text-transform: uppercase; padding: 3px 9px; border-radius: 3px;
  box-shadow: 0 0 12px rgba(233,25,22,.5); flex-shrink: 0;
}

.studio__title {
  font-size: 14px; font-weight: 700; color: rgb(var(--n8));
  cursor: pointer; display: flex; align-items: center; gap: 6px;
  &:hover .studio__title-edit { opacity: 1; }
}
.studio__title-edit { font-size: 11px; color: rgb(var(--n3)); opacity: 0; transition: opacity .15s; }
.studio__title-input {
  font-size: 14px; font-weight: 700; color: rgb(var(--n8));
  background: rgb(var(--p1)); border: 1px solid rgb(var(--g1));
  border-radius: 4px; padding: 3px 8px; outline: none; max-width: 280px;
}

.studio__timer { font-size: 14px; font-weight: 700; color: rgb(var(--g1)); font-variant-numeric: tabular-nums; display: flex; align-items: center; gap: 5px; i { font-size: 13px; } }

.studio__viewers, .studio__peers {
  display: flex; align-items: center; gap: 5px; font-size: 13px; font-weight: 600; color: rgb(var(--n5));
  i { font-size: 13px; }
}

/* Signal quality dots */
.studio__signal { display: flex; gap: 3px; align-items: center; }
.studio__signal i { font-size: 7px; color: rgb(var(--n2)); }
.studio__signal--excellent i { color: #00c853; }
.studio__signal--good i:nth-child(-n+3) { color: #00c853; }
.studio__signal--good i:last-child { color: rgb(var(--n2)); }
.studio__signal--poor i:first-child { color: #ffb400; }
.studio__signal--poor i:not(:first-child) { color: rgb(var(--n2)); }
.studio__signal--disconnected i { color: rgba(var(--r1),.4); }

.studio__stop-btn {
  display: inline-flex; align-items: center; gap: 6px;
  height: 32px; padding: 0 14px; background: rgba(var(--r1),.12);
  border: 1px solid rgba(var(--r1),.35); border-radius: 5px;
  color: rgb(var(--r1)); font-size: 13px; font-weight: 700; cursor: pointer;
  transition: all .15s;
  &:hover { background: rgb(var(--r1)); color: #fff; }
  i { font-size: 13px; }
}

/* Main body */
.studio__body {
  flex: 1; display: flex; gap: 0; overflow: hidden;
}

/* Left column */
.studio__left {
  flex: 1; min-width: 0; display: flex; flex-direction: column;
  background: #000; overflow: hidden;
}

/* Video preview */
.studio__preview {
  flex: 1; position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}

.studio__video {
  width: 100%; height: 100%; object-fit: contain; display: block;
  background: #000;
}

.studio__cam-off {
  position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 12px;
  background: rgb(var(--p1)); color: rgb(var(--n3)); z-index: 2;
  i { font-size: 48px; opacity: .3; }
  span { font-size: 14px; }
}

/* VU meter */
.studio__vu {
  position: absolute; right: 12px; bottom: 12px; z-index: 5;
  width: 6px; height: 60px; background: rgba(0,0,0,.5); border-radius: 3px; overflow: hidden;
  display: flex; align-items: flex-end;
}
.studio__vu-bar {
  width: 100%; border-radius: 3px; transition: height .08s ease;
  background: linear-gradient(to top, #00c853, #febd56, #e91916);
}

/* Mic muted badge */
.studio__mic-badge {
  position: absolute; top: 10px; left: 10px; z-index: 5;
  background: rgba(0,0,0,.75); color: rgb(var(--r1));
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; backdrop-filter: blur(4px);
}

/* Donation alert */
.studio__donation-alert {
  position: absolute; bottom: 60px; left: 50%; transform: translateX(-50%);
  background: rgba(var(--g1),.95); color: rgb(var(--p1));
  padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 700;
  display: flex; flex-direction: column; align-items: center; gap: 4px; z-index: 10;
  box-shadow: 0 8px 32px rgba(var(--g1),.5); text-align: center;
  i { font-size: 18px; }
  p { font-size: 12px; margin: 0; font-weight: 500; }
}

.studio-alert-enter-active, .studio-alert-leave-active { transition: all .4s ease; }
.studio-alert-enter-from, .studio-alert-leave-to { opacity: 0; transform: translateX(-50%) translateY(20px); }

/* Toolbar */
.studio__toolbar {
  display: flex; align-items: center; gap: 4px; flex-wrap: wrap;
  padding: 8px 12px; background: rgb(var(--p2)); border-top: 1px solid rgb(var(--n2));
  flex-shrink: 0;
}

.studio__tool {
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  min-width: 60px; padding: 8px 10px; background: rgb(var(--p3));
  border: 1px solid rgb(var(--n2)); border-radius: 6px; cursor: pointer;
  color: rgb(var(--n3)); font-size: 10px; font-weight: 600; transition: all .15s;
  i { font-size: 16px; }
  &:hover { background: rgba(var(--n8),.1); color: rgb(var(--n8)); }
  &--active { background: rgba(var(--g1),.12); border-color: rgba(var(--g1),.4); color: rgb(var(--g1)); }
  &--danger { background: rgba(var(--r1),.12); border-color: rgba(var(--r1),.3); color: rgb(var(--r1)); }
  &:disabled { opacity: .4; cursor: not-allowed; }
}

.studio__toolbar-sep { width: 1px; height: 36px; background: rgb(var(--n2)); margin: 0 4px; flex-shrink: 0; }

.studio__volume {
  display: flex; align-items: center; gap: 7px; color: rgb(var(--n3));
  i { font-size: 14px; }
}

.studio__range {
  width: 80px; accent-color: rgb(var(--g1)); cursor: pointer;
  @media (max-width: 600px) { width: 50px; }
}
.studio__volume-val { font-size: 11px; color: rgb(var(--n3)); min-width: 28px; }

.studio__quality-select { display: flex; align-items: center; gap: 6px; color: rgb(var(--n3)); i { font-size: 13px; } }
.studio__select {
  height: 32px; background: rgb(var(--p3)); border: 1px solid rgb(var(--n2));
  border-radius: 5px; color: rgb(var(--n8)); font-size: 12px; padding: 0 8px;
  outline: none; cursor: pointer;
  &:focus { border-color: rgb(var(--g1)); }
}

/* Stats bar */
.studio__stats {
  display: flex; gap: 0; flex-shrink: 0;
  background: rgb(var(--p1)); border-top: 1px solid rgb(var(--n2));
}
.studio__stat {
  flex: 1; padding: 5px 10px; text-align: center; border-right: 1px solid rgb(var(--n2));
  &:last-child { border-right: none; }
}
.studio__stat-label { display: block; font-size: 9px; text-transform: uppercase; letter-spacing: .05em; color: rgb(var(--n3)); }
.studio__stat-val { display: block; font-size: 12px; font-weight: 700; color: rgb(var(--n8)); margin-top: 1px; }
.studio__stat-val--ok  { color: #00c853; }
.studio__stat-val--err { color: rgb(var(--r1)); }

/* Right sidebar */
.studio__right {
  width: 300px; flex-shrink: 0; border-left: 1px solid rgb(var(--n2));
  display: flex; flex-direction: column; background: rgb(var(--p2));
  @media (max-width: 900px) { display: none; }
}

/* Tabs */
.studio__tabs { display: flex; border-bottom: 1px solid rgb(var(--n2)); flex-shrink: 0; }
.studio__tab {
  flex: 1; height: 40px; background: none; border: none; border-bottom: 2px solid transparent;
  color: rgb(var(--n3)); font-size: 12px; font-weight: 600; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 5px;
  transition: all .15s; position: relative;
  i { font-size: 13px; }
  &.active { color: rgb(var(--n8)); border-bottom-color: rgb(var(--g1)); }
  &:hover:not(.active) { color: rgb(var(--n8)); }
}
.studio__tab-badge {
  position: absolute; top: 5px; right: 8px;
  background: rgb(var(--r1)); color: #fff; font-size: 9px; font-weight: 800;
  padding: 0 5px; border-radius: 8px; line-height: 16px;
}

/* Panel */
.studio__panel {
  flex: 1; overflow-y: auto; display: flex; flex-direction: column;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgb(var(--n2)); border-radius: 2px; }
}
.studio__panel--tools { padding: 14px; gap: 0; }

/* Chat */
.studio__chat-messages { flex: 1; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 8px; }
.studio__chat-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; flex: 1; color: rgb(var(--n3)); i { font-size: 28px; opacity: .3; } span { font-size: 12px; } }

.studio__msg { display: flex; gap: 7px; align-items: flex-start; }
.studio__msg-avatar { width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg, rgb(var(--g1)), #febd56); color: rgb(var(--p1)); font-size: 8px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.studio__msg-body { flex: 1; min-width: 0; }
.studio__msg-top { display: flex; align-items: center; gap: 4px; margin-bottom: 2px; }
.studio__msg-name { font-size: 11px; font-weight: 700; color: rgb(var(--n8)); }
.studio__msg-badge { font-size: 9px; background: rgba(var(--g1),.15); color: rgb(var(--g1)); padding: 1px 4px; border-radius: 2px; font-weight: 700; }
.studio__msg-time { font-size: 9px; color: rgb(var(--n3)); margin-left: auto; }
.studio__msg-del { background: none; border: none; color: rgb(var(--n3)); cursor: pointer; font-size: 10px; padding: 1px; &:hover { color: rgb(var(--r1)); } }
.studio__msg-text { font-size: 12px; color: rgb(var(--n5)); margin: 0; line-height: 1.4; word-break: break-word; }

.studio__chat-input { display: flex; gap: 6px; padding: 10px; border-top: 1px solid rgb(var(--n2)); flex-shrink: 0; }
.studio__chat-field {
  flex: 1; height: 34px; background: rgb(var(--p1)); border: 1px solid rgb(var(--n2));
  border-radius: 5px; color: rgb(var(--n8)); font-size: 12px; padding: 0 10px; outline: none;
  font-family: var(--body-font);
  &::placeholder { color: rgb(var(--n3)); }
  &:focus { border-color: rgb(var(--g1)); }
}
.studio__chat-send { width: 34px; height: 34px; background: rgb(var(--g1)); color: rgb(var(--p1)); border: none; border-radius: 5px; cursor: pointer; font-size: 13px; &:hover { background: rgba(var(--g1),.84); } &:disabled { opacity: .4; cursor: not-allowed; } }

/* Tools panel */
.studio__tools-title { font-size: 12px; font-weight: 700; color: rgb(var(--n3)); text-transform: uppercase; letter-spacing: .08em; margin: 0 0 10px; display: flex; align-items: center; gap: 6px; i { font-size: 12px; color: rgb(var(--g1)); } }
.studio__tools-sep { height: 1px; background: rgb(var(--n2)); margin: 16px 0; }

/* Donations panel */
.studio__don-stats { display: flex; gap: 0; border-bottom: 1px solid rgb(var(--n2)); flex-shrink: 0; }
.studio__don-stat { flex: 1; padding: 12px; text-align: center; border-right: 1px solid rgb(var(--n2)); &:last-child { border: none; } }
.studio__don-val { display: block; font-size: 20px; font-weight: 800; color: rgb(var(--g1)); }
.studio__don-lbl { font-size: 11px; color: rgb(var(--n3)); }
.studio__don-list { flex: 1; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 8px; }
.studio__don-item { display: flex; align-items: center; gap: 8px; padding: 8px; background: rgb(var(--p3)); border-radius: 6px; border: 1px solid rgb(var(--n2)); }
.studio__don-avatar { width: 28px; height: 28px; border-radius: 50%; background: rgb(var(--g1)); color: rgb(var(--p1)); font-size: 9px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.studio__don-info { flex: 1; min-width: 0; }
.studio__don-name { font-size: 12px; font-weight: 700; color: rgb(var(--n8)); display: block; }
.studio__don-msg { font-size: 10px; color: rgb(var(--n3)); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.studio__don-amount { font-size: 12px; font-weight: 800; color: rgb(var(--g1)); white-space: nowrap; flex-shrink: 0; }

/* Floating stop button — mobile only */
.studio__fab-stop {
  display: none;
  @media (max-width: 900px) {
    display: flex; align-items: center; gap: 8px;
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    z-index: 1000;
    background: #e91916; color: #fff;
    border: none; border-radius: 32px;
    padding: 0 24px; height: 48px;
    font-size: 15px; font-weight: 800;
    box-shadow: 0 6px 24px rgba(233,25,22,.55);
    cursor: pointer;
    i { font-size: 16px; }
    &:active { background: #c41412; transform: translateX(-50%) scale(.96); }
  }
}

/* Confirm stop modal */
.studio__overlay { position: fixed; inset: 0; background: rgba(0,0,0,.75); display: flex; align-items: center; justify-content: center; z-index: 9999; }
.studio__confirm { background: rgb(var(--p2)); border: 1px solid rgb(var(--n2)); border-radius: 10px; padding: 32px; text-align: center; max-width: 360px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,.5); }
.studio__confirm-icon { font-size: 48px; color: rgb(var(--r1)); margin-bottom: 14px; }
.studio__confirm h3 { font-size: 18px; font-weight: 800; color: rgb(var(--n8)); margin: 0 0 8px; }
.studio__confirm p { font-size: 14px; color: rgb(var(--n3)); margin: 0 0 24px; }
.studio__confirm-btns { display: flex; gap: 10px; justify-content: center; }
</style>
