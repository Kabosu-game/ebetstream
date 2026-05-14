<template>
  <div class="tw-page">
    <!-- Hero -->
    <div class="tw-page-hero">
      <div class="contact-eyebrow">
        <i class="fas fa-envelope"></i>{{ $t('ui.contact') }}</div>
      <h1 class="tw-page-hero__title">{{ $t('ui.contact_us') }}</h1>
      <p class="tw-page-hero__sub">
        We are here to help you. Feel free to reach out for any questions, suggestions, or issues.
        Our team will respond as soon as possible.
      </p>
    </div>

    <!-- Two-column layout -->
    <div class="contact-layout">
      <!-- Form column -->
      <div class="contact-form-col">
        <div class="tw-card contact-form-card">
          <h3 class="contact-form-card__heading">{{ $t('ui.send_us_a_message') }}</h3>

          <form @submit.prevent="handleSubmit" class="contact-form">
            <!-- Name -->
            <div class="contact-form__field">
              <label class="tw-label">{{ $t('ui.full_name_2') }}</label>
              <input
                v-model="form.name"
                type="text"
                class="tw-input"
                :placeholder="$t('ui.your_name')"
                required
              />
            </div>

            <!-- Email -->
            <div class="contact-form__field">
              <label class="tw-label">{{ $t('common.email') }}</label>
              <input
                v-model="form.email"
                type="email"
                class="tw-input"
                :placeholder="$t('ui.your_email_com')"
                required
              />
            </div>

            <!-- Subject -->
            <div class="contact-form__field">
              <label class="tw-label">{{ $t('ui.subject') }}</label>
              <select
                v-model="form.subject"
                class="tw-input tw-select"
                required
              >
                <option value="">{{ $t('ui.select_a_subject') }}</option>
                <option value="support">{{ $t('ui.technical_support') }}</option>
                <option value="account">{{ $t('ui.account_issue') }}</option>
                <option value="payment">{{ $t('ui.payment_question') }}</option>
                <option value="challenge">{{ $t('ui.challenge_question') }}</option>
                <option value="event">{{ $t('ui.event_question') }}</option>
                <option value="other">{{ $t('ui.other') }}</option>
              </select>
            </div>

            <!-- Message -->
            <div class="contact-form__field">
              <label class="tw-label">{{ $t('ui.message') }}</label>
              <textarea
                v-model="form.message"
                class="tw-textarea"
                rows="6"
                :placeholder="$t('ui.your_message')"
                required
              ></textarea>
            </div>

            <!-- Submit -->
            <button type="submit" class="tw-btn tw-btn--primary contact-form__submit" :disabled="submitting">
              <span v-if="!submitting">
                <i class="fas fa-paper-plane"></i>
                Send Message
              </span>
              <span v-else>
                <i class="fas fa-spinner fa-spin"></i>
                Sending...
              </span>
            </button>

            <!-- Success -->
            <div v-if="submitSuccess" class="contact-alert contact-alert--success">
              <i class="fas fa-check-circle"></i>
              Message sent successfully! We will respond soon.
            </div>

            <!-- Error -->
            <div v-if="submitError" class="contact-alert contact-alert--error">
              <i class="fas fa-exclamation-circle"></i>
              {{ submitError }}
            </div>
          </form>
        </div>
      </div>

      <!-- Sidebar column -->
      <div class="contact-sidebar">
        <!-- Email card -->
        <div class="tw-card contact-info-card">
          <div class="contact-info-card__inner">
            <span class="contact-info-card__icon">
              <i class="fas fa-envelope"></i>
            </span>
            <div>
              <h5 class="contact-info-card__title">{{ $t('common.email') }}</h5>
              <p class="contact-info-card__value">{{ $t('ui.support_acmpt_online') }}</p>
            </div>
          </div>
        </div>

        <!-- Support card -->
        <div class="tw-card contact-info-card">
          <div class="contact-info-card__inner">
            <span class="contact-info-card__icon">
              <i class="fas fa-headset"></i>
            </span>
            <div>
              <h5 class="contact-info-card__title">{{ $t('ui.support') }}</h5>
              <p class="contact-info-card__value">{{ $t('ui.available_24_7') }}</p>
            </div>
          </div>
        </div>

        <!-- Response time card -->
        <div class="tw-card contact-info-card">
          <div class="contact-info-card__inner">
            <span class="contact-info-card__icon">
              <i class="fas fa-clock"></i>
            </span>
            <div>
              <h5 class="contact-info-card__title">{{ $t('ui.response_time') }}</h5>
              <p class="contact-info-card__value">{{ $t('ui.within_24_hours') }}</p>
            </div>
          </div>
        </div>

        <!-- Resources card -->
        <div class="tw-card contact-resources">
          <h5 class="contact-resources__heading">{{ $t('ui.other_resources') }}</h5>
          <div class="tw-divider"></div>
          <nav class="contact-resources__links">
            <router-link to="/help" class="contact-resource-link">
              <i class="fas fa-question-circle"></i>
              Help Center
            </router-link>
            <router-link to="/faq" class="contact-resource-link">
              <i class="fas fa-list-alt"></i>
              FAQ
            </router-link>
            <router-link to="/privacy" class="contact-resource-link">
              <i class="fas fa-shield-alt"></i>
              Privacy Policy
            </router-link>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { ref } from 'vue';

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const submitting = ref(false);
const submitSuccess = ref(false);
const submitError = ref('');

const handleSubmit = async () => {
  submitting.value = true;
  submitSuccess.value = false;
  submitError.value = '';

  // Simulate sending (to be replaced with a real API call)
  setTimeout(() => {
    submitting.value = false;
    submitSuccess.value = true;
    form.value = { name: '', email: '', subject: '', message: '' };

    setTimeout(() => {
      submitSuccess.value = false;
    }, 5000);
  }, 1500);
};
</script>

<style scoped>
/* Eyebrow */
.contact-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgb(var(--g1));
  background: rgba(var(--g1), 0.12);
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  margin-bottom: 1rem;
}

/* Two-column layout */
.contact-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 1.5rem;
  align-items: flex-start;
}

@media (max-width: 900px) {
  .contact-layout {
    grid-template-columns: 1fr;
  }
}

/* Form card */
.contact-form-card {
  padding: 1.75rem;
}

.contact-form-card__heading {
  font-size: 1.1rem;
  font-weight: 700;
  color: rgb(var(--n8));
  margin: 0 0 1.5rem;
}

/* Form fields */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.contact-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

/* Shared input/select/textarea baseline */
.tw-input,
.tw-select,
.tw-textarea {
  width: 100%;
  background: rgb(var(--p3));
  border: 1px solid rgb(var(--n2));
  border-radius: 8px;
  color: rgb(var(--n8));
  font-size: 0.875rem;
  padding: 0.6rem 0.875rem;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}

.tw-input::placeholder,
.tw-textarea::placeholder {
  color: rgb(var(--n3));
}

.tw-input:focus,
.tw-select:focus,
.tw-textarea:focus {
  border-color: rgb(var(--g1));
  box-shadow: 0 0 0 3px rgba(var(--g1), 0.15);
}

.tw-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23adadb8' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.875rem center;
  padding-right: 2.25rem;
  cursor: pointer;
}

.tw-select option {
  background: rgb(var(--p2));
  color: rgb(var(--n8));
}

.tw-textarea {
  resize: vertical;
  min-height: 130px;
}

.tw-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: rgb(var(--n3));
  letter-spacing: 0.03em;
}

/* Submit button */
.contact-form__submit {
  width: 100%;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.contact-form__submit:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* Alerts */
.contact-alert {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
}

.contact-alert--success {
  background: rgba(0, 185, 84, 0.12);
  border: 1px solid rgba(0, 185, 84, 0.3);
  color: #00b954;
}

.contact-alert--error {
  background: rgba(var(--r1), 0.1);
  border: 1px solid rgba(var(--r1), 0.3);
  color: rgb(var(--r1));
}

/* Sidebar */
.contact-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Info cards */
.contact-info-card {
  padding: 1rem 1.25rem;
}

.contact-info-card__inner {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.contact-info-card__icon {
  display: inline-flex;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: rgba(var(--g1), 0.12);
  color: rgb(var(--g1));
  font-size: 1.1rem;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-info-card__title {
  font-size: 0.85rem;
  font-weight: 700;
  color: rgb(var(--n8));
  margin: 0 0 0.2rem;
}

.contact-info-card__value {
  font-size: 0.82rem;
  color: rgb(var(--n3));
  margin: 0;
}

/* Resources card */
.contact-resources {
  padding: 1.25rem;
}

.contact-resources__heading {
  font-size: 0.85rem;
  font-weight: 700;
  color: rgb(var(--n8));
  margin: 0 0 0.75rem;
}

.contact-resources__links {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding-top: 0.75rem;
}

.contact-resource-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.85rem;
  color: rgb(var(--n3));
  text-decoration: none;
  transition: color 0.2s;
}

.contact-resource-link i {
  color: rgb(var(--g1));
  width: 16px;
  text-align: center;
}

.contact-resource-link:hover {
  color: rgb(var(--n8));
}
</style>
