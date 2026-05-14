<template>
  <div class="tw-page">
    <div class="tw-page-hero">
      <p class="tw-page-hero__eyebrow">
        <i class="ti ti-user-check"></i> {{ $t('becomeAgent.title') }}
      </p>
      <h1 class="tw-page-hero__title">{{ $t('becomeAgent.title') }}</h1>
      <p class="tw-page-hero__sub">{{ $t('becomeAgent.subtitle') }}</p>
      <div class="tw-page-hero__actions">
        <router-link to="/agents-crypto" class="tw-btn tw-btn--secondary">
          <i class="ti ti-info-circle"></i>{{ $t('ui.en_savoir_plus_sur_le_r_seau') }}</router-link>
      </div>
    </div>

    <div class="tw-grid-2 agent-info-grid">
      <div class="tw-content-block">
        <div class="agent-block__head">
          <span class="agent-block__icon"><i class="ti ti-checklist"></i></span>
          <h2 class="tw-section-title">{{ $t('becomeAgent.conditionsTitle') }}</h2>
        </div>
        <ul class="agent-list">
          <li>{{ $t('becomeAgent.condition1') }}</li>
          <li>{{ $t('becomeAgent.condition2') }}</li>
          <li>{{ $t('becomeAgent.condition3') }}</li>
          <li>{{ $t('becomeAgent.condition4') }}</li>
        </ul>
      </div>

      <div class="tw-content-block">
        <div class="agent-block__head">
          <span class="agent-block__icon agent-block__icon--gold"><i class="ti ti-star"></i></span>
          <h2 class="tw-section-title">{{ $t('becomeAgent.benefitsTitle') }}</h2>
        </div>
        <ul class="agent-list">
          <li>{{ $t('becomeAgent.benefit1') }}</li>
          <li>{{ $t('becomeAgent.benefit2') }}</li>
          <li>{{ $t('becomeAgent.benefit3') }}</li>
          <li>{{ $t('becomeAgent.benefit4') }}</li>
        </ul>
      </div>
    </div>

    <div class="tw-section-header">
      <div class="tw-section-header__left">
        <span class="tw-section-icon"><i class="ti ti-send"></i></span>
        <h2 class="tw-section-title">{{ $t('becomeAgent.submitTitle') }}</h2>
      </div>
    </div>

    <div class="tw-card agent-form-card">
      <form @submit.prevent="submitRequest" class="agent-form">
        <div class="agent-form__section">
          <h3 class="agent-form__section-title">
            <i class="ti ti-user"></i>{{ $t('ui.informations_personnelles') }}</h3>
          <div class="agent-form__grid">
            <div class="tw-form-group">
              <label class="tw-label">{{ $t('becomeAgent.name') }} *</label>
              <input
                v-model="form.name"
                type="text"
                class="tw-input"
                :placeholder="$t('becomeAgent.namePlaceholder')"
                required
              />
            </div>
            <div class="tw-form-group">
              <label class="tw-label">{{ $t('becomeAgent.whatsapp') }} *</label>
              <input
                v-model="form.whatsapp"
                type="text"
                class="tw-input"
                :placeholder="$t('becomeAgent.whatsappPlaceholder')"
                required
              />
            </div>
            <div class="tw-form-group">
              <label class="tw-label">{{ $t('becomeAgent.email') }}</label>
              <input
                v-model="form.email"
                type="email"
                class="tw-input"
                :placeholder="$t('becomeAgent.emailPlaceholder')"
              />
            </div>
            <div class="tw-form-group">
              <label class="tw-label">{{ $t('becomeAgent.phone') }}</label>
              <input
                v-model="form.phone"
                type="tel"
                class="tw-input"
                :placeholder="$t('becomeAgent.phonePlaceholder')"
              />
            </div>
            <div class="tw-form-group">
              <label class="tw-label">{{ $t('becomeAgent.birthDate') }}</label>
              <input v-model="form.birth_date" type="date" class="tw-input" />
            </div>
            <div class="tw-form-group">
              <label class="tw-label">{{ $t('becomeAgent.city') }}</label>
              <input
                v-model="form.city"
                type="text"
                class="tw-input"
                :placeholder="$t('becomeAgent.cityPlaceholder')"
              />
            </div>
          </div>
        </div>

        <div class="agent-form__section">
          <h3 class="agent-form__section-title">
            <i class="ti ti-briefcase"></i>{{ $t('ui.informations_professionnelles') }}</h3>
          <div class="agent-form__grid">
            <div class="tw-form-group">
              <label class="tw-label">{{ $t('becomeAgent.occupation') }}</label>
              <input
                v-model="form.occupation"
                type="text"
                class="tw-input"
                :placeholder="$t('becomeAgent.occupationPlaceholder')"
              />
            </div>
            <div class="tw-form-group">
              <label class="tw-label">{{ $t('becomeAgent.experience') }}</label>
              <select v-model="form.experience" class="tw-input tw-select">
                <option value="">{{ $t('becomeAgent.selectExperience') }}</option>
                <option value="beginner">{{ $t('becomeAgent.beginner') }}</option>
                <option value="intermediate">{{ $t('becomeAgent.intermediate') }}</option>
                <option value="advanced">{{ $t('becomeAgent.advanced') }}</option>
                <option value="expert">{{ $t('becomeAgent.expert') }}</option>
              </select>
            </div>
            <div class="tw-form-group agent-form__full">
              <label class="tw-label">{{ $t('becomeAgent.skills') }}</label>
              <textarea
                v-model="form.skills"
                class="tw-textarea"
                rows="3"
                :placeholder="$t('becomeAgent.skillsPlaceholder')"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="agent-form__section">
          <h3 class="agent-form__section-title">
            <i class="ti ti-clock"></i>{{ $t('ui.disponibilit') }}</h3>
          <div class="agent-form__grid">
            <div class="tw-form-group">
              <label class="tw-label">{{ $t('becomeAgent.availability') }}</label>
              <select v-model="form.availability" class="tw-input tw-select">
                <option value="">{{ $t('becomeAgent.selectAvailability') }}</option>
                <option value="full-time">{{ $t('becomeAgent.fullTime') }}</option>
                <option value="part-time">{{ $t('becomeAgent.partTime') }}</option>
                <option value="weekends">{{ $t('becomeAgent.weekends') }}</option>
                <option value="flexible">{{ $t('becomeAgent.flexible') }}</option>
              </select>
            </div>
            <div class="tw-form-group">
              <label class="tw-label">{{ $t('becomeAgent.workingHours') }}</label>
              <input
                v-model="form.working_hours"
                type="text"
                class="tw-input"
                :placeholder="$t('becomeAgent.workingHoursPlaceholder')"
              />
            </div>
          </div>
        </div>

        <div class="agent-form__section">
          <h3 class="agent-form__section-title">
            <i class="ti ti-heart"></i>{{ $t('ui.motivation') }}</h3>
          <div class="agent-form__grid">
            <div class="tw-form-group agent-form__full">
              <label class="tw-label">{{ $t('becomeAgent.motivation') }} *</label>
              <textarea
                v-model="form.motivation"
                class="tw-textarea"
                rows="4"
                :placeholder="$t('becomeAgent.motivationPlaceholder')"
                required
              ></textarea>
            </div>
            <div class="tw-form-group agent-form__full">
              <label class="tw-label">{{ $t('becomeAgent.message') }}</label>
              <textarea
                v-model="form.message"
                class="tw-textarea"
                rows="4"
                :placeholder="$t('becomeAgent.messagePlaceholder')"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="agent-form__section">
          <h3 class="agent-form__section-title">
            <i class="ti ti-file-text"></i>{{ $t('ui.documents') }}</h3>
          <div class="agent-form__grid">
            <div class="tw-form-group">
              <label class="tw-label">{{ $t('becomeAgent.hasIdCard') }}</label>
              <select v-model="form.has_id_card" class="tw-input tw-select">
                <option value="">{{ $t('becomeAgent.selectOption') }}</option>
                <option value="yes">{{ $t('becomeAgent.yes') }}</option>
                <option value="no">{{ $t('becomeAgent.no') }}</option>
              </select>
            </div>
            <div class="tw-form-group">
              <label class="tw-label">{{ $t('becomeAgent.hasBusinessLicense') }}</label>
              <select v-model="form.has_business_license" class="tw-input tw-select">
                <option value="">{{ $t('becomeAgent.selectOption') }}</option>
                <option value="yes">{{ $t('becomeAgent.yes') }}</option>
                <option value="no">{{ $t('becomeAgent.no') }}</option>
              </select>
            </div>
          </div>
        </div>

        <label class="agent-checkbox">
          <input v-model="form.agree_terms" type="checkbox" required />
          <span>{{ $t('becomeAgent.agreeTerms') }} *</span>
        </label>

        <button type="submit" class="tw-btn tw-btn--primary agent-form__submit" :disabled="loading">
          <i v-if="loading" class="ti ti-loader-2 agent-spin"></i>
          <i v-else class="ti ti-send"></i>
          {{ loading ? $t('becomeAgent.submitting') : $t('becomeAgent.submit') }}
        </button>

        <div v-if="message" :class="['agent-alert', messageType === 'success' ? 'agent-alert--success' : 'agent-alert--error']">
          <i :class="messageType === 'success' ? 'ti ti-circle-check' : 'ti ti-alert-circle'"></i>
          {{ message }}
        </div>
      </form>
    </div>
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

const emptyForm = () => ({
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

const submitRequest = async () => {
  loading.value = true;
  message.value = '';

  try {
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await apiClient.post('/agent-requests', form.value, { headers });

    if (response.data.success) {
      message.value = t('becomeAgent.successMessage');
      messageType.value = 'success';
      form.value = emptyForm();
    } else {
      message.value = response.data.message || t('becomeAgent.errorMessage');
      messageType.value = 'error';
    }
  } catch (error: any) {
    message.value = error.response?.data?.message || t('becomeAgent.errorMessage');
    messageType.value = 'error';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.agent-info-grid {
  margin-bottom: 28px;
}

.agent-block__head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.agent-block__icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--g1), 0.12);
  color: rgb(var(--g1));
  font-size: 1.2rem;
  flex-shrink: 0;
}

.agent-block__icon--gold {
  background: rgba(255, 159, 0, 0.12);
  color: #ff9f00;
}

.agent-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.agent-list li {
  position: relative;
  padding-left: 22px;
  font-size: 14px;
  color: rgb(var(--n5));
  line-height: 1.5;
}

.agent-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: rgb(var(--g1));
  font-weight: 700;
}

.agent-form-card {
  padding: 24px;
}

.agent-form__section {
  margin-bottom: 28px;
  padding-bottom: 28px;
  border-bottom: 1px solid rgb(var(--n2));
}

.agent-form__section:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}

.agent-form__section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: rgb(var(--n8));
  margin: 0 0 16px;
}

.agent-form__section-title i {
  color: rgb(var(--g1));
}

.agent-form__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0 16px;
}

.agent-form__full {
  grid-column: 1 / -1;
}

.agent-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: rgb(var(--n5));
  margin-bottom: 20px;
  cursor: pointer;
}

.agent-checkbox input {
  margin-top: 2px;
  accent-color: rgb(var(--g1));
  flex-shrink: 0;
}

.agent-form__submit {
  width: 100%;
  justify-content: center;
  min-height: 44px;
}

.agent-alert {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.5;
}

.agent-alert--success {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.25);
  color: #86efac;
}

.agent-alert--error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #fca5a5;
}

.agent-spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .agent-form__grid {
    grid-template-columns: 1fr;
  }

  .agent-form-card {
    padding: 16px;
  }
}
</style>
