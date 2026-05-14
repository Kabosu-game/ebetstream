<template>
  <div class="tw-page">
<!-- Header -->
              <div class="row mb-5">
                <div class="col-12">
                  <button class="tw-btn tw-btn--secondary tw-detail-back" @click="$router.push('/clans')">
                    <i class="fas fa-arrow-left me-2"></i>
                    Back to Clans
                  </button>
                  
                  <div v-if="loading" class="tw-empty"><div class="spinner"></div></div>

                  <div v-else-if="error" class="alert alert-danger">
                    <i class="fas fa-exclamation-circle me-2"></i>{{ error }}
                  </div>

                  <div v-else-if="clan" class="tw-page-hero mb-4">
                    <div class="d-flex align-items-center gap-3 mb-3">
                      <p class="tw-page-hero__eyebrow">
                        <i class="fas fa-fist-raised"></i> {{ clan.name }}
                      </p>
                      <span v-if="clan.status === 'active'" class="badge bg-success">{{ $t('common.active') }}</span>
                      <span v-else class="badge bg-secondary">{{ $t('common.inactive') }}</span>
                    </div>
                    <h1 class="tw-page-hero__title">
                      {{ clan.name }} <span>{{ $t('ui.clan') }}</span>
                    </h1>
                    <p v-if="clan.description" class="tw-page-hero__sub">
                      {{ clan.description }}
                    </p>
                    <div class="d-flex flex-wrap gap-4 mb-4">
                      <div>
                        <i class="fas fa-crown text-warning me-2"></i>
                        <strong>{{ $t('ui.leader_2') }}</strong> {{ clan.leader?.username || "No leader" }}
                      </div>
                      <div>
                        <i class="fas fa-users text-primary me-2"></i>
                        <strong>{{ $t('ui.members_2') }}</strong> {{ clan.members_count || 0 }}/{{ clan.max_members || 50 }}
                      </div>
                      <div>
                        <i class="fas fa-calendar text-info me-2"></i>
                        <strong>{{ $t('ui.created') }}</strong> {{ formatDate(clan.created_at) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div v-if="clan && isAuthenticated" class="row mb-4">
                <div class="col-12">
                  <div class="d-flex gap-3 flex-wrap">
                    <button 
                      v-if="!isMember"
                      class="tw-btn tw-btn--primary"
                      @click="joinClan"
                      :disabled="joining || !clan.can_join"
                    >
                      <span v-if="joining">{{ $t('ui.joining') }}</span>
                      <span v-else>
                        <i class="fas fa-user-plus me-2"></i>{{ $t('ui.join_clan') }}</span>
                    </button>
                    <button 
                      v-else
                      class="tw-btn tw-btn--secondary"
                      @click="leaveClan"
                      :disabled="leaving || isLeader"
                    >
                      <span v-if="leaving">{{ $t('ui.leaving') }}</span>
                      <span v-else>
                        <i class="fas fa-user-minus me-2"></i>{{ $t('ui.leave_clan') }}</span>
                    </button>
                    <button 
                      v-if="isMember && !isLeader && !hasApplied"
                      class="tw-btn tw-btn--secondary"
                      @click="showApplyModal = true"
                    >
                      <i class="fas fa-crown me-2"></i>{{ $t('ui.apply_for_leadership') }}</button>
                  </div>
                </div>
              </div>

              <!-- Tabs -->
              <div v-if="clan" class="row">
                <div class="col-12">
                  <ul class="nav nav-tabs mb-4 border-0">
                    <li class="nav-item">
                      <button 
                        class="nav-link"
                        :class="{ active: activeTab === 'members' }"
                        @click="activeTab = 'members'"
                      >
                        <i class="fas fa-users me-2"></i>{{ $t('ui.members') }}</button>
                    </li>
                    <li class="nav-item" v-if="isMember">
                      <button 
                        class="nav-link"
                        :class="{ active: activeTab === 'chat' }"
                        @click="activeTab = 'chat'"
                      >
                        <i class="fas fa-comments me-2"></i>{{ $t('ui.chat') }}</button>
                    </li>
                    <li class="nav-item" v-if="isMember">
                      <button 
                        class="nav-link"
                        :class="{ active: activeTab === 'leadership' }"
                        @click="activeTab = 'leadership'"
                      >
                        <i class="fas fa-crown me-2"></i>{{ $t('ui.leadership') }}</button>
                    </li>
                  </ul>

                  <!-- Members Tab -->
                  <div v-if="activeTab === 'members'" class="tab-content">
                    <div class="tw-content-block">
                      <h5 class="text-white mb-4">Clan Members ({{ clan.members_count || 0 }})</h5>
                      <div v-if="loadingMembers" class="text-center py-3">
                        <div class="spinner-border spinner-border-sm text-primary"></div>
                      </div>
                      <div v-else-if="members.length > 0" class="row g-3">
                        <div v-for="member in members" :key="member.id" class="col-12 col-md-6 col-lg-4">
                          <div class="d-flex align-items-center gap-3 p-3 rounded" style="background: rgba(255,255,255,0.05);">
                            <div class="flex-shrink-0">
                              <i class="fas fa-user-circle fs-2 text-white-50"></i>
                            </div>
                            <div class="flex-grow-1">
                              <div class="text-white fw-bold">
                                {{ member.username }}
                                <span v-if="clan.leader_id === member.id" class="badge bg-warning ms-2">
                                  <i class="fas fa-crown"></i>{{ $t('ui.leader') }}</span>
                              </div>
                              <small class="text-white-50">Joined {{ formatDate(member.pivot?.created_at) }}</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-else class="text-center py-5 text-white-50">
                        No members found
                      </div>
                    </div>
                  </div>

                  <!-- Chat Tab -->
                  <div v-if="activeTab === 'chat' && isMember" class="tab-content">
                    <div class="tw-content-block">
                      <h5 class="text-white mb-4">{{ $t('ui.clan_chat') }}</h5>
                      <div class="chat-container" style="height: 400px; overflow-y: auto; background: rgba(0,0,0,0.2); border-radius: 10px; padding: 1rem;">
                        <div v-if="loadingMessages" class="text-center py-3">
                          <div class="spinner-border spinner-border-sm text-primary"></div>
                        </div>
                        <div v-else-if="messages.length > 0">
                          <div 
                            v-for="message in messages" 
                            :key="message.id" 
                            class="mb-3 p-3 rounded"
                            :style="{ background: message.user_id === currentUserId ? 'rgba(255,159,0,0.2)' : 'rgba(255,255,255,0.05)' }"
                          >
                            <div class="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <strong class="text-white">{{ message.user?.username }}</strong>
                                <small class="text-white-50 ms-2">{{ formatTime(message.created_at) }}</small>
                              </div>
                            </div>
                            <p class="text-white mb-0">{{ message.message }}</p>
                          </div>
                        </div>
                        <div v-else class="text-center py-5 text-white-50">
                          No messages yet. Start the conversation!
                        </div>
                      </div>
                      <div class="mt-3">
                        <form @submit.prevent="sendMessage">
                          <div class="d-flex gap-2">
                            <input 
                              v-model="newMessage"
                              type="text" 
                              class="form-control n11-bg text-white border-secondary" 
                              :placeholder="$t('ui.type_your_message')"
                              :disabled="sendingMessage"
                              maxlength="1000"
                            />
                            <button 
                              type="submit" 
                              class="tw-btn tw-btn--primary"
                              :disabled="sendingMessage || !newMessage.trim()"
                            >
                              <i class="fas fa-paper-plane"></i>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>

                  <!-- Leadership Tab -->
                  <div v-if="activeTab === 'leadership' && isMember" class="tab-content">
                    <div class="tw-content-block">
                      <h5 class="text-white mb-4">{{ $t('ui.leadership_election') }}</h5>
                      
                      <!-- Current Leader -->
                      <div v-if="clan.leader" class="mb-4 p-3 rounded" style="background: rgba(255,159,0,0.1); border: 1px solid rgba(255,159,0,0.3);">
                        <div class="d-flex align-items-center gap-3">
                          <i class="fas fa-crown fs-3 text-warning"></i>
                          <div>
                            <strong class="text-white">Current Leader: {{ clan.leader.username }}</strong>
                            <p class="text-white-50 mb-0 small">{{ $t('ui.the_leader_manages_the_clan_and_makes_important_decisions') }}</p>
                          </div>
                        </div>
                      </div>

                      <!-- Candidates -->
                      <div v-if="candidates.length > 0" class="mb-4">
                        <h6 class="text-white mb-3">{{ $t('ui.candidates_for_leadership') }}</h6>
                        <div class="row g-3">
                          <div v-for="candidate in candidates" :key="candidate.id" class="col-12">
                            <div class="p-3 rounded" style="background: rgba(255,255,255,0.05);">
                              <div class="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <strong class="text-white">{{ candidate.user?.username }}</strong>
                                  <p v-if="candidate.motivation" class="text-white-50 small mb-2 mt-2">
                                    {{ candidate.motivation }}
                                  </p>
                                </div>
                                <div class="text-end">
                                  <div class="text-warning mb-2">
                                    <i class="fas fa-vote-yea me-1"></i>{{ candidate.vote_count }} votes
                                  </div>
                                  <button 
                                    v-if="!hasVoted && candidate.user_id !== currentUserId"
                                    class="btn btn-sm btn-primary"
                                    @click="voteForCandidate(candidate.id)"
                                    :disabled="voting"
                                  >
                                    <i class="fas fa-check me-1"></i>{{ $t('ui.vote') }}</button>
                                  <span v-else-if="hasVotedFor(candidate.id)" class="badge bg-success">
                                    <i class="fas fa-check"></i>{{ $t('ui.voted') }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-else class="text-center py-4 text-white-50">
                        <i class="fas fa-user-slash fs-1 mb-3 d-block"></i>
                        No candidates yet. Be the first to apply!
                      </div>
                    </div>
                  </div>
                </div>
              </div>

    <!-- Apply for Leadership Modal -->
    <div v-if="showApplyModal" class="popup-overlay" @click.self="showApplyModal = false">
      <div class="popup-box p-5 rounded-4 shadow-lg n11-bg">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="fw-bold text-white mb-0">{{ $t('ui.apply_for_leadership') }}</h3>
          <button class="btn-close btn-close-white" @click="showApplyModal = false"></button>
        </div>
        
        <form @submit.prevent="applyForLeadership">
          <div class="form-group mb-4">
            <label class="text-white mb-2 d-block fw-bold">{{ $t('ui.why_do_you_want_to_become_the_leader_optional') }}</label>
            <textarea 
              v-model="applyForm.motivation"
              class="form-control n11-bg text-white border-secondary" 
              rows="4"
              :placeholder="$t('ui.explain_why_you_would_be_a_good_leader_for_this_clan')"
              maxlength="500"
            ></textarea>
          </div>

          <div v-if="applyError" class="alert alert-danger mb-3">{{ applyError }}</div>
          <div v-if="applySuccess" class="alert alert-success mb-3">{{ applySuccess }}</div>

          <div class="d-flex gap-3">
            <button 
              type="submit" 
              class="tw-btn tw-btn--primary flex-fill" 
              :disabled="applying"
            >
              <span v-if="applying">{{ $t('ui.applying') }}</span>
              <span v-else>
                <i class="fas fa-crown me-2"></i>{{ $t('ui.submit_application') }}</span>
            </button>
            <button 
              type="button" 
              class="tw-btn tw-btn--secondary" 
              @click="showApplyModal = false"
              :disabled="applying"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { ref, onMounted, computed, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiClient from "@/utils/axios";

const route = useRoute();
const router = useRouter();

interface Clan {
  id: number;
  name: string;
  logo?: string;
  description?: string;
  leader_id?: number;
  leader?: {
    id: number;
    username: string;
  };
  status: string;
  member_count: number;
  max_members: number;
  members_count?: number;
  created_at: string;
  can_join?: boolean;
  members?: any[];
  candidates?: any[];
}

interface Message {
  id: number;
  user_id: number;
  user?: {
    id: number;
    username: string;
  };
  message: string;
  created_at: string;
}

interface Candidate {
  id: number;
  user_id: number;
  user?: {
    id: number;
    username: string;
  };
  motivation?: string;
  vote_count: number;
  status: string;
}

const clan = ref<Clan | null>(null);
const members = ref<any[]>([]);
const messages = ref<Message[]>([]);
const candidates = ref<Candidate[]>([]);
const loading = ref(false);
const loadingMembers = ref(false);
const loadingMessages = ref(false);
const error = ref("");
const activeTab = ref("members");
const isMember = ref(false);
const isLeader = ref(false);
const hasApplied = ref(false);
const hasVoted = ref(false);
const currentUserId = ref<number | null>(null);
const joining = ref(false);
const leaving = ref(false);
const voting = ref(false);
const sendingMessage = ref(false);
const showApplyModal = ref(false);
const newMessage = ref("");
const applyForm = ref({
  motivation: "",
});
const applyError = ref("");
const applySuccess = ref("");
const applying = ref(false);
let messagePollingInterval: any = null;

const isAuthenticated = computed(() => {
  return !!localStorage.getItem("auth_token");
});

const loadClan = async () => {
  try {
    loading.value = true;
    error.value = "";
    
    const token = localStorage.getItem("auth_token");
    const response = await apiClient.get(`/clans/${route.params.id}`);

    if (response.data.success) {
      clan.value = response.data.data;
      
      // Check if user is member
      if (token) {
        const userResponse = await apiClient.get("/user");
        if (userResponse.data && userResponse.data.id) {
          currentUserId.value = userResponse.data.id;
          if (clan.value) {
            isMember.value = clan.value.members?.some((m: any) => m.id === currentUserId.value) || false;
            isLeader.value = clan.value.leader_id === currentUserId.value;
            
            // Check if user has applied
            if (clan.value.candidates) {
              hasApplied.value = clan.value.candidates.some((c: any) => c.user_id === currentUserId.value);
            }
            
            // Load candidates
            if (clan.value.candidates) {
              candidates.value = clan.value.candidates;
            }
          }
        }
      }
      
      // Load members
      if (clan.value) {
        if (clan.value.members) {
          members.value = clan.value.members;
        } else {
          loadMembers();
        }
        
        // Load candidates
        if (clan.value.candidates) {
          candidates.value = clan.value.candidates;
        }
      }
      
      // Load messages if member
      if (isMember.value) {
        loadMessages();
        startMessagePolling();
      }
    } else {
      error.value = response.data.message || "Error loading clan";
    }
  } catch (err: any) {
    console.error("Error loading clan:", err);
    if (err.response?.status === 404) {
      error.value = "Clan not found";
    } else {
      error.value = err.response?.data?.message || "Error loading clan";
    }
  } finally {
    loading.value = false;
  }
};

const loadMembers = async () => {
  if (!clan.value) return;
  
  try {
    loadingMembers.value = true;
    // Members are already loaded in clan data
    if (clan.value.members) {
      members.value = clan.value.members;
    }
  } catch (err: any) {
    console.error("Error loading members:", err);
  } finally {
    loadingMembers.value = false;
  }
};

const loadMessages = async () => {
  if (!clan.value || !isMember.value) return;
  
  try {
    loadingMessages.value = true;
    const response = await apiClient.get(`/clans/${clan.value.id}/messages`);
    
    if (response.data.success) {
      messages.value = response.data.data.data || response.data.data || [];
      // Scroll to bottom
      setTimeout(() => {
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    }
  } catch (err: any) {
    console.error("Error loading messages:", err);
  } finally {
    loadingMessages.value = false;
  }
};

const startMessagePolling = () => {
  // Poll for new messages every 3 seconds
  messagePollingInterval = setInterval(() => {
    if (isMember.value && activeTab.value === 'chat') {
      loadMessages();
    }
  }, 3000);
};

const hasVotedFor = (candidateId: number): boolean => {
  // Check if user has voted for this candidate
  // This will be updated when we implement vote checking
  return hasVoted.value;
};

const joinClan = async () => {
  if (!clan.value) return;
  
  try {
    joining.value = true;
    const response = await apiClient.post(`/clans/${clan.value.id}/join`);
    
    if (response.data.success) {
      isMember.value = true;
      await loadClan();
      if (activeTab.value !== 'chat') {
        activeTab.value = 'chat';
      }
      loadMessages();
      startMessagePolling();
    } else {
      error.value = response.data.message || "Error joining clan";
    }
  } catch (err: any) {
    console.error("Error joining clan:", err);
    error.value = err.response?.data?.message || "Error joining clan";
  } finally {
    joining.value = false;
  }
};

const leaveClan = async () => {
  if (!clan.value) return;
  
  if (!confirm("Are you sure you want to leave this clan?")) {
    return;
  }
  
  try {
    leaving.value = true;
    const response = await apiClient.post(`/clans/${clan.value.id}/leave`);
    
    if (response.data.success) {
      isMember.value = false;
      hasApplied.value = false;
      if (messagePollingInterval) {
        clearInterval(messagePollingInterval);
      }
      await loadClan();
    } else {
      error.value = response.data.message || "Error leaving clan";
    }
  } catch (err: any) {
    console.error("Error leaving clan:", err);
    error.value = err.response?.data?.message || "Error leaving clan";
  } finally {
    leaving.value = false;
  }
};

const sendMessage = async () => {
  if (!clan.value || !newMessage.value.trim()) return;
  
  try {
    sendingMessage.value = true;
    const response = await apiClient.post(`/clans/${clan.value.id}/messages`, {
      message: newMessage.value.trim(),
    });
    
    if (response.data.success) {
      newMessage.value = "";
      await loadMessages();
    } else {
      error.value = response.data.message || "Error sending message";
    }
  } catch (err: any) {
    console.error("Error sending message:", err);
    error.value = err.response?.data?.message || "Error sending message";
  } finally {
    sendingMessage.value = false;
  }
};

const applyForLeadership = async () => {
  if (!clan.value) return;
  
  try {
    applying.value = true;
    applyError.value = "";
    applySuccess.value = "";
    
    const response = await apiClient.post(`/clans/${clan.value.id}/apply-leadership`, {
      motivation: applyForm.value.motivation || null,
    });
    
    if (response.data.success) {
      applySuccess.value = "Application submitted successfully! Members can now vote for you.";
      showApplyModal.value = false;
      applyForm.value.motivation = "";
      hasApplied.value = true;
      await loadClan();
      if (activeTab.value !== 'leadership') {
        activeTab.value = 'leadership';
      }
    } else {
      applyError.value = response.data.message || "Error submitting application";
    }
  } catch (err: any) {
    console.error("Error applying for leadership:", err);
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      applyError.value = Object.values(errors).flat().join(", ");
    } else {
      applyError.value = err.response?.data?.message || "Error submitting application";
    }
  } finally {
    applying.value = false;
  }
};

const voteForCandidate = async (candidateId: number) => {
  if (!clan.value) return;
  
  try {
    voting.value = true;
    const response = await apiClient.post(`/clans/${clan.value.id}/candidates/${candidateId}/vote`);
    
    if (response.data.success) {
      hasVoted.value = true;
      await loadClan();
    } else {
      error.value = response.data.message || "Error voting";
    }
  } catch (err: any) {
    console.error("Error voting:", err);
    error.value = err.response?.data?.message || "Error voting";
  } finally {
    voting.value = false;
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(() => {
  loadClan();
});

onUnmounted(() => {
  if (messagePollingInterval) {
    clearInterval(messagePollingInterval);
  }
});
</script>

