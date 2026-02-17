<template>
  <div class="page-content-with-space">
    <!-- Stream Creation Section -->
    <section class="defis_section py-6 position-relative overflow-hidden pb-120">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 gx-0 gx-lg-4">
            <div class="defis__main">
              
              <!-- Header -->
              <div class="row mb-5">
                <div class="col-12">
                  <button class="btn_secondary mb-4" @click="$router.push('/streams')">
                    <i class="fas fa-arrow-left me-2"></i>
                    Back
                  </button>
                  
                  <div class="defis_content">
                    <span class="hero_badge mb-3 d-inline-block">
                      📺 Create a Stream
                    </span>
                    <h2 class="hero_title mb-4">
                      Launch your <span class="text_gradient">Live Stream</span>
                    </h2>
                    <p class="hero_subtitle mb-5">
                      Configure your stream and start broadcasting your games live.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Form -->
              <div class="row justify-content-center">
                <div class="col-lg-8">
                  <div class="defi_card n11-bg rounded-8 p-4 p-lg-6">
                    <form @submit.prevent="handleSubmit">
                      <!-- Title -->
                      <div class="mb-4">
                        <label class="text-white mb-2 d-block fw-bold">Stream Title *</label>
                        <input 
                          v-model="form.title"
                          type="text" 
                          class="form-control n11-bg text-white border-secondary" 
                          placeholder="Ex: My first eBetStream"
                          required
                          maxlength="255"
                        />
                      </div>

                      <!-- Description -->
                      <div class="mb-4">
                        <label class="text-white mb-2 d-block fw-bold">Description</label>
                        <textarea 
                          v-model="form.description"
                          class="form-control n11-bg text-white border-secondary" 
                          placeholder="Describe your stream..."
                          rows="4"
                          maxlength="1000"
                        ></textarea>
                      </div>

                      <!-- Category -->
                      <div class="mb-4">
                        <label class="text-white mb-2 d-block fw-bold">Category</label>
                        <select 
                          v-model="form.category"
                          class="form-control n11-bg text-white border-secondary"
                        >
                          <option value="">Select a category</option>
                          <option value="Gaming">Gaming</option>
                          <option value="Esports">Esports</option>
                          <option value="Just Chatting">Just Chatting</option>
                          <option value="IRL">IRL</option>
                          <option value="Music">Music</option>
                          <option value="Creative">Creative</option>
                        </select>
                      </div>

                      <!-- Game -->
                      <div class="mb-4">
                        <label class="text-white mb-2 d-block fw-bold">Game</label>
                        <input 
                          v-model="form.game"
                          type="text" 
                          class="form-control n11-bg text-white border-secondary" 
                          placeholder="Ex: FC Mobile 25, Call of Duty..."
                          maxlength="100"
                        />
                      </div>

                      <!-- Thumbnail -->
                      <div class="mb-4">
                        <label class="text-white mb-2 d-block fw-bold">Thumbnail</label>
                        <input 
                          ref="thumbnailInput"
                          type="file" 
                          accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                          class="form-control n11-bg text-white border-secondary" 
                          @change="handleThumbnailChange"
                        />
                        <small class="text-white d-block mt-2" style="opacity: 0.7;">
                          Accepted formats: JPEG, PNG, JPG, GIF, WebP (max 5MB)
                        </small>
                        <div v-if="thumbnailPreview" class="mt-3">
                          <img 
                            :src="thumbnailPreview" 
                            alt="Thumbnail preview" 
                            class="img-thumbnail"
                            style="max-width: 200px; max-height: 200px; object-fit: cover;"
                          />
                        </div>
                      </div>

                      <!-- Twitch Integration (Always Required) -->
                      <div class="mb-4">
                        <div class="alert alert-info mb-3 d-flex align-items-center">
                          <i class="fab fa-twitch fs-4 me-2 text-purple"></i>
                          <div>
                            <strong>Streaming via Twitch</strong>
                            <p class="mb-0 small">All streams use Twitch for broadcasting.</p>
                          </div>
                        </div>
                        
                        <div class="mb-3">
                          <label class="text-white mb-2 d-block fw-bold">Twitch Username *</label>
                          <input 
                            v-model="form.twitch_username"
                            type="text" 
                            class="form-control n11-bg text-white border-secondary" 
                            placeholder="your_twitch_name"
                            required
                          />
                          <small class="text-white d-block mt-2" style="opacity: 0.7;">
                            Your Twitch username (without @)
                          </small>
                        </div>
                        
                        <div class="mb-3">
                          <label class="text-white mb-2 d-block fw-bold">Twitch Stream Key *</label>
                          <input 
                            v-model="form.twitch_stream_key"
                            type="password" 
                            class="form-control n11-bg text-white border-secondary" 
                            placeholder="live_xxxxxxxxxxxxx"
                            required
                          />
                          <small class="text-white d-block mt-2" style="opacity: 0.7;">
                            Find your Stream Key in: <a href="https://www.twitch.tv/settings/channel" target="_blank" class="text-primary">Twitch Settings → Stream</a>
                          </small>
                        </div>
                      </div>

                      <!-- Error Message -->
                      <div v-if="error" class="alert alert-danger mb-4 d-flex align-items-center justify-content-between">
                        <span><i class="fas fa-exclamation-circle me-2"></i>{{ error }}</span>
                        <button class="btn-close btn-close-white" @click="error = ''"></button>
                      </div>

                      <!-- Success Message -->
                      <div v-if="success" class="alert alert-success mb-4 d-flex align-items-center justify-content-between">
                        <span>{{ success }}</span>
                        <button class="btn-close btn-close-white" @click="success = ''"></button>
                      </div>

                      <!-- Actions -->
                      <div class="d-flex gap-3">
                        <button 
                          v-if="!currentStreamId"
                          type="submit" 
                          class="btn_primary flex-fill" 
                          :disabled="loading"
                        >
                          <span v-if="loading">Creating...</span>
                          <span v-else>
                            <i class="fas fa-video me-2"></i>
                            Create Stream
                          </span>
                        </button>
                        <button 
                          v-else
                          type="button" 
                          class="btn_primary flex-fill" 
                          @click="updateStream"
                          :disabled="loading"
                        >
                          <span v-if="loading">Updating...</span>
                          <span v-else>
                            <i class="fas fa-save me-2"></i>
                            Update Stream
                          </span>
                        </button>
                        <button 
                          type="button" 
                          class="btn_secondary" 
                          @click="$router.push('/streams')"
                          :disabled="loading"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>

                    <!-- Stream Key Section (if stream exists) -->
                    <div v-if="(twitchStreamKey || currentStreamId)" class="mt-5 pt-5 border-top" style="border-color: rgba(255, 255, 255, 0.1) !important;">
                      <h5 class="fw-bold mb-3 text-white">
                        <i class="fab fa-twitch me-2 text-purple"></i>
                        Twitch Streaming Information
                      </h5>
                      
                      <div v-if="!twitchStreamKey && currentStreamId" class="alert alert-warning mb-3">
                        <i class="fas fa-info-circle me-2"></i>
                        Loading streaming information...
                        <button class="btn btn-sm btn-outline-light ms-2" @click="loadStreamKey">
                          <i class="fas fa-sync me-1"></i> Refresh
                        </button>
                      </div>
                      
                      <!-- Twitch Information -->
                      <div v-if="useTwitch && twitchStreamKey" class="alert alert-info">
                        <div class="d-flex align-items-center mb-3">
                          <i class="fab fa-twitch fs-4 me-2 text-purple"></i>
                          <h6 class="mb-0 fw-bold">Streaming via Twitch</h6>
                        </div>
                        <p class="mb-2"><strong>Twitch Username:</strong></p>
                        <div class="d-flex align-items-center gap-2 mb-3">
                          <code class="d-block p-2 rounded bg-dark text-white flex-grow-1">{{ twitchUsername }}</code>
                          <button 
                            class="btn btn-sm btn-outline-light" 
                            @click="copyToClipboard(twitchUsername)"
                            title="Copy"
                          >
                            <i class="fas fa-copy"></i>
                          </button>
                        </div>
                        <p class="mb-2"><strong>Twitch Stream Key:</strong></p>
                        <div class="d-flex align-items-center gap-2 mb-3">
                          <code class="d-block p-2 rounded bg-dark text-white flex-grow-1">{{ twitchStreamKey }}</code>
                          <button 
                            class="btn btn-sm btn-outline-light" 
                            @click="copyToClipboard(twitchStreamKey)"
                            title="Copy"
                          >
                            <i class="fas fa-copy"></i>
                          </button>
                        </div>
                        <p class="mb-2"><strong>Twitch RTMP URL:</strong></p>
                        <div class="d-flex align-items-center gap-2 mb-3">
                          <code class="d-block p-2 rounded bg-dark text-white flex-grow-1">{{ rtmpUrl || 'rtmp://live.twitch.tv/app/' + twitchStreamKey }}</code>
                          <button 
                            class="btn btn-sm btn-outline-light" 
                            @click="copyToClipboard(rtmpUrl || 'rtmp://live.twitch.tv/app/' + twitchStreamKey)"
                            title="Copy"
                          >
                            <i class="fas fa-copy"></i>
                          </button>
                        </div>
                        <p class="small mb-0">
                          <i class="fas fa-info-circle me-2"></i>
                          In OBS: Service = <strong>Twitch</strong>, Server = <strong>Auto</strong>, Stream Key = your key above
                        </p>
                      </div>
                      
                      
                      <!-- Screen Capture Section -->
                      <div v-if="currentStreamId && streamStarted" class="mt-4 pt-4 border-top" style="border-color: rgba(255, 255, 255, 0.1) !important;">
                        <h5 class="fw-bold mb-3 text-white">
                          <i class="fas fa-desktop me-2"></i>
                          Live Screen Capture
                        </h5>
                        
                        <!-- Video Preview -->
                        <div class="mb-3">
                          <video 
                            ref="previewVideo"
                            autoplay
                            muted
                            playsinline
                            class="w-100 rounded"
                            style="max-height: 400px; background: #000;"
                          ></video>
                        </div>
                        
                        <!-- Controls -->
                        <div class="d-flex gap-2">
                          <button 
                            class="btn_primary"
                            @click="stopScreenCapture"
                            :disabled="stoppingCapture"
                          >
                            <i class="fas fa-stop me-2"></i>
                            {{ stoppingCapture ? 'Stopping...' : 'Stop Stream' }}
                          </button>
                        </div>
                      </div>
                      
                      <div v-else class="d-flex gap-3 flex-wrap mt-4">
                        <button 
                          class="btn_primary" 
                          @click="startStreamWithScreenCapture" 
                          :disabled="startingStream || !currentStreamId"
                        >
                          <span v-if="startingStream">Starting...</span>
                          <span v-else>
                            <i class="fas fa-play me-2"></i>
                            Start Stream & Share Screen
                          </span>
                        </button>
                        <button 
                          class="btn_secondary" 
                          @click="loadStreamKey"
                          :disabled="loading"
                        >
                          <i class="fas fa-sync me-2"></i>
                          Refresh Information
                        </button>
                      </div>
                      
                      <div v-if="!currentStreamId" class="alert alert-warning mt-3">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        Stream ID not found. Please refresh or recreate the stream.
                      </div>
                      
                      <div v-if="currentStreamId" class="alert alert-success mt-3">
                        <i class="fas fa-check-circle me-2"></i>
                        Stream created successfully! ID: {{ currentStreamId }}
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
import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import apiClient from "@/utils/axios";
import { getStorageUrl } from '@/config/constants';
import { fixImageUrl } from '@/utils/imageFixer';


const mediaRecorder = ref<MediaRecorder | null>(null);
const wsConnection = ref<WebSocket | null>(null);
const router = useRouter();
const form = ref({
  title: "",
  description: "",
  category: "",
  game: "",
  thumbnail: "",
  use_twitch: true, // Always true - Twitch only
  twitch_username: "",
  twitch_stream_key: "",
});

const handleThumbnailChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      error.value = "Image is too large. Maximum size: 5MB";
      if (thumbnailInput.value) {
        thumbnailInput.value.value = "";
      }
      return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      error.value = "Unsupported image format. Use JPEG, PNG, JPG, GIF, or WebP";
      if (thumbnailInput.value) {
        thumbnailInput.value.value = "";
      }
      return;
    }
    
    thumbnailFile.value = file;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      thumbnailPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const loading = ref(false);
const error = ref("");
const success = ref("");
const streamKey = ref("");
const rtmpUrl = ref("");
const useTwitch = ref(false);
const twitchUsername = ref("");
const twitchStreamKey = ref("");
const startingStream = ref(false);
const currentStreamId = ref<number | null>(null);
const thumbnailFile = ref<File | null>(null);
const thumbnailPreview = ref<string | null>(null);
const thumbnailInput = ref<HTMLInputElement | null>(null);
const previewVideo = ref<HTMLVideoElement | null>(null);
const screenStream = ref<MediaStream | null>(null);
const streamStarted = ref(false);
const stoppingCapture = ref(false);

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = "";
    success.value = "";
    
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Ensure Twitch is always enabled
    const streamData = {
      ...form.value,
      use_twitch: true, // Force Twitch
    };
    
    // Validate Twitch fields
    if (!streamData.twitch_username || !streamData.twitch_stream_key) {
      error.value = "Twitch username and Stream Key are required.";
      loading.value = false;
      return;
    }
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('title', streamData.title);
    formData.append('description', streamData.description || '');
    formData.append('category', streamData.category || '');
    formData.append('game', streamData.game || '');
    formData.append('use_twitch', '1');
    formData.append('twitch_username', streamData.twitch_username);
    formData.append('twitch_stream_key', streamData.twitch_stream_key);
    
    // Add thumbnail file if selected
    if (thumbnailFile.value) {
      formData.append('thumbnail', thumbnailFile.value);
    }
    
    console.log("Creating stream with data:", streamData);
    
    const response = await apiClient.post(
      '/streams',
      formData
    );

    console.log("Stream creation response:", response.data);

    if (response.data.success) {
      success.value = "✅ Stream created successfully! Streaming information will appear below...";
      currentStreamId.value = response.data.data.id;
      console.log("Stream ID set to:", currentStreamId.value);
      
      // Scroll to stream key section
      await nextTick();
      setTimeout(() => {
        const streamKeySection = document.querySelector('.border-top');
        if (streamKeySection) {
          streamKeySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      
      // Load stream key immediately
      await loadStreamKey();
    } else {
      error.value = response.data.message || "Error creating stream";
    }
  } catch (error: any) {
    console.error("Error creating stream:", error);
    console.error("Error response:", error.response?.data);
    
    // If user already has a stream, load existing information
    if (error.response?.status === 400 && error.response?.data?.message?.includes('already have a stream')) {
      error.value = "You already have a stream. Loading your existing information...";
      // Load existing stream
      await loadStreamKey();
      // Try to load stream information
      try {
        const streamsResponse = await apiClient.get("/streams");
        if (streamsResponse.data.success) {
          const streams = streamsResponse.data.data.data || streamsResponse.data.data || [];
          const userResponse = await apiClient.get("/user");
          if (userResponse.data && userResponse.data.id) {
            const userStream = streams.find((s: any) => s.user_id === userResponse.data.id || s.user?.id === userResponse.data.id);
            if (userStream) {
              currentStreamId.value = userStream.id;
              form.value.title = userStream.title || "";
              form.value.description = userStream.description || "";
              form.value.category = userStream.category || "";
              form.value.game = userStream.game || "";
              form.value.thumbnail = userStream.thumbnail || "";
              form.value.use_twitch = true; // Always Twitch
              form.value.twitch_username = userStream.twitch_username || "";
              form.value.twitch_stream_key = userStream.twitch_stream_key || "";
              success.value = "Your existing stream information has been loaded. You can modify it above.";
            }
          }
        }
      } catch (loadError) {
        console.error("Error loading existing stream:", loadError);
      }
    } else if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      error.value = Object.values(errors).flat().join(', ');
    } else if (error.response?.data?.message) {
      error.value = error.response.data.message;
    } else {
      error.value = "Error creating stream. Check the console for more details.";
    }
  } finally {
    loading.value = false;
  }
};

const loadStreamKey = async () => {
  try {
    loading.value = true;
    
    const response = await apiClient.get("/stream-key");

    if (response.data.success) {
      // Check if using Twitch
      if (response.data.data.use_twitch) {
        useTwitch.value = true;
        twitchUsername.value = response.data.data.twitch_username || "";
        twitchStreamKey.value = response.data.data.stream_key || ""; // Stream key is the Twitch key
        rtmpUrl.value = response.data.data.rtmp_url || "";
      } else {
        useTwitch.value = false;
        streamKey.value = response.data.data.stream_key || "";
        rtmpUrl.value = response.data.data.rtmp_url || "";
      }
      // Set stream ID if available
      if (response.data.data.stream_id) {
        currentStreamId.value = response.data.data.stream_id;
      }
      success.value = "Streaming information loaded successfully!";
    } else {
      console.error("Failed to load stream key:", response.data.message);
      error.value = response.data.message || "Error loading information";
    }
  } catch (error: any) {
    console.error("Error loading stream key:", error);
    if (error.response?.status === 404) {
      error.value = "No stream found. Please create a stream first.";
    } else {
      error.value = error.response?.data?.message || "Error loading information";
    }
  } finally {
    loading.value = false;
  }
};

const updateStream = async () => {
  if (!currentStreamId.value) return;
  
  try {
    loading.value = true;
    error.value = "";
    success.value = "";
    
    // Ensure Twitch is always enabled
    const streamData = {
      ...form.value,
      use_twitch: true, // Force Twitch
    };
    
    // Validate Twitch fields
    if (!streamData.twitch_username || !streamData.twitch_stream_key) {
      error.value = "Twitch username and Stream Key are required.";
      loading.value = false;
      return;
    }
    
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('title', streamData.title);
    formData.append('description', streamData.description || '');
    formData.append('category', streamData.category || '');
    formData.append('game', streamData.game || '');
    formData.append('use_twitch', '1');
    formData.append('twitch_username', streamData.twitch_username);
    formData.append('twitch_stream_key', streamData.twitch_stream_key);
    
    // Add thumbnail file if selected
    if (thumbnailFile.value) {
      formData.append('thumbnail', thumbnailFile.value);
    }

    const response = await apiClient.put(
      `/streams/${currentStreamId.value}`,
      formData
    );

    if (response.data.success) {
      success.value = "✅ Stream updated successfully!";
    } else {
      error.value = response.data.message || "Error updating";
    }
  } catch (error: any) {
    console.error("Error updating stream:", error);
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      error.value = Object.values(errors).flat().join(', ');
    } else {
      error.value = error.response?.data?.message || "Error updating stream";
    }
  } finally {
    loading.value = false;
  }
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    success.value = "Copied to clipboard!";
    setTimeout(() => {
      success.value = "";
    }, 2000);
  } catch (err) {
    console.error("Failed to copy:", err);
    error.value = "Unable to copy to clipboard";
  }
};

const startStreamWithScreenCapture = async () => {
  if (!currentStreamId.value) {
    error.value = "No stream found. Please create a stream first.";
    return;
  }

  try {
    startingStream.value = true;
    error.value = "";
    success.value = "";
    const token = localStorage.getItem("auth_token");
    
    if (!token) {
      router.push("/login");
      return;
    }

    // Request screen capture
    const displayMediaOptions = {
      video: {
        displaySurface: "monitor" as const,
        cursor: "always" as const,
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      },
      preferCurrentTab: false
    };

    // Get screen stream
    const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    screenStream.value = stream;

    // Display stream in video element
    if (previewVideo.value) {
      previewVideo.value.srcObject = stream;
    }

    // Notify backend that stream has started
    const response = await apiClient.post(
      `/streams/${currentStreamId.value}/start`
    );

    if (response.data.success) {
      streamStarted.value = true;
      success.value = "Stream started successfully! Your screen is being captured.";
      
      // Monitor for stop events (user stops sharing from browser)
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        stopScreenCapture();
      });

      // Start WebRTC peer connection for viewers
      await initializeWebRTC(stream);
    } else {
      error.value = response.data.message || "Error starting stream";
      // Clean up if error
      stream.getTracks().forEach(track => track.stop());
      screenStream.value = null;
    }
  } catch (err: any) {
    console.error("Error starting stream:", err);
    
    // Clean up on error
    if (screenStream.value) {
      screenStream.value.getTracks().forEach(track => track.stop());
      screenStream.value = null;
    }

    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      error.value = "Screen sharing permission denied. Please allow screen sharing to start streaming.";
    } else if (err.name === 'NotFoundError') {
      error.value = "No screen capture device found.";
    } else if (err.response?.status === 404) {
      error.value = "Stream not found. Please create a new stream.";
    } else if (err.response?.status === 400) {
      error.value = err.response.data.message || "Stream is already live";
    } else {
      error.value = err.response?.data?.message || "Error starting stream";
    }
  } finally {
    startingStream.value = false;
  }
};

const stopScreenCapture = async () => {
  if (!currentStreamId.value || !streamStarted.value) return;

  try {
    stoppingCapture.value = true;
    if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
  mediaRecorder.value.stop();
  mediaRecorder.value = null;
}
if (wsConnection.value) {
  wsConnection.value.close();
  wsConnection.value = null;
}
    // Stop media tracks
    if (screenStream.value) {
      screenStream.value.getTracks().forEach(track => track.stop());
      screenStream.value = null;
    }

    // Clear video element
    if (previewVideo.value) {
      previewVideo.value.srcObject = null;
    }

    // Notify backend to stop stream
    try {
      await apiClient.post(`/streams/${currentStreamId.value}/stop`);
    } catch (err: any) {
      console.error("Error stopping stream on backend:", err);
    }

    streamStarted.value = false;
    success.value = "Stream stopped successfully!";
    
    // Redirect to streams page after a delay
    setTimeout(() => {
      router.push('/streams');
    }, 2000);
  } catch (err: any) {
    console.error("Error stopping screen capture:", err);
    error.value = "Error stopping stream";
  } finally {
    stoppingCapture.value = false;
  }
};

const initializeWebRTC = async (stream: MediaStream) => {
  if (!currentStreamId.value) {
    error.value = "Stream ID manquant";
    return;
  }

  const token = localStorage.getItem("auth_token");
  if (!token) {
    router.push("/login");
    return;
  }

  // URL du serveur WebSocket Node.js
  // Remplacer par ton domaine en prod : wss://ton-domaine.com:8082
  const WS_URL = import.meta.env.VITE_STREAM_WS_URL || "ws://localhost:8082";
  const wsUrl = `${WS_URL}/stream/${currentStreamId.value}?token=${encodeURIComponent(token)}`;

  console.log("[Stream] Connexion WebSocket →", wsUrl.replace(token, "****"));

  const ws = new WebSocket(wsUrl);
  wsConnection.value = ws;

  ws.onopen = () => {
    console.log("[Stream] WebSocket connecté, démarrage MediaRecorder...");
  };

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      console.log("[Stream] Message serveur:", msg);

      if (msg.type === "ready") {
        // FFmpeg est prêt → démarrer l'enregistrement
        startMediaRecorder(stream, ws);
        success.value = "🔴 Stream en direct sur Twitch !";
      } else if (msg.type === "error") {
        error.value = "Erreur serveur : " + msg.message;
        stopScreenCapture();
      }
    } catch (e) {
      console.log("[Stream] Message non-JSON:", event.data);
    }
  };

  ws.onerror = (err) => {
    console.error("[Stream] WebSocket error:", err);
    error.value = "Impossible de se connecter au serveur de streaming. Vérifiez que le serveur Node.js tourne.";
    stopScreenCapture();
  };

  ws.onclose = (event) => {
    console.log("[Stream] WebSocket fermé:", event.code, event.reason);
    if (streamStarted.value) {
      stopScreenCapture();
    }
  };
};

const startMediaRecorder = (stream: MediaStream, ws: WebSocket) => {
  // Sélectionner le meilleur codec supporté
  const mimeTypes = [
    'video/webm;codecs=h264,opus',
    'video/webm;codecs=avc1,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
  ];

  const mimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || 'video/webm';
  console.log("[MediaRecorder] Using mimeType:", mimeType);

  try {
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 3_000_000, // 3 Mbps
      audioBitsPerSecond: 160_000,
    });

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0 && ws.readyState === WebSocket.OPEN) {
        ws.send(e.data);
      }
    };

    recorder.onerror = (e) => {
      console.error("[MediaRecorder] Error:", e);
      error.value = "Erreur d'enregistrement vidéo";
    };

    recorder.onstop = () => {
      console.log("[MediaRecorder] Stopped");
    };

    // Envoyer un chunk toutes les 1 seconde
    recorder.start(1000);
    mediaRecorder.value = recorder;

    console.log("[MediaRecorder] Started, sending chunks to Twitch via WebSocket");
  } catch (err: any) {
    console.error("[MediaRecorder] Failed to start:", err);
    error.value = "Impossible de démarrer l'enregistrement : " + err.message;
    stopScreenCapture();
  }
};


onMounted(async () => {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    router.push("/login");
    return;
  }
  
  // Check if user already has a stream and load stream key (which includes stream_id)
  try {
    await loadStreamKey();
    
    // If we have a stream ID, load stream information
    if (currentStreamId.value) {
      try {
        const response = await apiClient.get(`/streams/${currentStreamId.value}`);
        
        if (response.data.success && response.data.data) {
          const stream = response.data.data;
          form.value.title = stream.title || "";
          form.value.description = stream.description || "";
          form.value.category = stream.category || "";
          form.value.game = stream.game || "";
          // Load thumbnail preview if exists with correction
          if (stream.thumbnail_url || stream.thumbnail) {
            const thumbnailUrl = stream.thumbnail_url || getStorageUrl(`streams/thumbnails/${stream.thumbnail.split('/').pop()}`);
            thumbnailPreview.value = fixImageUrl(thumbnailUrl);
          }
          form.value.use_twitch = true; // Always Twitch
          form.value.twitch_username = stream.twitch_username || "";
          form.value.twitch_stream_key = stream.twitch_stream_key || "";
          success.value = "Your existing stream information has been loaded. You can modify it above.";
        }
      } catch (loadError) {
        console.error("Error loading stream details:", loadError);
      }
    }
  } catch (error) {
    console.error("Error loading existing stream:", error);
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

.form-control {
  color: white;
}

.form-control::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-control:focus {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: #FF9F00;
  color: white;
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

