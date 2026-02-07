<template>
  <div class="pay_method__paymethod p-4 p-lg-6 p2-bg rounded-8">
    <div class="pay_method__paymethod-title mb-5 mb-md-6">
      <h5 class="n10-color">Profil</h5>
    </div>

    <div class="pay_method__formarea">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Profile Content -->
      <div v-else>
        <!-- Photo de profil avec option de changement -->
        <div class="text-center mb-5">
          <div class="position-relative d-inline-block">
            <div class="profile_photo_container">
              <img 
                v-if="profilePhotoUrl"
                :src="profilePhotoUrl" 
                alt="Photo de profil"
                class="profile_photo rounded-circle"
                @error="handleImageError"
                @load="onImageLoad"
              />
              <div v-else class="profile_photo_placeholder rounded-circle d-flex align-items-center justify-content-center">
                <IconUser :size="48" class="text-white" />
              </div>
            </div>
            <label for="profilePhotoInput" class="profile_photo_edit_btn">
              <IconCamera :size="20" />
            </label>
            <input 
              id="profilePhotoInput"
              type="file" 
              accept="image/*" 
              @change="handlePhotoUpload"
              class="d-none"
              :disabled="uploadingPhoto"
            />
          </div>
          <p v-if="uploadingPhoto" class="text-white small mt-2">Uploading...</p>
        </div>

        <!-- Player Basic Info -->
        <div class="row g-3 mb-5">
          <!-- Pseudo in-game -->
          <div class="col-6 col-md-6">
            <div class="info_card n11-bg rounded-8 p-3 h-100">
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="fs-3">🕹️</span>
                <p class="mb-0 fw-bold small">Pseudo in-game</p>
              </div>
              <div class="d-flex align-items-center gap-2">
                <p class="mb-0 text-white">{{ profileData.in_game_pseudo || profileData.username || 'None' }}</p>
                <span v-if="isCertified" class="badge bg-success">
                  <i class="fas fa-certificate me-1"></i>Certified
                </span>
              </div>
            </div>
          </div>
          
          <!-- Email -->
          <div class="col-6 col-md-6">
            <div class="info_card n11-bg rounded-8 p-3 h-100">
              <div class="d-flex align-items-center justify-content-between gap-2 mb-2">
                <div class="d-flex align-items-center gap-2">
                <span class="fs-3">📧</span>
                <p class="mb-0 fw-bold small">Email</p>
              </div>
                <button 
                  v-if="!editingEmail"
                  class="edit-btn"
                  @click="editingEmail = true"
                  title="Edit Email"
                  type="button"
                >
                  <IconPencil :size="16" />
                </button>
              </div>
              <div v-if="!editingEmail">
              <p class="mb-0 text-white small text-truncate">{{ profileData.user?.email || 'None' }}</p>
              </div>
              <div v-else class="d-flex flex-column gap-2">
                <input 
                  v-model="emailInput"
                  type="email"
                  class="form-control form-control-sm"
                  placeholder="your.email@example.com"
                />
                <div class="d-flex gap-2">
                  <button 
                    class="btn btn-sm btn-success flex-fill"
                    @click="saveEmail"
                    :disabled="savingEmail"
                  >
                    <IconCheck :size="16" />
                  </button>
                  <button 
                    class="btn btn-sm btn-secondary flex-fill"
                    @click="cancelEditEmail"
                    :disabled="savingEmail"
                  >
                    <IconX :size="16" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Numéro de téléphone -->
          <div class="col-6 col-md-6">
            <div class="info_card n11-bg rounded-8 p-3 h-100">
              <div class="d-flex align-items-center justify-content-between gap-2 mb-2">
                <div class="d-flex align-items-center gap-2">
                  <span class="fs-3">📱</span>
                  <p class="mb-0 fw-bold small">Phone</p>
                </div>
                <button 
                  v-if="!editingPhone"
                  class="edit-btn"
                  @click="editingPhone = true"
                  title="Edit Phone"
                  type="button"
                >
                  <IconPencil :size="16" />
                </button>
              </div>
              <div v-if="!editingPhone">
                <p class="mb-0 text-white small">{{ profileData.user?.phone || 'None' }}</p>
              </div>
              <div v-else class="d-flex flex-column gap-2">
                <input 
                  v-model="phoneInput"
                  type="tel"
                  class="form-control form-control-sm"
                  placeholder="+229 61 00 00 00"
                />
                <div class="d-flex gap-2">
                  <button 
                    class="btn btn-sm btn-success flex-fill"
                    @click="savePhone"
                    :disabled="savingPhone"
                  >
                    <IconCheck :size="16" />
                  </button>
                  <button 
                    class="btn btn-sm btn-secondary flex-fill"
                    @click="cancelEditPhone"
                    :disabled="savingPhone"
                  >
                    <IconX :size="16" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Nom complet -->
          <div class="col-6 col-md-6">
            <div class="info_card n11-bg rounded-8 p-3 h-100">
              <div class="d-flex align-items-center justify-content-between gap-2 mb-2">
                <div class="d-flex align-items-center gap-2">
                  <span class="fs-3">👤</span>
                  <p class="mb-0 fw-bold small">Full Name</p>
                </div>
                <button 
                  v-if="!editingFullName"
                  class="edit-btn"
                  @click="editingFullName = true"
                  title="Edit Full Name"
                  type="button"
                >
                  <IconPencil :size="16" />
                </button>
              </div>
              <div v-if="!editingFullName">
                <p class="mb-0 text-white small">{{ profileData.full_name || 'None' }}</p>
              </div>
              <div v-else class="d-flex flex-column gap-2">
                <input 
                  v-model="fullNameInput"
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="Your full name"
                />
                <div class="d-flex gap-2">
                  <button 
                    class="btn btn-sm btn-success flex-fill"
                    @click="saveFullName"
                    :disabled="savingFullName"
                  >
                    <IconCheck :size="16" />
                  </button>
                  <button 
                    class="btn btn-sm btn-secondary flex-fill"
                    @click="cancelEditFullName"
                    :disabled="savingFullName"
                  >
                    <IconX :size="16" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Code Promo -->
          <div class="col-6 col-md-6">
            <div class="info_card n11-bg rounded-8 p-3 h-100">
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="fs-3">🎁</span>
                <p class="mb-0 fw-bold small">Promo Code</p>
              </div>
              <div v-if="profileData.user?.promo_code" class="d-flex align-items-center gap-2">
                <p class="mb-0 text-white small fw-bold promo_code_text">{{ profileData.user.promo_code }}</p>
                <button 
                  class="btn btn-sm btn-link text-primary p-0"
                  @click="copyPromoCode(profileData.user.promo_code)"
                  title="Copy promo code"
                >
                  <i class="fas fa-copy small"></i>
                </button>
              </div>
              <p v-else class="mb-0 text-white small">None</p>
            </div>
          </div>
          
          <!-- Statut -->
              <div class="col-6 col-md-6">
                <div class="info_card n11-bg rounded-8 p-3 h-100 d-flex flex-column align-items-start justify-content-center text-start">
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="fs-3">🏆</span>
                <p class="mb-0 fw-bold small">Status</p>
              </div>
              <p class="mb-0 text-white small">{{ profileData.status || 'None' }}</p>
                </div>
              </div>

              <!-- Country -->
              <div class="col-6 col-md-6">
                <div class="info_card n11-bg rounded-8 p-3 h-100">
                  <div class="d-flex align-items-center justify-content-between gap-2 mb-2">
                    <div class="d-flex align-items-center gap-2">
                      <span class="fs-3">🌍</span>
                      <p class="mb-0 fw-bold small">Country</p>
                    </div>
                    <button 
                      v-if="!editingCountry"
                      class="edit-btn"
                      @click="editingCountry = true"
                      title="Edit Country"
                      type="button"
                    >
                      <IconPencil :size="16" />
                    </button>
                  </div>
                  <div v-if="!editingCountry">
                    <p class="mb-0 text-white small">{{ profileData.country || 'None' }}</p>
                  </div>
                  <div v-else class="d-flex flex-column gap-2">
                    <input 
                      v-model="countryInput"
                      type="text"
                      class="form-control form-control-sm"
                      placeholder="Enter your country"
                    />
                    <div class="d-flex gap-2">
                      <button 
                        class="btn btn-sm btn-success flex-fill"
                        @click="saveCountry"
                        :disabled="savingCountry"
                      >
                        <IconCheck :size="16" />
                      </button>
                      <button 
                        class="btn btn-sm btn-secondary flex-fill"
                        @click="cancelEditCountry"
                        :disabled="savingCountry"
                      >
                        <IconX :size="16" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
      </div>

      <!-- Biography Section -->
      <div class="mb-5">
        <div class="info_card n11-bg rounded-8 p-4">
          <div class="d-flex align-items-center justify-content-between gap-2 mb-3">
            <div class="d-flex align-items-center gap-2">
              <span class="fs-3">📝</span>
              <h6 class="fw-bold mb-0">Biography</h6>
            </div>
            <button 
              v-if="!editingBio"
              class="edit-btn"
              @click="editingBio = true"
              title="Edit Biography"
              type="button"
            >
              <IconPencil :size="16" />
            </button>
          </div>
          <div v-if="!editingBio">
            <p class="mb-0 text-white" style="opacity: 0.9; white-space: pre-wrap;">{{ profileData.bio || 'No biography yet. Click edit to add one.' }}</p>
          </div>
          <div v-else class="d-flex flex-column gap-2">
            <textarea 
              v-model="bioInput"
              class="form-control"
              rows="5"
              placeholder="Tell us about yourself..."
              style="min-height: 120px;"
            ></textarea>
            <div class="d-flex gap-2">
              <button 
                class="btn btn-sm btn-success flex-fill"
                @click="saveBio"
                :disabled="savingBio"
              >
                <IconCheck :size="16" class="me-1" />
                Save
              </button>
              <button 
                class="btn btn-sm btn-secondary flex-fill"
                @click="cancelEditBio"
                :disabled="savingBio"
              >
                <IconX :size="16" class="me-1" />
                Cancel
              </button>
            </div>
            </div>
          </div>
      </div>

      <!-- Performance Profile -->
      <div class="mb-5">
        <h6 class="fw-bold mb-3">📊 Performance Profile</h6>
        <div class="n11-bg rounded-8 p-3 d-flex flex-column gap-2">
          <div class="d-flex justify-content-between">
            <span>🏅 Tournaments Won</span>
              <span>{{ profileData.tournaments_won || 0 }} {{ formatTournamentsList(profileData.tournaments_list) }}</span>
          </div>
          <div class="d-flex justify-content-between">
            <span>🔥 EbetStream Ranking</span>
              <span>{{ formatRanking(profileData.ranking, profileData.division) }}</span>
          </div>
          <div class="d-flex justify-content-between">
            <span>💯 Global Score</span>
              <span>{{ profileData.global_score || 0 }} pts</span>
          </div>
          <div class="d-flex justify-content-between">
            <span>🗓️ Current Season</span>
              <span>{{ profileData.current_season || 'None' }}</span>
          </div>
        </div>
      </div>

      <!-- Badges & Distinctions -->
      <div class="mb-5">
        <h6 class="fw-bold mb-3">🧾 Badges & distinctions</h6>
        <div class="n11-bg rounded-8 p-3 d-flex flex-column gap-2">
            <template v-if="profileData.badges && profileData.badges.length > 0">
              <span v-for="(badge, index) in profileData.badges" :key="index">{{ badge }}</span>
            </template>
            <span v-else class="text-muted">None</span>
        </div>
      </div>

      <!-- Official Profile & QR -->
      <div class="d-flex gap-5 mb-5 flex-wrap">
          <div class="flex-grow-1 text-center n11-bg rounded-8 p-4">
            <span class="fs-1 mb-3 d-block">🔗</span>
            <div v-if="profileData.profile_url" class="profile_link_container">
              <a 
                :href="profileData.profile_url" 
                target="_blank"
                class="profile_link"
              >
                <i class="fas fa-external-link-alt me-2"></i>
                <span class="profile_link_text">{{ formatProfileUrl(profileData.profile_url) }}</span>
                <i class="fas fa-copy ms-2 copy_icon" 
                   @click.stop="copyProfileUrl(profileData.profile_url, $event)"
                   title="Copy link"></i>
              </a>
            </div>
            <p v-else class="mt-2 small text-muted">None</p>
          </div>
          <div class="flex-grow-1 text-center n11-bg rounded-8 p-4">
            <div v-if="profileData.qr_code">
              <img :src="profileData.qr_code" alt="QR Code" class="qr_code_img mb-2" />
        </div>
            <div v-else class="qr_code_placeholder mb-2">
          <span class="fs-1">⬜</span>
            </div>
            <p class="mt-2 small">Scan QR Code for complete profile</p>
        </div>
      </div>

      <!-- Certification -->
      <div class="mb-5">
        <h6 class="fw-bold mb-3">🖋️ Certified par</h6>
        <div class="n11-bg rounded-8 p-3 d-flex flex-column gap-1">
            <template v-if="profileData.certifications && profileData.certifications.length > 0">
              <div v-for="(cert, index) in profileData.certifications" :key="index" class="d-flex align-items-center gap-2">
                <span>{{ cert }}</span>
                <span v-if="cert === 'Ebetstream'" class="badge bg-success">
                  <i class="fas fa-certificate me-1"></i>Certified
                </span>
              </div>
            </template>
            <span v-else class="text-muted">None</span>
          </div>
        </div>
      </div>

      <!-- Certification Request Section -->
      <div class="mb-5" v-if="!loading">
        <div class="certification_section n11-bg rounded-8 p-4">
          <div class="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h5 class="fw-bold mb-1 text-white">🏆 Certification Ebetstream</h5>
              <p class="text-white small mb-0" style="opacity: 0.8;">Get your official certification</p>
            </div>
            <div v-if="certificationStatus?.request?.status === 'approved'" class="badge bg-success fs-6 px-3 py-2">
              <i class="fas fa-check-circle me-2"></i>Certified
            </div>
            <div v-else-if="certificationStatus?.request?.status === 'pending'" class="badge bg-warning text-dark fs-6 px-3 py-2">
              <i class="fas fa-clock me-2"></i>Pending
            </div>
            <div v-else-if="certificationStatus?.request?.status === 'rejected'" class="badge bg-danger fs-6 px-3 py-2">
              <i class="fas fa-times-circle me-2"></i>Rejected
            </div>
          </div>

          <!-- Conditions List -->
          <div class="conditions_list mb-4" v-if="!loadingEligibility">
            <h6 class="fw-bold mb-3">Conditions to obtain Ebetstream Certification</h6>
            <ul class="conditions_checklist">
              <li class="condition_item">
                <i class="fas fa-check-circle text-success me-2"></i>
                <span>Be over 18 years old (or legal age of the country)</span>
              </li>
              <li class="condition_item">
                <i :class="(certificationConditions.complete_profile?.met ? 'fas fa-check-circle text-success' : 'fas fa-times-circle text-danger') + ' me-2'"></i>
                <span>Have a complete profile (photo, bio, country, social network, etc.)</span>
              </li>
              <li class="condition_item">
                <i class="fas fa-check-circle text-success me-2"></i>
                <span>Have exemplary behavior: zero sanctions, zero fraud, zero toxic behavior</span>
              </li>
              <li class="condition_item">
                <i class="fas fa-check-circle text-success me-2"></i>
                <span>Have a positive reputation on the platform (fair-play score, positive reviews, clean history)</span>
              </li>
            </ul>
            <div v-if="!certificationConditions.complete_profile?.met && Object.keys(certificationConditions).length > 0" class="alert alert-warning mt-3">
              <strong>Missing fields:</strong> {{ certificationConditions.complete_profile?.details || '' }}
            </div>
          </div>
          <div v-else-if="loadingEligibility" class="text-center py-3">
            <div class="spinner-border spinner-border-sm text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <!-- Request Status Messages -->
          <div v-if="certificationStatus?.request?.status === 'pending'" class="alert alert-info mb-4">
            <i class="fas fa-info-circle me-2"></i>
            <strong>Request under review</strong>
            <p class="mb-0 small mt-2">Your certification request is being processed. You will be notified once a decision is made.</p>
          </div>

          <div v-if="certificationStatus?.request?.status === 'rejected'" class="alert alert-danger mb-4">
            <i class="fas fa-exclamation-triangle me-2"></i>
            <strong>Request rejected</strong>
            <p v-if="certificationStatus.request.rejection_reason" class="mb-0 small mt-2">
              <strong>Reason:</strong> {{ certificationStatus.request.rejection_reason }}
            </p>
            <button class="btn btn-sm btn-outline-danger mt-3" @click="showCertificationForm = true">
              <i class="fas fa-redo me-2"></i>Try again
            </button>
          </div>

          <!-- Certification Form -->
          <div v-if="!certificationStatus?.request || certificationStatus?.request?.status === 'rejected'">
            <div v-if="!certificationEligible && !loadingEligibility" class="alert alert-warning mb-4">
              <i class="fas fa-exclamation-triangle me-2"></i>
              <strong>You do not meet all the conditions</strong>
              <p class="mb-0 small mt-2">Please complete your profile before requesting certification.</p>
            </div>

            <div v-if="showCertificationForm && certificationEligible" class="certification_form">
              <h6 class="fw-bold mb-3">Request Form</h6>
              
              <div class="mb-3">
                <label class="form-label fw-bold">Date of Birth <span class="text-danger">*</span></label>
                <input 
                  v-model="certificationForm.date_of_birth"
                  type="date"
                  class="form-control"
                  :max="maxDateOfBirth"
                  required
                />
                <small class="text-muted">You must be at least 18 years old</small>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold">ID Type <span class="text-danger">*</span></label>
                <select 
                  v-model="certificationForm.id_type"
                  class="form-control"
                  required
                >
                  <option value="">Select a type</option>
                  <option value="passport">Passport</option>
                  <option value="national_id">National ID Card</option>
                  <option value="driving_license">Driving License</option>
                  <option value="residence_permit">Residence Permit</option>
                </select>
                <small class="text-muted">Select the type of ID you want to use</small>
              </div>

              <div class="mb-4">
                <label class="form-label fw-bold">ID Number <span class="text-danger">*</span></label>
                <input 
                  v-model="certificationForm.id_number"
                  type="text"
                  class="form-control"
                  placeholder="Enter your ID number"
                  required
                  maxlength="100"
                />
                <small class="text-muted">Enter the complete number of your ID</small>
              </div>

              <div class="d-flex gap-2">
                <button 
                  class="btn btn-primary flex-fill"
                  @click="submitCertificationRequest"
                  :disabled="submittingCertification || !certificationForm.date_of_birth || !certificationForm.id_type || !certificationForm.id_number"
                >
                  <i v-if="submittingCertification" class="fas fa-spinner fa-spin me-2"></i>
                  <i v-else class="fas fa-paper-plane me-2"></i>
                  {{ submittingCertification ? 'Submitting...' : 'Submit Request' }}
                </button>
                <button 
                  class="btn btn-secondary"
                  @click="showCertificationForm = false"
                  :disabled="submittingCertification"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div v-else-if="certificationEligible && !showCertificationForm">
              <button 
                class="btn btn-primary w-100"
                @click="showCertificationForm = true"
              >
                <i class="fas fa-certificate me-2"></i>
                Request Certification
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from "vue";
import {
  IconPencil,
  IconCheck,
  IconX,
  IconUser,
  IconCamera,
  IconCertificate,
  IconCircleCheck,
  IconClock,
  IconCircleX,
  IconQrcode,
  IconQrcodeOff,
  IconExternalLink,
  IconCopy
} from "@tabler/icons-vue";
import apiClient from "@/utils/axios";
import { getStorageUrl, PRODUCTION_URLS, STORAGE_BASE_URL } from '@/config/constants';
import { fixImageUrl } from '@/utils/imageFixer';

interface ProfileData {
  id: number;
  username: string;
  full_name: string | null;
  in_game_pseudo: string | null;
  status: string | null;
  profile_photo: string | null;
  avatar: string | null;
  profile_photo_url: string | null;
  country: string | null;
  bio: string | null;
  wins: number;
  losses: number;
  ratio: number;
  tournaments_won: number;
  tournaments_list: string[] | null;
  ranking: string | null;
  division: string | null;
  global_score: number;
  current_season: string | null;
  badges: string[] | null;
  certifications: string[] | null;
  qr_code: string | null;
  profile_url: string | null;
  user: {
    id: number;
    username: string;
    email: string;
    phone: string | null;
    promo_code: string | null;
  };
}

const profileData = ref<ProfileData>({
  id: 0,
  username: '',
  full_name: null,
  in_game_pseudo: null,
  status: null,
  profile_photo: null,
  avatar: null,
  profile_photo_url: null,
  country: null,
  bio: null,
  wins: 0,
  losses: 0,
  ratio: 0,
  tournaments_won: 0,
  tournaments_list: null,
  ranking: null,
  division: null,
  global_score: 0,
  current_season: null,
  badges: null,
  certifications: null,
  qr_code: null,
  profile_url: null,
  user: { id: 0, username: '', email: '', phone: null, promo_code: null }
});

const loading = ref(false);
const uploadingPhoto = ref(false);
const editingPhone = ref(false);
const editingFullName = ref(false);
const editingEmail = ref(false);
const editingCountry = ref(false);
const editingBio = ref(false);
const phoneInput = ref('');
const fullNameInput = ref('');
const emailInput = ref('');
const countryInput = ref('');
const bioInput = ref('');
const savingPhone = ref(false);
const savingFullName = ref(false);
const savingEmail = ref(false);
const savingCountry = ref(false);
const savingBio = ref(false);
const photoTimestamp = ref(Date.now());
const imageLoadError = ref(false);
const uploadError = ref('');

// Certification state
const certificationStatus = ref<any>(null);
const certificationConditions = ref<any>({});
const certificationEligible = ref(false);
const loadingEligibility = ref(false);
const showCertificationForm = ref(false);
const submittingCertification = ref(false);
const certificationForm = ref({
  date_of_birth: '',
  id_type: '',
  id_number: ''
});

// Calculate max date of birth (18 years ago)
const maxDateOfBirth = computed(() => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  return date.toISOString().split('T')[0];
});

// Check if user is certified
const isCertified = computed(() => {
  return profileData.value.certifications && 
         Array.isArray(profileData.value.certifications) && 
         profileData.value.certifications.includes('Ebetstream');
});

const loadProfile = async () => {
  try {
    loading.value = true;
    const response = await apiClient.get("/profile");

    if (response.data.success) {
      profileData.value = response.data.data;
      
      // Construire l'URL complète de la photo de profil
      // Priorité : profile_photo_url de l'API > profile_photo > avatar
      if (profileData.value.profile_photo_url) {
        // Si l'API retourne déjà l'URL complète, on l'utilise
        if (!profileData.value.profile_photo_url.startsWith('http')) {
          // Si c'est un chemin relatif, on le complète
          profileData.value.profile_photo_url = getStorageUrl(profileData.value.profile_photo_url);
        } else {
          // Convertir /storage/ en /api/storage/ si nécessaire
          if (profileData.value.profile_photo_url.includes('/storage/') && 
              !profileData.value.profile_photo_url.includes('/api/storage/')) {
            profileData.value.profile_photo_url = profileData.value.profile_photo_url.replace('/storage/', '/api/storage/');
          }
        }
      } else if (profileData.value.profile_photo) {
        // Construire l'URL à partir du chemin profile_photo
        const photoPath = profileData.value.profile_photo.replace(/^\/+/, '');
        profileData.value.profile_photo_url = getStorageUrl(photoPath);
      } else if (profileData.value.avatar) {
        // Fallback sur avatar
        const avatarPath = profileData.value.avatar.replace(/^\/+/, '');
        profileData.value.profile_photo_url = getStorageUrl(avatarPath);
      } else {
        profileData.value.profile_photo_url = null;
      }
      
      console.log('Profile data:', {
        profile_photo_url: profileData.value.profile_photo_url,
        profile_photo: profileData.value.profile_photo,
        avatar: profileData.value.avatar
      });
      
      // Initialiser les valeurs d'édition
      phoneInput.value = profileData.value.user?.phone || '';
      fullNameInput.value = profileData.value.full_name || '';
      emailInput.value = profileData.value.user?.email || '';
      countryInput.value = profileData.value.country || '';
      bioInput.value = profileData.value.bio || '';
    }
  } catch (error: any) {
    console.error("Error loading profile:", error);
  } finally {
    loading.value = false;
  }
};

const loadCertificationStatus = async () => {
  try {
    loadingEligibility.value = true;
    const token = localStorage.getItem("auth_token");
    
    if (!token) {
      return;
    }
    
    const response = await apiClient.get("/certification/status");

    if (response.data.success) {
      certificationStatus.value = response.data;
      certificationConditions.value = response.data.conditions || {};
      certificationEligible.value = response.data.eligible || false;
    }
  } catch (error: any) {
    console.error("Error loading certification status:", error);
    // Initialize with default values in case of error
    certificationStatus.value = null;
    certificationConditions.value = {};
    certificationEligible.value = false;
  } finally {
    loadingEligibility.value = false;
  }
};

const submitCertificationRequest = async () => {
  if (!certificationForm.value.date_of_birth || !certificationForm.value.id_type || !certificationForm.value.id_number) {
    alert('Please fill in all required fields');
    return;
  }

  try {
    submittingCertification.value = true;
    const response = await apiClient.post(
      "/certification/request",
      certificationForm.value
    );

    if (response.data.success) {
      alert('Certification request submitted successfully!');
      showCertificationForm.value = false;
      certificationForm.value = {
        date_of_birth: '',
        id_type: '',
        id_number: ''
      };
      await loadCertificationStatus();
    }
  } catch (error: any) {
    console.error("Error submitting certification request:", error);
    alert(error.response?.data?.message || "Error submitting request");
  } finally {
    submittingCertification.value = false;
  }
};

const handlePhotoUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;

  // Validation de la taille du fichier (2MB max)
  if (file.size > 2 * 1024 * 1024) {
    alert('La photo ne doit pas dépasser 2MB');
    return;
  }

  // Validation du type de fichier
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    alert('Format de fichier non supporté. Utilisez JPEG, PNG ou GIF');
    return;
  }

  try {
    uploadingPhoto.value = true;
    const token = localStorage.getItem("auth_token");
    
    const formData = new FormData();
    formData.append('profile_photo', file);

    // L'intercepteur axios gère automatiquement le Content-Type pour FormData
    const response = await apiClient.post("/profile", formData);

    if (response.data.success && response.data.data) {
      const updatedData = response.data.data;
      
      console.log('✅ API Response after upload:', updatedData);
      
      // Mettre à jour TOUS les champs du profil avec les données de l'API
      Object.assign(profileData.value, updatedData);
      
      // Construire l'URL de la photo de profil de manière systématique
      if (updatedData.profile_photo_url) {
        // Si l'API retourne déjà une URL complète
        if (updatedData.profile_photo_url.startsWith('http://') || updatedData.profile_photo_url.startsWith('https://')) {
          let photoUrl = updatedData.profile_photo_url;
          // Convertir /storage/ en /api/storage/ si nécessaire
          if (photoUrl.includes('/storage/') && !photoUrl.includes('/api/storage/')) {
            photoUrl = photoUrl.replace('/storage/', '/api/storage/');
          }
          profileData.value.profile_photo_url = photoUrl;
        } else {
          // Si c'est un chemin relatif, construire l'URL complète
          profileData.value.profile_photo_url = getStorageUrl(updatedData.profile_photo_url);
        }
      } else if (updatedData.profile_photo) {
        // Construire l'URL à partir du chemin profile_photo
        const photoPath = updatedData.profile_photo.replace(/^\/+/, '');
        profileData.value.profile_photo_url = getStorageUrl(photoPath);
      } else if (updatedData.avatar) {
        // Fallback sur avatar
        const avatarPath = updatedData.avatar.replace(/^\/+/, '');
        profileData.value.profile_photo_url = getStorageUrl(avatarPath);
      }
      
      // Forcer le rechargement de l'image en mettant à jour le timestamp
      photoTimestamp.value = Date.now();
      
      console.log('📸 Photo uploaded - Final data:', {
        profile_photo_url: profileData.value.profile_photo_url,
        profile_photo: profileData.value.profile_photo,
        avatar: profileData.value.avatar,
        computedUrl: profilePhotoUrl.value
      });
      
      // Attendre un peu pour que Vue mette à jour le DOM
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Recharger le profil complet pour s'assurer que tout est synchronisé
      await loadProfile();
    }
  } catch (error: any) {
    console.error("Error uploading photo:", error);
    let errorMessage = "Error uploading photo";
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.errors) {
      // Si c'est une erreur de validation
      const errors = error.response.data.errors;
      if (errors.profile_photo) {
        errorMessage = Array.isArray(errors.profile_photo) 
          ? errors.profile_photo[0] 
          : errors.profile_photo;
      } else {
        errorMessage = Object.values(errors).flat().join(', ');
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    uploadError.value = errorMessage;
    setTimeout(() => {
      uploadError.value = '';
    }, 5000);
  } finally {
    uploadingPhoto.value = false;
    // Reset input
    if (target) target.value = '';
  }
};


const formatTournamentsList = (list: string[] | null) => {
  if (!list || list.length === 0) return '';
  return '(' + list.join(' • ') + ')';
};

const formatRanking = (ranking: string | null, division: string | null) => {
  if (!ranking && !division) return 'None';
  if (ranking && division) return `${ranking} – ${division}`;
  return ranking || division || 'None';
};

const formatProfileUrl = (url: string) => {
  if (!url) return 'None';
  // Retirer le protocole pour un affichage plus propre
  return url.replace(/^https?:\/\//, '');
};

const copyProfileUrl = async (url: string, event?: Event) => {
  if (!url) return;
  
  try {
    await navigator.clipboard.writeText(url);
    // Display a temporary success message
    if (event) {
      const copyIcon = event.target as HTMLElement;
      if (copyIcon) {
        const originalClass = copyIcon.className;
        copyIcon.className = 'fas fa-check ms-2 copy_icon text-success';
        setTimeout(() => {
          copyIcon.className = originalClass;
        }, 2000);
      }
    }
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};

const copyPromoCode = async (promoCode: string) => {
  if (!promoCode) return;
  
  try {
    await navigator.clipboard.writeText(promoCode);
    // Display a success notification
    alert('Promo code copied!');
  } catch (err) {
    console.error("Failed to copy promo code:", err);
    alert('Error copying promo code');
  }
};

const savePhone = async () => {
  try {
    savingPhone.value = true;
    const token = localStorage.getItem("auth_token");
    
    const response = await apiClient.put(
      "/profile",
      { phone: phoneInput.value },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data.success) {
      await loadProfile();
      editingPhone.value = false;
    }
  } catch (error: any) {
    console.error("Error saving phone:", error);
    alert(error.response?.data?.message || "Error saving phone number");
  } finally {
    savingPhone.value = false;
  }
};

const cancelEditPhone = () => {
  phoneInput.value = profileData.value.user?.phone || '';
  editingPhone.value = false;
};

const saveFullName = async () => {
  try {
    savingFullName.value = true;
    const token = localStorage.getItem("auth_token");
    
    const response = await apiClient.put(
      "/profile",
      { full_name: fullNameInput.value },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data.success) {
      await loadProfile();
      editingFullName.value = false;
    }
  } catch (error: any) {
    console.error("Error saving full name:", error);
    alert(error.response?.data?.message || "Error saving name");
  } finally {
    savingFullName.value = false;
  }
};

const cancelEditFullName = () => {
  fullNameInput.value = profileData.value.full_name || '';
  editingFullName.value = false;
};

const saveEmail = async () => {
  try {
    savingEmail.value = true;
    
    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
      alert('Please enter a valid email address');
      return;
    }
    
    const response = await apiClient.put(
      "/profile",
      { email: emailInput.value }
    );

    if (response.data.success) {
      await loadProfile();
      editingEmail.value = false;
      alert('Email updated successfully!');
    }
  } catch (error: any) {
    console.error("Error saving email:", error);
    alert(error.response?.data?.message || "Error saving email");
  } finally {
    savingEmail.value = false;
  }
};

const cancelEditEmail = () => {
  emailInput.value = profileData.value.user?.email || '';
  editingEmail.value = false;
};

const saveCountry = async () => {
  try {
    savingCountry.value = true;
    const token = localStorage.getItem("auth_token");
    
    const response = await apiClient.put(
      "/profile",
      { country: countryInput.value },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data.success) {
      await loadProfile();
      editingCountry.value = false;
    }
  } catch (error: any) {
    console.error("Error saving country:", error);
    alert(error.response?.data?.message || "Error saving country");
  } finally {
    savingCountry.value = false;
  }
};

const cancelEditCountry = () => {
  countryInput.value = profileData.value.country || '';
  editingCountry.value = false;
};

const saveBio = async () => {
  try {
    savingBio.value = true;
    const token = localStorage.getItem("auth_token");
    
    const response = await apiClient.put(
      "/profile",
      { bio: bioInput.value },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data.success) {
      await loadProfile();
      editingBio.value = false;
    }
  } catch (error: any) {
    console.error("Error saving bio:", error);
    alert(error.response?.data?.message || "Error saving biography");
  } finally {
    savingBio.value = false;
  }
};

const cancelEditBio = () => {
  bioInput.value = profileData.value.bio || '';
  editingBio.value = false;
};

// Computed property pour l'URL de la photo de profil
const profilePhotoUrl = computed(() => {
  // Réinitialiser l'erreur d'image si on a une nouvelle URL
  imageLoadError.value = false;
  
  // Priorité : profile_photo_url > profile_photo > avatar
  let url = '';
  
  if (profileData.value.profile_photo_url) {
    url = profileData.value.profile_photo_url;
  } else if (profileData.value.profile_photo) {
    const photoPath = profileData.value.profile_photo.replace(/^\/+/, '');
    try {
      url = getStorageUrl(photoPath);
    } catch (error) {
      console.warn('Error getting storage URL for profile_photo:', error);
      url = `${STORAGE_BASE_URL}/api/storage/${photoPath}`;
    }
  } else if (profileData.value.avatar) {
    const avatarPath = profileData.value.avatar.replace(/^\/+/, '');
    try {
      url = getStorageUrl(avatarPath);
    } catch (error) {
      console.warn('Error getting storage URL for avatar:', error);
      url = `${STORAGE_BASE_URL}/api/storage/${avatarPath}`;
    }
  }
  
  // Utiliser le helper global pour corriger l'URL
  const correctedUrl = fixImageUrl(url);
  
  // Ajouter timestamp pour éviter le cache
  if (correctedUrl) {
    const separator = correctedUrl.includes('?') ? '&' : '?';
    return `${correctedUrl}${separator}t=${photoTimestamp.value}`;
  }
  
  return correctedUrl;
});

const onImageLoad = () => {
  console.log('✅ Image loaded successfully:', profilePhotoUrl.value);
  imageLoadError.value = false;
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  imageLoadError.value = true;
  
  console.error('❌ Error loading profile photo:', {
    src: img.src,
    profile_photo_url: profileData.value.profile_photo_url,
    profile_photo: profileData.value.profile_photo,
    avatar: profileData.value.avatar
  });
  
  // Corriger l'URL si elle contient localhost ou 127.0.0.1
  if (profileData.value.profile_photo_url) {
    let correctedUrl = profileData.value.profile_photo_url;
    
    // Remplacer localhost/127.0.0.1 par l'URL de production
    if (correctedUrl.includes('localhost') || correctedUrl.includes('127.0.0.1')) {
      correctedUrl = correctedUrl.replace(/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//g, `${PRODUCTION_URLS.STORAGE}/`);
      correctedUrl = correctedUrl.replace(/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/api\//g, `${PRODUCTION_URLS.STORAGE}/`);
      profileData.value.profile_photo_url = correctedUrl;
      photoTimestamp.value = Date.now();
      console.log('🔄 Corrected URL from localhost:', profileData.value.profile_photo_url);
      return; // Retourner pour que Vue recharge l'image avec la nouvelle URL
    }
  }
  
  // Essayer de reconstruire l'URL si elle est incorrecte
  if (profileData.value.profile_photo && !profileData.value.profile_photo_url) {
    const photoPath = profileData.value.profile_photo.replace(/^\/+/, '');
    profileData.value.profile_photo_url = getStorageUrl(photoPath);
    photoTimestamp.value = Date.now();
    console.log('🔄 Trying alternative URL:', profileData.value.profile_photo_url);
  } else if (profileData.value.avatar && !profileData.value.profile_photo_url) {
    const avatarPath = profileData.value.avatar.replace(/^\/+/, '');
    profileData.value.profile_photo_url = getStorageUrl(avatarPath);
    photoTimestamp.value = Date.now();
    console.log('🔄 Trying avatar URL:', profileData.value.profile_photo_url);
  }
};

onMounted(async () => {
  await loadProfile();
      // Load certification status asynchronously without blocking
  loadCertificationStatus().catch(err => {
    console.error("Failed to load certification status:", err);
  });
});
</script>

<style scoped>
.fs-1 {
  font-size: 3rem;
}
.fs-2 {
  font-size: 2rem;
}
.fw-bold {
  font-weight: 600;
}

.profile_photo_container {
  width: 150px;
  height: 150px;
  margin: 0 auto;
  position: relative;
}

.profile_photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 4px solid #FF9F00;
}

.profile_photo_placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 4px solid #FF9F00;
}

.profile_photo_edit_btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #FF9F00;
  color: #000;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 3px solid #fff;
  transition: all 0.3s;
}

.profile_photo_edit_btn:hover {
  background: #ffb733;
  transform: scale(1.1);
}

.qr_code_img {
  width: 150px;
  height: 150px;
  object-fit: contain;
}

.qr_code_placeholder {
  width: 150px;
  height: 150px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.profile_link_container {
  margin-top: 1rem;
}

.profile_link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.profile_link:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
  text-decoration: none;
}

.profile_link_text {
  font-size: 0.95rem;
  letter-spacing: 0.5px;
  word-break: break-all;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.copy_icon {
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.2s ease;
  font-size: 0.85rem;
  padding: 4px;
  border-radius: 4px;
}

.copy_icon:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.info_card {
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.info_card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.2);
}

.info_card .small {
  font-size: 0.85rem;
}

.info_card .fs-3 {
  font-size: 1.5rem;
}

.promo_code_text {
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
  font-size: 0.9rem;
}

.certification_section {
  border: 2px solid rgba(255, 159, 0, 0.2);
  transition: all 0.3s ease;
}

.certification_section:hover {
  border-color: rgba(255, 159, 0, 0.4);
  box-shadow: 0 4px 15px rgba(255, 159, 0, 0.1);
}

.condition_icon {
  font-size: 1.5rem;
  min-width: 30px;
  text-align: center;
}

.condition_item {
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
  margin-bottom: 8px;
}

.condition_item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.conditions_checklist {
  list-style: none;
  padding: 0;
  margin: 0;
}

.conditions_checklist li {
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.conditions_checklist li:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(5px);
}

.certification_form {
  background: rgba(255, 255, 255, 0.03);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.form-label {
  color: #fff;
  margin-bottom: 8px;
}

.form-control {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
}

.form-control:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: #FF9F00;
  color: #fff;
  box-shadow: 0 0 0 0.2rem rgba(255, 159, 0, 0.25);
}

.form-control::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.alert {
  border-radius: 8px;
  border: none;
}

.alert-info {
  background: rgba(13, 202, 240, 0.2);
  color: #0dcaf0;
  border-left: 4px solid #0dcaf0;
}

.alert-warning {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  border-left: 4px solid #ffc107;
}

.alert-danger {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
  border-left: 4px solid #dc3545;
}

/* Edit button styles */
.edit-btn {
  color: #FF9F00 !important;
  background: rgba(255, 159, 0, 0.15) !important;
  border: 1px solid rgba(255, 159, 0, 0.4) !important;
  transition: all 0.3s ease;
  padding: 6px 10px !important;
  border-radius: 6px;
  font-size: 0.9rem;
  min-width: 32px;
  min-height: 32px;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none !important;
}

.edit-btn:hover {
  background: rgba(255, 159, 0, 0.3) !important;
  color: #FF9F00 !important;
  border-color: rgba(255, 159, 0, 0.6) !important;
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(255, 159, 0, 0.3);
}

.edit-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 159, 0, 0.2);
}

.edit-btn svg {
  display: inline-block;
  vertical-align: middle;
}

@media (max-width: 768px) {
  .profile_link_text {
    max-width: 200px;
    font-size: 0.85rem;
  }
  
  .info_card {
    min-height: 100px;
  }
  
  .info_card .fs-3 {
    font-size: 1.25rem;
  }
  
  .edit-btn {
    font-size: 0.85rem;
    padding: 3px 6px !important;
  }
}
</style>
