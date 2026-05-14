<template>
  <div class="tw-page">
    <!-- Event Details Section -->
<!-- Loading State -->
              <div v-if="loading" class="tw-empty"><div class="spinner"></div></div>

              <!-- Error State -->
              <div v-else-if="error" class="tw-empty">
      <div class="tw-empty__icon"><i class="fas fa-exclamation-triangle"></i></div>
      <p class="tw-empty__title">{{ error }}</p>
                <button class="tw-btn tw-btn--primary mt-3" @click="$router.push('/events')">
                  <i class="fas fa-arrow-left me-2"></i>
                  Back to Events
                </button>
              </div>

              <!-- Event Details -->
              <div v-else-if="event">
                <!-- Header -->
                <div class="row mb-5">
                  <div class="col-12">
                    <button class="tw-btn tw-btn--secondary tw-detail-back" @click="$router.push('/events')">
                      <i class="fas fa-arrow-left me-2"></i>
                      Back
                    </button>
                    
                    <div class="tw-page-hero mb-4">
                      <p class="tw-page-hero__eyebrow">
                        <i class="fas fa-calendar-alt me-2"></i>{{ $t('ui.event_details') }}</p>
                      <h1 class="tw-page-hero__title">
                        <span>{{ event.title }}</span>
                      </h1>
                      <div class="d-flex flex-wrap gap-3 align-items-center">
                        <span v-if="event.is_ongoing" class="tw-badge tw-badge--ongoing" style="font-size: 1rem;">
                          <i class="fas fa-circle me-1" style="font-size: 0.5rem;"></i>
                          Ongoing
                        </span>
                        <span v-else-if="event.is_upcoming" class="tw-badge tw-badge--open" style="font-size: 1rem;">
                          <i class="fas fa-clock me-1"></i>
                          Upcoming
                        </span>
                        <span v-else-if="event.is_past" class="tw-badge tw-badge--closed" style="font-size: 1rem;">
                          <i class="fas fa-check-circle me-1"></i>
                          Past
                        </span>
                        <span v-if="event.type" class="tw-badge tw-badge--pending" style="font-size: 1rem;">
                          {{ event.type }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Main Content -->
                <div class="row g-4">
                  <!-- Left Column - Event Image and Info -->
                  <div class="col-lg-8">
                    <!-- Event Image -->
                    <div v-if="eventImageUrl && !imageError" class="tw-detail-thumb mb-4">
                      <img 
                        :src="eventImageUrl" 
                        :alt="$t('ui.event_title_2')"
                        class="w-100 h-100"
                        style="object-fit: cover;"
                        @error="handleImageError"
                      />
                    </div>
                    <div v-else class="tw-detail-thumb tw-detail-thumb--placeholder mb-4">
                      <i class="fas fa-calendar-alt text-white" style="font-size: 5rem;"></i>
                    </div>

                    <!-- Description Section -->
                    <div class="tw-content-block mb-4">
                      <h4 class="fw-bold mb-3">
                        <i class="fas fa-info-circle me-2"></i>{{ $t('common.description') }}</h4>
                      <p v-if="event.description" class="text-white" style="opacity: 0.9; line-height: 1.8; font-size: 1.05rem; white-space: pre-line;">
                        {{ event.description }}
                      </p>
                      <p v-else class="text-white" style="opacity: 0.7;">
                        No description available for this event.
                      </p>
                    </div>

                    <!-- Additional Info -->
                    <div class="tw-content-block">
                      <h4 class="fw-bold mb-4">
                        <i class="fas fa-calendar-check me-2"></i>{{ $t('ui.information') }}</h4>
                      <div class="row g-3">
                        <div class="col-md-6">
                          <div class="info_item">
                            <i class="fas fa-clock text-warning me-2"></i>
                            <div>
                              <strong class="text-white">{{ $t('ui.start_date') }}</strong>
                              <p class="text-white mb-0" style="opacity: 0.8;">
                                {{ formatDateTime(event.start_at) }}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div v-if="event.end_at" class="col-md-6">
                          <div class="info_item">
                            <i class="fas fa-flag-checkered text-warning me-2"></i>
                            <div>
                              <strong class="text-white">{{ $t('ui.end_date') }}</strong>
                              <p class="text-white mb-0" style="opacity: 0.8;">
                                {{ formatDateTime(event.end_at) }}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div v-if="event.location" class="col-md-6">
                          <div class="info_item">
                            <i class="fas fa-map-marker-alt text-warning me-2"></i>
                            <div>
                              <strong class="text-white">{{ $t('ui.location') }}</strong>
                              <p class="text-white mb-0" style="opacity: 0.8;">
                                {{ event.location }}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div v-if="event.max_participants" class="col-md-6">
                          <div class="info_item">
                            <i class="fas fa-users text-warning me-2"></i>
                            <div>
                              <strong class="text-white">{{ $t('ui.max_participants_2') }}</strong>
                              <p class="text-white mb-0" style="opacity: 0.8;">
                                {{ event.max_participants }} participants
                              </p>
                            </div>
                          </div>
                        </div>
                        <div v-if="event.registration_deadline" class="col-md-6">
                          <div class="info_item">
                            <i class="fas fa-calendar-times text-warning me-2"></i>
                            <div>
                              <strong class="text-white">{{ $t('ui.registration_deadline') }}</strong>
                              <p class="text-white mb-0" style="opacity: 0.8;">
                                {{ formatDateTime(event.registration_deadline) }}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Right Column - Quick Info -->
                  <div class="col-lg-4">
                    <div class="tw-content-block tw-detail-sidebar">
                      <h4 class="fw-bold mb-4">
                        <i class="fas fa-info me-2"></i>{{ $t('ui.summary') }}</h4>
                      
                      <div class="mb-4">
                        <div class="d-flex align-items-center gap-2 mb-3">
                          <i class="fas fa-calendar text-warning"></i>
                          <div>
                            <p class="tw-muted mb-0">{{ $t('common.date') }}</p>
                            <p class="text-white mb-0 fw-bold">{{ formatDate(event.start_at) }}</p>
                          </div>
                        </div>
                        <div v-if="event.location" class="d-flex align-items-center gap-2 mb-3">
                          <i class="fas fa-map-marker-alt text-warning"></i>
                          <div>
                            <p class="tw-muted mb-0">{{ $t('ui.location') }}</p>
                            <p class="text-white mb-0 fw-bold">{{ event.location }}</p>
                          </div>
                        </div>
                        <div v-if="event.type" class="d-flex align-items-center gap-2 mb-3">
                          <i class="fas fa-tag text-warning"></i>
                          <div>
                            <p class="tw-muted mb-0">{{ $t('common.type') }}</p>
                            <p class="text-white mb-0 fw-bold">{{ event.type }}</p>
                          </div>
                        </div>
                        <div class="d-flex align-items-center gap-2 mb-3">
                          <i class="fas fa-users text-warning"></i>
                          <div>
                            <p class="tw-muted mb-0">{{ $t('ui.registered') }}</p>
                            <p class="text-white mb-0 fw-bold">
                              {{ event.registrations_count || 0 }}
                              <span v-if="event.max_participants" style="opacity: 0.7;">
                                / {{ event.max_participants }}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div v-if="event.is_upcoming" class="d-grid gap-2">
                        <button class="tw-btn tw-btn--primary w-100 py-3" @click="showRegistrationModal = true">
                          <i class="fas fa-user-plus me-2"></i>{{ $t('ui.register_for_event') }}</button>
                      </div>
                      <div v-else-if="event.is_ongoing" class="d-grid gap-2">
                        <button class="tw-btn tw-btn--primary w-100 py-3">
                          <i class="fas fa-play me-2"></i>
                          Follow Event
                        </button>
                        <button class="tw-btn tw-btn--secondary w-100 py-2">
                          <i class="fas fa-share-alt me-2"></i>
                          Share
                        </button>
                      </div>
                      <div v-else class="d-grid gap-2">
                        <button class="tw-btn tw-btn--secondary w-100 py-2" disabled>
                          <i class="fas fa-check-circle me-2"></i>
                          Event Ended
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

    <!-- Registration Modal -->
    <div v-if="showRegistrationModal" class="tw-modal-overlay" @click.self="showRegistrationModal = false">
      <div class="tw-modal">
        <div class="tw-modal__header">
          <h3 class="tw-modal__title">{{ $t('ui.register_for_event') }}</h3>
          <button class="tw-modal__close" @click="showRegistrationModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="tw-modal__body">
          <form @submit.prevent="handleRegistration">
            <div class="mb-3">
              <label for="pseudo" class="tw-label">{{ $t('ui.username_3') }}</label>
              <input
                type="text"
                id="pseudo"
                v-model="registrationForm.pseudo"
                class="tw-input"
                required
                :placeholder="$t('ui.your_username')"
              />
            </div>
            <div class="mb-3">
              <label for="email" class="tw-label">{{ $t('ui.email_2') }}</label>
              <input
                type="email"
                id="email"
                v-model="registrationForm.email"
                class="tw-input"
                required
                :placeholder="$t('ui.your_email_com')"
              />
            </div>
            <div class="mb-3">
              <label for="phone" class="tw-label">{{ $t('ui.phone_2') }}</label>
              <input
                type="tel"
                id="phone"
                v-model="registrationForm.phone"
                class="tw-input"
                placeholder="+1 234 567 8900"
              />
            </div>
            <div class="mb-3">
              <label for="country" class="tw-label">{{ $t('common.country') }}</label>
              <input
                type="text"
                id="country"
                v-model="registrationForm.country"
                class="tw-input"
                :placeholder="$t('ui.united_states')"
              />
            </div>
            <div v-if="registrationError" class="alert alert-danger mb-3">
              {{ registrationError }}
            </div>
            <div class="d-grid gap-2">
              <button type="submit" class="tw-btn tw-btn--primary w-100 py-3" :disabled="registering">
                <span v-if="registering">
                  <i class="fas fa-spinner fa-spin me-2"></i>{{ $t('ui.registering') }}</span>
                <span v-else>
                  <i class="fas fa-check me-2"></i>{{ $t('ui.confirm_registration') }}</span>
              </button>
              <button type="button" class="tw-btn tw-btn--secondary w-100 py-2" @click="showRegistrationModal = false">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient, { getApiErrorMessage } from '@/utils/axios';
import { getStorageUrl, STORAGE_BASE_URL } from '@/config/constants';
import { fixImageUrl } from '@/utils/imageFixer';

interface Event {
  id: number;
  title: string;
  description?: string | null;
  start_at: string;
  end_at?: string | null;
  location?: string | null;
  image?: string | null;
  image_url?: string;
  status?: string;
  type?: string | null;
  max_participants?: number | null;
  registration_deadline?: string | null;
  registrations_count?: number;
  is_upcoming?: boolean;
  is_ongoing?: boolean;
  is_past?: boolean;
}

const route = useRoute();
const router = useRouter();
const event = ref<Event | null>(null);
const loading = ref(false);
const error = ref('');
const imageError = ref(false);
const showRegistrationModal = ref(false);
const registering = ref(false);
const registrationError = ref('');
const registrationForm = ref({
  pseudo: '',
  email: '',
  phone: '',
  country: '',
});

// Computed property for image URL
const eventImageUrl = computed(() => {
  if (!event.value) return null;
  
  // Helper function to convert storage URL to API URL
  const convertToApiUrl = (url: string): string => {
    // If URL contains /storage/events/, convert it to /api/storage/events/
    if (url.includes('/storage/events/')) {
      const baseUrl = STORAGE_BASE_URL;
      const filename = url.split('/storage/events/')[1];
      return `${baseUrl}/api/storage/events/${filename}`;
    }
    return url;
  };
  
  // Try image_url first (from backend computed attribute)
  if (event.value.image_url) {
    // If it's already a full URL, check if it needs conversion
    if (event.value.image_url.startsWith('http://') || event.value.image_url.startsWith('https://')) {
      const convertedUrl = convertToApiUrl(event.value.image_url);
      console.log('Using full URL (converted):', convertedUrl, 'from:', event.value.image_url);
      return fixImageUrl(convertedUrl);
    }
    // Use getStorageUrl helper with correction
    const url = getStorageUrl(event.value.image_url);
    console.log('Using image_url with getStorageUrl:', url);
    return fixImageUrl(url);
  }
  
  // Fallback to image field
  if (event.value.image) {
    // Image path is stored as "events/filename.webp" in the database
    // Extract just the filename from the path
    const filename = event.value.image.includes('/') 
      ? event.value.image.split('/').pop() 
      : event.value.image;
    
    // Use getStorageUrl helper with correction
    const url = getStorageUrl(`events/${filename}`);
    console.log('Using image with getStorageUrl:', url);
    return fixImageUrl(url);
  }
  
  console.log('No image available for event');
  return null;
});

const loadEvent = async () => {
  try {
    loading.value = true;
    error.value = '';
    imageError.value = false; // Reset image error when loading new event
    const eventId = route.params.id;

    const response = await apiClient.get(`/events/${eventId}`);

    if (response.data.success) {
      event.value = response.data.data;
    } else {
      error.value = response.data.message || 'Event not found';
    }
  } catch (err: any) {
    console.error('Error loading event:', err);
    if (err.response?.status === 404) {
      error.value = 'Event not found';
    } else {
      error.value = getApiErrorMessage(err);
    }
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'long',
    year: 'numeric'
  });
};

const formatDateTime = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', { 
    day: 'numeric', 
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const handleImageError = (e: Event | any) => {
  // Image failed to load, will show placeholder
  const img = (e.target || (e as any).target) as HTMLImageElement;
  console.error('Failed to load event image. URL attempted:', img.src);
  console.error('Event data:', event.value);
  // Set error flag to show placeholder
  imageError.value = true;
};

const handleRegistration = async () => {
  if (!event.value) return;

  registering.value = true;
  registrationError.value = '';

  try {
    const response = await apiClient.post(`/events/${event.value.id}/register`, registrationForm.value);

    if (response.data.success) {
      // Réinitialiser le formulaire
      registrationForm.value = {
        pseudo: '',
        email: '',
        phone: '',
        country: '',
      };
      
      // Fermer le modal
      showRegistrationModal.value = false;
      
      // Recharger l'événement pour mettre à jour le nombre d'inscrits
      await loadEvent();
      
      // Afficher un message de succès (vous pouvez utiliser une notification toast si disponible)
      alert('Registration successful!');
    } else {
      registrationError.value = response.data.message || 'Erreur lors de l\'inscription';
    }
  } catch (err: any) {
    console.error('Error registering for event:', err);
    if (err.response?.data?.message) {
      registrationError.value = err.response.data.message;
    } else if (err.response?.data?.errors) {
      const errors = err.response.data.errors;
      registrationError.value = Object.values(errors).flat().join(', ');
    } else {
      registrationError.value = 'Error during registration. Please try again.';
    }
  } finally {
    registering.value = false;
  }
};

onMounted(() => {
  loadEvent();
});
</script>

