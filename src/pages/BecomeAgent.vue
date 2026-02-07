<template>
  <div class="page-content-with-space">
    <section class="defis_section py-6 position-relative overflow-hidden pb-120">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 gx-0 gx-lg-4">
            <div class="defis__main">
              <!-- Header -->
              <div class="text-center mb-5">
                <h1 class="text-white fw-bold mb-3">{{ $t('becomeAgent.title') }}</h1>
                <p class="text-white-50">{{ $t('becomeAgent.subtitle') }}</p>
              </div>

              <!-- Conditions -->
              <div class="defi_card n11-bg rounded-8 p-4 p-lg-5 mb-4">
                <h2 class="text-white fw-bold mb-4">
                  <i class="fas fa-check-circle me-2 text-warning"></i>
                  {{ $t('becomeAgent.conditionsTitle') }}
                </h2>
                <ul class="conditions-list text-white">
                  <li>{{ $t('becomeAgent.condition1') }}</li>
                  <li>{{ $t('becomeAgent.condition2') }}</li>
                  <li>{{ $t('becomeAgent.condition3') }}</li>
                  <li>{{ $t('becomeAgent.condition4') }}</li>
                </ul>
              </div>

              <!-- Avantages -->
              <div class="defi_card n11-bg rounded-8 p-4 p-lg-5 mb-4">
                <h2 class="text-white fw-bold mb-4">
                  <i class="fas fa-star me-2 text-warning"></i>
                  {{ $t('becomeAgent.benefitsTitle') }}
                </h2>
                <ul class="conditions-list text-white">
                  <li>{{ $t('becomeAgent.benefit1') }}</li>
                  <li>{{ $t('becomeAgent.benefit2') }}</li>
                  <li>{{ $t('becomeAgent.benefit3') }}</li>
                  <li>{{ $t('becomeAgent.benefit4') }}</li>
                </ul>
              </div>

              <!-- Formulaire de demande -->
              <div class="defi_card n11-bg rounded-8 p-4 p-lg-5">
                <h2 class="text-white fw-bold mb-4">
                  <i class="fas fa-paper-plane me-2 text-warning"></i>
                  {{ $t('becomeAgent.submitTitle') }}
                </h2>
                
                <form @submit.prevent="submitRequest" class="agent-request-form">
                  <div class="row g-3">
                    <!-- Informations Personnelles -->
                    <div class="col-12">
                      <h3 class="text-white fw-bold mb-3">
                        <i class="fas fa-user me-2 text-warning"></i>
                        Informations Personnelles
                      </h3>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label text-white">{{ $t('becomeAgent.name') }} *</label>
                      <input
                        v-model="form.name"
                        type="text"
                        class="form-control n11-bg text-white border-secondary"
                        :placeholder="$t('becomeAgent.namePlaceholder')"
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label text-white">{{ $t('becomeAgent.whatsapp') }} *</label>
                      <input
                        v-model="form.whatsapp"
                        type="text"
                        class="form-control n11-bg text-white border-secondary"
                        :placeholder="$t('becomeAgent.whatsappPlaceholder')"
                        required
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label text-white">{{ $t('becomeAgent.email') }}</label>
                      <input
                        v-model="form.email"
                        type="email"
                        class="form-control n11-bg text-white border-secondary"
                        :placeholder="$t('becomeAgent.emailPlaceholder')"
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label text-white">{{ $t('becomeAgent.phone') }}</label>
                      <input
                        v-model="form.phone"
                        type="tel"
                        class="form-control n11-bg text-white border-secondary"
                        :placeholder="$t('becomeAgent.phonePlaceholder')"
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label text-white">{{ $t('becomeAgent.birthDate') }}</label>
                      <input
                        v-model="form.birth_date"
                        type="date"
                        class="form-control n11-bg text-white border-secondary"
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label text-white">{{ $t('becomeAgent.city') }}</label>
                      <input
                        v-model="form.city"
                        type="text"
                        class="form-control n11-bg text-white border-secondary"
                        :placeholder="$t('becomeAgent.cityPlaceholder')"
                      />
                    </div>

                    <!-- Informations Professionnelles -->
                    <div class="col-12 mt-4">
                      <h3 class="text-white fw-bold mb-3">
                        <i class="fas fa-briefcase me-2 text-warning"></i>
                        Informations Professionnelles
                      </h3>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label text-white">{{ $t('becomeAgent.occupation') }}</label>
                      <input
                        v-model="form.occupation"
                        type="text"
                        class="form-control n11-bg text-white border-secondary"
                        :placeholder="$t('becomeAgent.occupationPlaceholder')"
                      />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label text-white">{{ $t('becomeAgent.experience') }}</label>
                      <select
                        v-model="form.experience"
                        class="form-control n11-bg text-white border-secondary"
                      >
                        <option value="">{{ $t('becomeAgent.selectExperience') }}</option>
                        <option value="beginner">{{ $t('becomeAgent.beginner') }}</option>
                        <option value="intermediate">{{ $t('becomeAgent.intermediate') }}</option>
                        <option value="advanced">{{ $t('becomeAgent.advanced') }}</option>
                        <option value="expert">{{ $t('becomeAgent.expert') }}</option>
                      </select>
                    </div>
                    <div class="col-12">
                      <label class="form-label text-white">{{ $t('becomeAgent.skills') }}</label>
                      <textarea
                        v-model="form.skills"
                        class="form-control n11-bg text-white border-secondary"
                        rows="3"
                        :placeholder="$t('becomeAgent.skillsPlaceholder')"
                      ></textarea>
                    </div>

                    <!-- Disponibilité -->
                    <div class="col-12 mt-4">
                      <h3 class="text-white fw-bold mb-3">
                        <i class="fas fa-clock me-2 text-warning"></i>
                        Disponibilité
                      </h3>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label text-white">{{ $t('becomeAgent.availability') }}</label>
                      <select
                        v-model="form.availability"
                        class="form-control n11-bg text-white border-secondary"
                      >
                        <option value="">{{ $t('becomeAgent.selectAvailability') }}</option>
                        <option value="full-time">{{ $t('becomeAgent.fullTime') }}</option>
                        <option value="part-time">{{ $t('becomeAgent.partTime') }}</option>
                        <option value="weekends">{{ $t('becomeAgent.weekends') }}</option>
                        <option value="flexible">{{ $t('becomeAgent.flexible') }}</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label text-white">{{ $t('becomeAgent.workingHours') }}</label>
                      <input
                        v-model="form.working_hours"
                        type="text"
                        class="form-control n11-bg text-white border-secondary"
                        :placeholder="$t('becomeAgent.workingHoursPlaceholder')"
                      />
                    </div>

                    <!-- Motivation -->
                    <div class="col-12 mt-4">
                      <h3 class="text-white fw-bold mb-3">
                        <i class="fas fa-heart me-2 text-warning"></i>
                        Motivation
                      </h3>
                    </div>
                    <div class="col-12">
                      <label class="form-label text-white">{{ $t('becomeAgent.motivation') }}</label>
                      <textarea
                        v-model="form.motivation"
                        class="form-control n11-bg text-white border-secondary"
                        rows="4"
                        :placeholder="$t('becomeAgent.motivationPlaceholder')"
                        required
                      ></textarea>
                    </div>
                    <div class="col-12">
                      <label class="form-label text-white">{{ $t('becomeAgent.message') }}</label>
                      <textarea
                        v-model="form.message"
                        class="form-control n11-bg text-white border-secondary"
                        rows="4"
                        :placeholder="$t('becomeAgent.messagePlaceholder')"
                      ></textarea>
                    </div>

                    <!-- Documents -->
                    <div class="col-12 mt-4">
                      <h3 class="text-white fw-bold mb-3">
                        <i class="fas fa-file-alt me-2 text-warning"></i>
                        Documents
                      </h3>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label text-white">{{ $t('becomeAgent.hasIdCard') }}</label>
                      <select
                        v-model="form.has_id_card"
                        class="form-control n11-bg text-white border-secondary"
                      >
                        <option value="">{{ $t('becomeAgent.selectOption') }}</option>
                        <option value="yes">{{ $t('becomeAgent.yes') }}</option>
                        <option value="no">{{ $t('becomeAgent.no') }}</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label text-white">{{ $t('becomeAgent.hasBusinessLicense') }}</label>
                      <select
                        v-model="form.has_business_license"
                        class="form-control n11-bg text-white border-secondary"
                      >
                        <option value="">{{ $t('becomeAgent.selectOption') }}</option>
                        <option value="yes">{{ $t('becomeAgent.yes') }}</option>
                        <option value="no">{{ $t('becomeAgent.no') }}</option>
                      </select>
                    </div>

                    <!-- Termes et Conditions -->
                    <div class="col-12 mt-4">
                      <div class="form-check">
                        <input
                          v-model="form.agree_terms"
                          type="checkbox"
                          class="form-check-input"
                          id="agreeTerms"
                          required
                        />
                        <label class="form-check-label text-white" for="agreeTerms">
                          {{ $t('becomeAgent.agreeTerms') }} *
                        </label>
                      </div>
                    </div>

                    <div class="col-12">
                      <button
                        type="submit"
                        class="btn btn-primary w-100"
                        :disabled="loading"
                      >
                        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                        {{ loading ? $t('becomeAgent.submitting') : $t('becomeAgent.submit') }}
                      </button>
                    </div>
                  </div>
                </form>

                <!-- Success/error message -->
                <div v-if="message" class="mt-3">
                  <div :class="['alert', messageType === 'success' ? 'alert-success' : 'alert-danger']">
                    {{ message }}
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
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import apiClient from '@/utils/axios';

const { t } = useI18n();

const form = ref({
  name: '',
  whatsapp: '',
  email: '',
  phone: '',
  birth_date: '',
  city: '',
  occupation: '',
  experience: '',
  skills: '',
  availability: '',
  working_hours: '',
  motivation: '',
  message: '',
  has_id_card: '',
  has_business_license: '',
  agree_terms: false,
});

const loading = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error'>('success');

const submitRequest = async () => {
  loading.value = true;
  message.value = '';

  try {
    const token = localStorage.getItem('auth_token');
    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await apiClient.post('/agent-requests', form.value, { headers });

    if (response.data.success) {
      message.value = t('becomeAgent.successMessage');
      messageType.value = 'success';
      // Réinitialiser le formulaire
      form.value = {
        name: '',
        whatsapp: '',
        email: '',
        phone: '',
        birth_date: '',
        city: '',
        occupation: '',
        experience: '',
        skills: '',
        availability: '',
        working_hours: '',
        motivation: '',
        message: '',
        has_id_card: '',
        has_business_license: '',
        agree_terms: false,
      };
    } else {
      message.value = response.data.message || t('becomeAgent.errorMessage');
      messageType.value = 'error';
    }
  } catch (error: any) {
    console.error('Error submitting agent request:', error);
    message.value = error.response?.data?.message || t('becomeAgent.errorMessage');
    messageType.value = 'error';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.page-content-with-space {
  padding-top: 90px;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
}

.defis_section {
  width: 100%;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  color: white;
  position: relative;
  overflow: hidden;
  border-radius: 24px;
}

.conditions-list {
  list-style: none;
  padding: 0;
}

.conditions-list li {
  padding: 0.75rem 0;
  padding-left: 2rem;
  position: relative;
}

.conditions-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #FF9F00;
  font-weight: bold;
}

.agent-request-form .form-control:focus {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: #FF9F00;
  color: white;
}

.agent-request-form .form-control::placeholder {
  color: rgba(255, 255, 255, 0.5);
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





