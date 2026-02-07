<template>
  <div class="page-content-with-space">
    <!-- Event Details Section -->
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
                <button class="btn_primary mt-3" @click="$router.push('/events')">
                  <i class="fas fa-arrow-left me-2"></i>
                  Back to Events
                </button>
              </div>

              <!-- Event Details -->
              <div v-else-if="event">
                <!-- Header -->
                <div class="row mb-5">
                  <div class="col-12">
                    <button class="btn_secondary mb-4" @click="$router.push('/events')">
                      <i class="fas fa-arrow-left me-2"></i>
                      Back
                    </button>
                    
                    <div class="defis_content">
                      <span class="hero_badge mb-3 d-inline-block">
                        <i class="fas fa-calendar-alt me-2"></i>Event Details
                      </span>
                      <h2 class="hero_title mb-4">
                        <span class="text_gradient">{{ event.title }}</span>
                      </h2>
                      <div class="d-flex flex-wrap gap-3 align-items-center">
                        <span v-if="event.is_ongoing" class="badge bg-success px-3 py-2" style="font-size: 1rem;">
                          <i class="fas fa-circle me-1" style="font-size: 0.5rem;"></i>
                          Ongoing
                        </span>
                        <span v-else-if="event.is_upcoming" class="badge bg-primary px-3 py-2" style="font-size: 1rem;">
                          <i class="fas fa-clock me-1"></i>
                          Upcoming
                        </span>
                        <span v-else-if="event.is_past" class="badge bg-secondary px-3 py-2" style="font-size: 1rem;">
                          <i class="fas fa-check-circle me-1"></i>
                          Past
                        </span>
                        <span v-if="event.type" class="badge bg-info px-3 py-2" style="font-size: 1rem;">
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
                    <div v-if="eventImageUrl && !imageError" class="event_detail_image mb-4 rounded overflow-hidden" style="height: 400px;">
                      <img 
                        :src="eventImageUrl" 
                        :alt="event.title"
                        class="w-100 h-100"
                        style="object-fit: cover;"
                        @error="handleImageError"
                      />
                    </div>
                    <div v-else class="event_detail_placeholder mb-4 rounded d-flex align-items-center justify-content-center" 
                         style="height: 400px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                      <i class="fas fa-calendar-alt text-white" style="font-size: 5rem;"></i>
                    </div>

                    <!-- Description Section -->
                    <div class="defi_card n11-bg rounded-8 p-4 p-lg-6 mb-4">
                      <h4 class="fw-bold mb-3 text-white">
                        <i class="fas fa-info-circle me-2"></i>Description
                      </h4>
                      <p v-if="event.description" class="text-white" style="opacity: 0.9; line-height: 1.8; font-size: 1.05rem; white-space: pre-line;">
                        {{ event.description }}
                      </p>
                      <p v-else class="text-white" style="opacity: 0.7;">
                        No description available for this event.
                      </p>
                    </div>

                    <!-- Additional Info -->
                    <div class="defi_card n11-bg rounded-8 p-4 p-lg-6">
                      <h4 class="fw-bold mb-4 text-white">
                        <i class="fas fa-calendar-check me-2"></i>Information
                      </h4>
                      <div class="row g-3">
                        <div class="col-md-6">
                          <div class="info_item">
                            <i class="fas fa-clock text-warning me-2"></i>
                            <div>
                              <strong class="text-white">Start Date</strong>
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
                              <strong class="text-white">End Date</strong>
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
                              <strong class="text-white">Location</strong>
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
                              <strong class="text-white">Max Participants</strong>
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
                              <strong class="text-white">Registration Deadline</strong>
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
                    <div class="defi_card n11-bg rounded-8 p-4 p-lg-6 sticky-top" style="top: 100px;">
                      <h4 class="fw-bold mb-4 text-white">
                        <i class="fas fa-info me-2"></i>Summary
                      </h4>
                      
                      <div class="mb-4">
                        <div class="d-flex align-items-center gap-2 mb-3">
                          <i class="fas fa-calendar text-warning"></i>
                          <div>
                            <p class="text-white mb-0 small" style="opacity: 0.7;">Date</p>
                            <p class="text-white mb-0 fw-bold">{{ formatDate(event.start_at) }}</p>
                          </div>
                        </div>
                        <div v-if="event.location" class="d-flex align-items-center gap-2 mb-3">
                          <i class="fas fa-map-marker-alt text-warning"></i>
                          <div>
                            <p class="text-white mb-0 small" style="opacity: 0.7;">Location</p>
                            <p class="text-white mb-0 fw-bold">{{ event.location }}</p>
                          </div>
                        </div>
                        <div v-if="event.type" class="d-flex align-items-center gap-2 mb-3">
                          <i class="fas fa-tag text-warning"></i>
                          <div>
                            <p class="text-white mb-0 small" style="opacity: 0.7;">Type</p>
                            <p class="text-white mb-0 fw-bold">{{ event.type }}</p>
                          </div>
                        </div>
                        <div class="d-flex align-items-center gap-2 mb-3">
                          <i class="fas fa-users text-warning"></i>
                          <div>
                            <p class="text-white mb-0 small" style="opacity: 0.7;">Registered</p>
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
                        <button class="btn_primary w-100 py-3" @click="showRegistrationModal = true">
                          <i class="fas fa-user-plus me-2"></i>
                          Register for Event
                        </button>
                      </div>
                      <div v-else-if="event.is_ongoing" class="d-grid gap-2">
                        <button class="btn_primary w-100 py-3">
                          <i class="fas fa-play me-2"></i>
                          Follow Event
                        </button>
                        <button class="btn_secondary w-100 py-2">
                          <i class="fas fa-share-alt me-2"></i>
                          Share
                        </button>
                      </div>
                      <div v-else class="d-grid gap-2">
                        <button class="btn_secondary w-100 py-2" disabled>
                          <i class="fas fa-check-circle me-2"></i>
                          Event Ended
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

    <!-- Registration Modal -->
    <div v-if="showRegistrationModal" class="modal-overlay" @click.self="showRegistrationModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Register for Event</h3>
          <button class="modal-close" @click="showRegistrationModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleRegistration">
            <div class="mb-3">
              <label for="pseudo" class="form-label">Username *</label>
              <input
                type="text"
                id="pseudo"
                v-model="registrationForm.pseudo"
                class="form-control"
                required
                placeholder="Your username"
              />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email *</label>
              <input
                type="email"
                id="email"
                v-model="registrationForm.email"
                class="form-control"
                required
                placeholder="your@email.com"
              />
            </div>
            <div class="mb-3">
              <label for="phone" class="form-label">Phone</label>
              <input
                type="tel"
                id="phone"
                v-model="registrationForm.phone"
                class="form-control"
                placeholder="+1 234 567 8900"
              />
            </div>
            <div class="mb-3">
              <label for="country" class="form-label">Country</label>
              <input
                type="text"
                id="country"
                v-model="registrationForm.country"
                class="form-control"
                placeholder="United States"
              />
            </div>
            <div v-if="registrationError" class="alert alert-danger mb-3">
              {{ registrationError }}
            </div>
            <div class="d-grid gap-2">
              <button type="submit" class="btn_primary w-100 py-3" :disabled="registering">
                <span v-if="registering">
                  <i class="fas fa-spinner fa-spin me-2"></i>Registering...
                </span>
                <span v-else>
                  <i class="fas fa-check me-2"></i>Confirm Registration
                </span>
              </button>
              <button type="button" class="btn_secondary w-100 py-2" @click="showRegistrationModal = false">
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
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/utils/axios';
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
    } else if (err.isNetworkError) {
      error.value = 'Connection error. Please check your internet connection.';
    } else {
      error.value = 'Error loading event';
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

<style scoped>
.defis_section {
  width: 100%;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 24px;
}

.defi_card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-content {
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-title {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.3s;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: 24px;
}

.form-label {
  color: white;
  font-weight: 500;
  margin-bottom: 8px;
  display: block;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.15);
}

.form-control::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.alert-danger {
  background: rgba(220, 53, 69, 0.2);
  border: 1px solid rgba(220, 53, 69, 0.5);
  color: #ff6b6b;
}

@media (max-width: 768px) {
  .modal-content {
    max-width: 100%;
    margin: 10px;
  }
  
  .modal-header {
    padding: 16px 20px;
  }
  
  .modal-body {
    padding: 20px;
  }
}

.info_item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
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
  box-shadow: 0 4px 15px rgba(255, 159, 0, 0.4);
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

