<template>
  <div class="certification-form">
    <form @submit.prevent="submitForm" class="needs-validation" novalidate>
      <!-- Personal Information -->
      <div class="mb-4">
        <h4 class="text-white mb-3">Personal Information</h4>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label text-white">Full Name *</label>
            <input 
              v-model="form.full_name" 
              type="text" 
              class="form-control n11-bg text-white border-secondary" 
              required
            />
          </div>
          <div class="col-md-6">
            <label class="form-label text-white">Date of Birth</label>
            <input 
              v-model="form.birth_date" 
              type="date" 
              class="form-control n11-bg text-white border-secondary"
            />
          </div>
          <div class="col-md-6">
            <label class="form-label text-white">Country</label>
            <input 
              v-model="form.country" 
              type="text" 
              class="form-control n11-bg text-white border-secondary"
            />
          </div>
          <div class="col-md-6">
            <label class="form-label text-white">City</label>
            <input 
              v-model="form.city" 
              type="text" 
              class="form-control n11-bg text-white border-secondary"
            />
          </div>
          <div class="col-md-6">
            <label class="form-label text-white">Phone *</label>
            <input 
              v-model="form.phone" 
              type="tel" 
              class="form-control n11-bg text-white border-secondary" 
              required
            />
          </div>
          <div class="col-md-6">
            <label class="form-label text-white">Professional Email *</label>
            <input 
              v-model="form.professional_email" 
              type="email" 
              class="form-control n11-bg text-white border-secondary" 
              required
            />
          </div>
        </div>
      </div>

      <!-- Professional Information -->
      <div class="mb-4">
        <h4 class="text-white mb-3">Professional Information</h4>
        <div class="mb-3">
          <label class="form-label text-white">E-sport Experience</label>
          <textarea 
            v-model="form.experience" 
            class="form-control n11-bg text-white border-secondary" 
            rows="4"
            placeholder="Describe your experience in e-sports, tournaments organized, etc."
          ></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label text-white">Availability</label>
          <textarea 
            v-model="form.availability" 
            class="form-control n11-bg text-white border-secondary" 
            rows="3"
            placeholder="Indicate your availability (days, hours)"
          ></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label text-white">Technical Skills</label>
          <textarea 
            v-model="form.technical_skills" 
            class="form-control n11-bg text-white border-secondary" 
            rows="3"
            placeholder="List your technical skills"
          ></textarea>
        </div>
      </div>

      <!-- Type-specific Documents -->
      <div class="mb-4">
        <h4 class="text-white mb-3">Specific Documents</h4>
        
        <!-- Organizer -->
        <div v-if="type === 'organizer'">
          <div class="mb-3">
            <label class="form-label text-white">Proof of Organized Event (link or description)</label>
            <textarea 
              v-model="form.event_proof" 
              class="form-control n11-bg text-white border-secondary" 
              rows="3"
              placeholder="Link to the event, poster, results..."
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label text-white">Tournament Structure (document)</label>
            <input 
              type="file" 
              @change="handleFileUpload($event, 'tournament_structure')"
              class="form-control n11-bg text-white border-secondary"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </div>
          <div class="mb-3">
            <label class="form-label text-white">Professional Contact Information</label>
            <textarea 
              v-model="form.professional_contacts" 
              class="form-control n11-bg text-white border-secondary" 
              rows="2"
              placeholder="Email, phone, professional social networks"
            ></textarea>
          </div>
        </div>

        <!-- Referee -->
        <div v-if="type === 'referee'">
          <div class="mb-3">
            <label class="form-label text-white">Mini CV</label>
            <textarea 
              v-model="form.mini_cv" 
              class="form-control n11-bg text-white border-secondary" 
              rows="4"
              placeholder="Experience in gaming, refereeing, moderation..."
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label text-white">Presentation Video (link)</label>
            <input 
              v-model="form.presentation_video" 
              type="url" 
              class="form-control n11-bg text-white border-secondary"
              placeholder="Link to the video (YouTube, Vimeo, etc.)"
            />
          </div>
          <div class="mb-3">
            <label class="form-label text-white">Proof of Activity in Gaming Communities</label>
            <textarea 
              v-model="form.community_proof" 
              class="form-control n11-bg text-white border-secondary" 
              rows="3"
              placeholder="Discord, Facebook, forums, etc."
            ></textarea>
          </div>
        </div>

        <!-- Ambassador -->
        <div v-if="type === 'ambassador'">
          <div class="mb-3">
            <label class="form-label text-white">Social Media Links *</label>
            <textarea 
              v-model="form.social_media_links" 
              class="form-control n11-bg text-white border-secondary" 
              rows="4"
              placeholder="Instagram, Twitter, TikTok, YouTube, etc. (one per line)"
              required
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label text-white">Audience Statistics (optional)</label>
            <textarea 
              v-model="form.audience_stats" 
              class="form-control n11-bg text-white border-secondary" 
              rows="3"
              placeholder="Number of followers, average views, engagement..."
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label text-white">Previous Media (links)</label>
            <textarea 
              v-model="form.previous_media" 
              class="form-control n11-bg text-white border-secondary" 
              rows="3"
              placeholder="Links to your previous posts, videos"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Identity Documents -->
      <div class="mb-4">
        <h4 class="text-white mb-3">Identity Documents (required)</h4>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label text-white">ID Card / Passport (front) *</label>
            <input 
              type="file" 
              @change="handleFileUpload($event, 'id_card_front')"
              class="form-control n11-bg text-white border-secondary"
              accept=".jpg,.jpeg,.png,.pdf"
              required
            />
          </div>
          <div class="col-md-6">
            <label class="form-label text-white">ID Card / Passport (back) *</label>
            <input 
              type="file" 
              @change="handleFileUpload($event, 'id_card_back')"
              class="form-control n11-bg text-white border-secondary"
              accept=".jpg,.jpeg,.png,.pdf"
              required
            />
          </div>
          <div class="col-md-12">
            <label class="form-label text-white">Selfie for Verification *</label>
            <input 
              type="file" 
              @change="handleFileUpload($event, 'selfie')"
              class="form-control n11-bg text-white border-secondary"
              accept=".jpg,.jpeg,.png"
              required
            />
            <small class="text-white-50">Take a clear selfie showing your face</small>
          </div>
        </div>
      </div>

      <!-- Error/Success Messages -->
      <div v-if="error" class="alert alert-danger mb-3">
        {{ error }}
      </div>
      <div v-if="success" class="alert alert-success mb-3">
        {{ success }}
      </div>

      <!-- Submit Button -->
      <div class="d-flex gap-3">
        <button 
          type="submit" 
          class="btn_primary flex-fill"
          :disabled="submitting"
        >
          <span v-if="submitting">
            <i class="fas fa-spinner fa-spin me-2"></i>
            Submitting...
          </span>
          <span v-else>
            <i class="fas fa-paper-plane me-2"></i>
            Submit Request
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/utils/axios';

interface Props {
  type: 'organizer' | 'referee' | 'ambassador';
}

const props = defineProps<Props>();
const router = useRouter();

const submitting = ref(false);
const error = ref('');
const success = ref('');

const form = ref({
  full_name: '',
  birth_date: '',
  country: '',
  city: '',
  phone: '',
  professional_email: '',
  username: '',
  user_id: null as number | null,
  experience: '',
  availability: '',
  technical_skills: '',
  event_proof: '',
  tournament_structure: null as File | null,
  professional_contacts: '',
  mini_cv: '',
  presentation_video: '',
  community_proof: '',
  social_media_links: '',
  audience_stats: '',
  previous_media: '',
  id_card_front: null as File | null,
  id_card_back: null as File | null,
  selfie: null as File | null,
});

// No authentication check needed - form is public

const handleFileUpload = (event: Event, field: string) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    (form.value as any)[field] = target.files[0];
  }
};

const submitForm = async () => {
  submitting.value = true;
  error.value = '';
  success.value = '';

  try {
    const formData = new FormData();
    
    // Informations personnelles
    formData.append('type', props.type);
    if (form.value.user_id) {
      formData.append('user_id', form.value.user_id.toString());
    }
    formData.append('full_name', form.value.full_name);
    if (form.value.birth_date) formData.append('birth_date', form.value.birth_date);
    if (form.value.country) formData.append('country', form.value.country);
    if (form.value.city) formData.append('city', form.value.city);
    formData.append('phone', form.value.phone);
    formData.append('professional_email', form.value.professional_email);
    // Username is optional - will use email if not provided
    if (form.value.username) {
      formData.append('username', form.value.username);
    }

    // Informations professionnelles
    if (form.value.experience) formData.append('experience', form.value.experience);
    if (form.value.availability) formData.append('availability', form.value.availability);
    if (form.value.technical_skills) formData.append('technical_skills', form.value.technical_skills);

    // Documents spécifiques
    if (props.type === 'organizer') {
      if (form.value.event_proof) formData.append('event_proof', form.value.event_proof);
      if (form.value.tournament_structure && form.value.tournament_structure instanceof File) {
        formData.append('tournament_structure', form.value.tournament_structure);
      }
      if (form.value.professional_contacts) formData.append('professional_contacts', form.value.professional_contacts);
    } else if (props.type === 'referee') {
      if (form.value.mini_cv) formData.append('mini_cv', form.value.mini_cv);
      if (form.value.presentation_video) formData.append('presentation_video', form.value.presentation_video);
      if (form.value.community_proof) formData.append('community_proof', form.value.community_proof);
    } else if (props.type === 'ambassador') {
      if (form.value.social_media_links) formData.append('social_media_links', form.value.social_media_links);
      if (form.value.audience_stats) formData.append('audience_stats', form.value.audience_stats);
      if (form.value.previous_media) formData.append('previous_media', form.value.previous_media);
    }

    // Identity documents (required)
    if (!form.value.id_card_front) {
      error.value = 'ID card front is required';
      submitting.value = false;
      return;
    }
    if (!form.value.id_card_back) {
      error.value = 'ID card back is required';
      submitting.value = false;
      return;
    }
    if (!form.value.selfie) {
      error.value = 'Selfie is required';
      submitting.value = false;
      return;
    }
    
    formData.append('id_card_front', form.value.id_card_front);
    formData.append('id_card_back', form.value.id_card_back);
    formData.append('selfie', form.value.selfie);

    const response = await apiClient.post('/certification-requests', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      success.value = 'Your request has been submitted successfully! We will contact you soon.';
      // Reset form
      form.value = {
        full_name: '',
        birth_date: '',
        country: '',
        city: '',
        phone: '',
        professional_email: '',
        username: '',
        user_id: null,
        experience: '',
        availability: '',
        technical_skills: '',
        event_proof: '',
        tournament_structure: null,
        professional_contacts: '',
        mini_cv: '',
        presentation_video: '',
        community_proof: '',
        social_media_links: '',
        audience_stats: '',
        previous_media: '',
        id_card_front: null,
        id_card_back: null,
        selfie: null,
      };
      // No redirect - user can stay on the page
    }
  } catch (err: any) {
    console.error('Error submitting certification request:', err);
    console.error('Error details:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      errors: err.response?.data?.errors,
    });
    
    // Display validation errors if available
    if (err.response?.data?.errors) {
      const validationErrors = err.response.data.errors;
      const errorMessages = Object.entries(validationErrors)
        .map(([field, messages]) => {
          const fieldLabel = field.replace(/_/g, ' ');
          return `${fieldLabel}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
        })
        .join('\n');
      error.value = `Validation errors:\n${errorMessages}`;
    } else if (err.response?.data?.message) {
      error.value = err.response.data.message;
    } else if (err.message) {
      error.value = `Error: ${err.message}`;
    } else {
      error.value = 'An error occurred during submission. Please try again.';
    }
  } finally {
    submitting.value = false;
  }
};

// Form is public - no authentication needed
</script>

<style scoped>
.certification-form {
  color: white;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-control {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
}

.form-control:focus {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: #FF9F00;
  color: white;
}

.form-control::placeholder {
  color: rgba(255, 255, 255, 0.5);
}
</style>

