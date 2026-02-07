<template>
  <div class="page-content-with-space">
    <!-- Section Visualisation Stream -->
    <section class="defis_section py-6 position-relative overflow-hidden pb-120">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 gx-0 gx-lg-4">
            <div class="defis__main">
              
              <!-- Loading State -->
              <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <!-- Error State -->
              <div v-else-if="error" class="text-center py-5">
                <div class="alert alert-danger">
                  {{ error }}
                </div>
                <button class="btn_primary mt-3" @click="$router.push('/streams')">
                  <i class="fas fa-arrow-left me-2"></i>
                  Back to Streams
                </button>
              </div>

              <!-- Stream Content -->
              <div v-else-if="stream">
                <!-- Back Button -->
                <button class="btn_secondary mb-4" @click="$router.push('/streams')">
                  <i class="fas fa-arrow-left me-2"></i>
                  Back
                </button>

                <div class="row g-4">
                  <!-- Left Column - Video Player -->
                  <div class="col-lg-8">
                    <!-- Video Player -->
                    <div class="defi_card n11-bg rounded-8 p-0 mb-4 overflow-hidden">
                      <div class="video_container position-relative" style="background: #000; aspect-ratio: 16/9;">
                        <!-- WebRTC Live Stream (Native Browser Capture) -->
                        <video 
                          ref="liveVideo"
                          v-if="stream.is_live && useNativeStream"
                          autoplay
                          playsinline
                          controls
                          class="w-100 h-100"
                          style="object-fit: contain;"
                        ></video>
                        <!-- Twitch Embed -->
                        <div 
                          v-else-if="stream.use_twitch && stream.twitch_username"
                          class="w-100 h-100"
                        >
                          <iframe
                            :src="`https://player.twitch.tv/?channel=${stream.twitch_username}&parent=${windowLocationHost}&muted=false`"
                            frameborder="0"
                            allowfullscreen="true"
                            scrolling="no"
                            class="w-100 h-100"
                            style="min-height: 400px;"
                          ></iframe>
                        </div>
                        <!-- HLS Video Player (Local/MediaMTX) -->
                        <video 
                          v-else-if="stream.is_live && stream.hls_url"
                          :src="stream.hls_url"
                          controls
                          autoplay
                          class="w-100 h-100"
                          style="object-fit: contain;"
                        ></video>
                        <div v-else class="w-100 h-100 d-flex align-items-center justify-content-center">
                          <div class="text-center text-white">
                            <i class="fas fa-video-slash fs-1 mb-3" style="opacity: 0.5;"></i>
                            <p class="mb-0">Stream offline</p>
                          </div>
                        </div>
                        
                        <!-- Live Badge -->
                        <div v-if="stream.is_live" class="position-absolute top-0 start-0 m-3">
                          <span class="badge bg-danger px-3 py-2">
                            <i class="fas fa-circle me-1" style="font-size: 0.6rem; animation: pulse 2s infinite;"></i>
                            LIVE
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Stream Info -->
                    <div class="defi_card n11-bg rounded-8 p-4">
                      <h2 class="fw-bold mb-3 text-white">{{ stream.title || 'Sans titre' }}</h2>
                      <div class="d-flex align-items-center gap-3 mb-3">
                        <div class="avatar_small rounded-circle d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                          <i class="fas fa-user text-white"></i>
                        </div>
                        <div>
                          <h5 class="mb-0 text-white">{{ stream.user?.username || 'User' }}</h5>
                          <span class="text-white small" style="opacity: 0.8;">{{ stream.follower_count }} followers</span>
                        </div>
                        <div class="ms-auto">
                          <button 
                            v-if="isAuthenticated"
                            class="btn_primary"
                            @click="toggleFollow"
                            :disabled="followingLoading"
                          >
                            <span v-if="followingLoading">...</span>
                            <span v-else>
                              <i :class="(isFollowing ? 'fas' : 'far') + ' fa-heart me-2'"></i>
                              {{ isFollowing ? 'Ne plus suivre' : 'Suivre' }}
                            </span>
                          </button>
                        </div>
                      </div>
                      
                      <div class="mb-3">
                        <span v-if="stream.category" class="badge bg-secondary me-2">{{ stream.category }}</span>
                        <span v-if="stream.game" class="badge bg-info">{{ stream.game }}</span>
                      </div>

                      <p class="text-white" style="opacity: 0.9;">{{ stream.description || 'Aucune description' }}</p>
                    </div>
                  </div>

                  <!-- Right Column - Chat -->
                  <div class="col-lg-4">
                    <div class="defi_card n11-bg rounded-8 p-4 h-100 d-flex flex-column" style="max-height: 800px;">
                      <h5 class="fw-bold mb-4 text-white">
                        <i class="fas fa-comments me-2"></i>
                        Chat
                      </h5>
                      
                      <!-- Chat Messages -->
                      <div class="chat_messages flex-grow-1 mb-3 overflow-auto" ref="chatContainer">
                        <div v-if="chatLoading" class="text-center py-3">
                          <div class="spinner-border spinner-border-sm text-primary"></div>
                        </div>
                        <div v-else-if="chatMessages.length === 0" class="text-center py-5 text-white" style="opacity: 0.7;">
                          <p>Aucun message pour le moment</p>
                        </div>
                        <div v-else>
                          <div 
                            v-for="message in chatMessages" 
                            :key="message.id"
                            class="chat_message mb-3 p-2 rounded-3"
                            :class="{ 'n11-bg': message.user_id === currentUserId }"
                          >
                            <div class="d-flex align-items-start gap-2">
                              <div class="avatar_tiny rounded-circle d-flex align-items-center justify-content-center" style="width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); flex-shrink: 0;">
                                <i class="fas fa-user text-white" style="font-size: 0.7rem;"></i>
                              </div>
                              <div class="flex-grow-1">
                                <div class="d-flex align-items-center gap-2 mb-1">
                                  <span class="fw-bold text-white small">{{ message.user?.username || 'User' }}</span>
                                  <span v-if="message.user?.profile?.certifications && message.user.profile.certifications.includes('Ebetstream')" class="badge bg-success" style="font-size: 0.65rem;">
                                    <i class="fas fa-certificate me-1"></i>Certifié
                                  </span>
                                  <span v-if="message.is_moderator" class="badge bg-success" style="font-size: 0.65rem;">MOD</span>
                                  <span v-if="message.is_subscriber" class="badge bg-warning" style="font-size: 0.65rem;">SUB</span>
                                  <span class="text-white small" style="opacity: 0.6; font-size: 0.75rem;">{{ formatTime(message.created_at) }}</span>
                                </div>
                                <p class="mb-0 text-white small">{{ message.message }}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Chat Input -->
                      <div v-if="isAuthenticated" class="chat_input">
                        <div class="input-group">
                          <input 
                            v-model="newMessage"
                            type="text" 
                            class="form-control n11-bg text-white border-secondary" 
                            placeholder="Tapez votre message..."
                            @keyup.enter="sendMessage"
                            :disabled="sendingMessage"
                          />
                          <button 
                            class="btn_primary"
                            @click="sendMessage"
                            :disabled="sendingMessage || !newMessage.trim()"
                          >
                            <i class="fas fa-paper-plane"></i>
                          </button>
                        </div>
                      </div>
                      <div v-else class="text-center py-3">
                        <p class="text-white small mb-2" style="opacity: 0.8;">Connectez-vous pour chatter</p>
                        <button class="btn_secondary btn-sm" @click="$router.push('/login')">
                          Se connecter
                        </button>
                      </div>
                    </div>
                  </div>
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
import { ref, onMounted, onUnmounted, computed, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiClient from '@/utils/axios';

interface Stream {
  id: number;
  title: string;
  description: string;
  thumbnail: string | null;
  category: string | null;
  game: string | null;
  is_live: boolean;
  viewer_count: number;
  follower_count: number;
  hls_url: string | null;
  use_twitch?: boolean;
  twitch_username?: string | null;
  user: {
    id: number;
    username: string;
    profile?: {
      certifications?: string[] | null;
    };
  };
}

interface ChatMessage {
  id: number;
  message: string;
  user_id: number;
  user: {
    id: number;
    username: string;
    profile?: {
      certifications?: string[] | null;
    } | null;
  };
  is_moderator: boolean;
  is_subscriber: boolean;
  created_at: string;
}

const route = useRoute();
const stream = ref<Stream | null>(null);
const windowLocationHost = ref(window.location.hostname);
const loading = ref(false);
const error = ref("");
const chatMessages = ref<ChatMessage[]>([]);
const chatLoading = ref(false);
const newMessage = ref("");
const sendingMessage = ref(false);
const isFollowing = ref(false);
const followingLoading = ref(false);
const currentUserId = ref<number | null>(null);
const chatContainer = ref<HTMLElement | null>(null);
const liveVideo = ref<HTMLVideoElement | null>(null);
const useNativeStream = ref(false);
let peerConnection: RTCPeerConnection | null = null;
let wsConnection: WebSocket | null = null;

let chatInterval: NodeJS.Timeout | null = null;
let streamInterval: NodeJS.Timeout | null = null;

const isAuthenticated = computed(() => {
  return !!localStorage.getItem("auth_token");
});

const loadStream = async () => {
  try {
    loading.value = true;
    error.value = "";
    const streamId = route.params.id;

    const response = await apiClient.get(`/streams/${streamId}`);

    if (response.data.success) {
      stream.value = response.data.data;
      
      // Check if stream is live and try to connect via WebRTC
      if (stream.value && stream.value.is_live) {
        // Try to connect to native stream first
        await connectToNativeStream(Array.isArray(streamId) ? streamId[0] : streamId);
      }
      
      if (isAuthenticated.value) {
        checkFollowing();
      }
    }
  } catch (error: any) {
    console.error("Error loading stream:", error);
    if (error.response?.status === 404) {
      error.value = "Stream non trouvé";
    } else {
      error.value = "Error loading stream";
    }
  } finally {
    loading.value = false;
  }
};

const connectToNativeStream = async (streamId: string | number) => {
  try {
    // Check if stream is using native browser capture
    // For now, we'll use a simple approach: store stream in sessionStorage when started
    // In production, you'd use WebRTC with a signaling server
    
    // Try to establish WebRTC connection
    // This is a simplified version - in production you'd use a signaling server
    peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    // Handle incoming stream
    peerConnection.ontrack = (event) => {
      if (liveVideo.value && event.streams[0]) {
        liveVideo.value.srcObject = event.streams[0];
        useNativeStream.value = true;
      }
    };

    // Create offer and send to server
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // In a real implementation, you'd send this offer to a signaling server
    // For now, we'll just try to connect if the streamer is broadcasting
    // This requires a WebSocket server for signaling
    
    console.log("Attempting to connect to native stream...");
    
    // Fallback: if WebRTC is not available, use Twitch or HLS
    if (!useNativeStream.value) {
      console.log("WebRTC connection not available, using fallback stream");
    }
  } catch (err) {
    console.error("Error connecting to native stream:", err);
    // Fall back to Twitch/HLS if native stream is not available
  }
};

const loadChatMessages = async () => {
  if (!stream.value) return;
  
  try {
    chatLoading.value = true;
    const response = await apiClient.get(`/streams/${stream.value.id}/chat`, {
      params: { limit: 50 },
    });

    if (response.data.success) {
      chatMessages.value = response.data.data;
      await nextTick();
      scrollChatToBottom();
    }
  } catch (error: any) {
    console.error("Error loading chat:", error);
  } finally {
    chatLoading.value = false;
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || !isAuthenticated.value || !stream.value) return;

  try {
    sendingMessage.value = true;
    const response = await apiClient.post(
      `/streams/${stream.value.id}/chat`,
      { message: newMessage.value }
    );

    if (response.data.success) {
      newMessage.value = "";
      await loadChatMessages();
    }
  } catch (error: any) {
    console.error("Error sending message:", error);
    alert(error.response?.data?.message || "Error sending message");
  } finally {
    sendingMessage.value = false;
  }
};

const toggleFollow = async () => {
  if (!isAuthenticated.value || !stream.value) return;

  try {
    followingLoading.value = true;
    const response = await apiClient.post(`/streams/${stream.value.id}/follow`, {});

    if (response.data.success) {
      isFollowing.value = response.data.data.is_following;
      if (stream.value) {
        stream.value.follower_count = response.data.data.follower_count;
      }
    }
  } catch (error: any) {
    console.error("Error toggling follow:", error);
    alert(error.response?.data?.message || "Error");
  } finally {
    followingLoading.value = false;
  }
};

const checkFollowing = async () => {
  // This would require an endpoint to check if user is following
  // For now, we'll assume false
  isFollowing.value = false;
};

const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) return;
    
    const response = await apiClient.get("/user");
    currentUserId.value = response.data.id;
  } catch (error) {
    console.error("Error getting current user:", error);
  }
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
};

const scrollChatToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

onMounted(() => {
  getCurrentUser();
  loadStream();
  loadChatMessages();
  
  // Refresh chat every 3 seconds
  chatInterval = setInterval(() => {
    if (stream.value) {
      loadChatMessages();
    }
  }, 3000);
  
  // Refresh stream info every 10 seconds
  streamInterval = setInterval(() => {
    if (stream.value) {
      loadStream();
    }
  }, 10000);
});

onUnmounted(() => {
  if (chatInterval) clearInterval(chatInterval);
  if (streamInterval) clearInterval(streamInterval);
  
  // Clean up WebRTC connection
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  
  if (wsConnection) {
    wsConnection.close();
    wsConnection = null;
  }
  
  if (liveVideo.value) {
    liveVideo.value.srcObject = null;
  }
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

.defi_card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.chat_messages {
  max-height: 600px;
  min-height: 400px;
}

.chat_message {
  transition: background 0.2s;
}

.chat_input {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
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
  
  .container-fluid {
    margin-left: 0 !important;
  }
  
  .defis__main {
    margin-left: 0 !important;
  }
}
</style>

