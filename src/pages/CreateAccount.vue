<template>
  <div class="tw-auth-page">
    <div class="tw-auth-card">

      <!-- Logo -->
      <div class="tw-auth-logo">
        <router-link to="/">eBetStream</router-link>
      </div>

      <!-- Title & subtitle -->
      <h2 class="tw-auth-title">{{ $t('auth.createAccount') }}</h2>
      <p class="tw-auth-sub">{{ $t('auth.createAccountDescription') }}</p>

      <!-- Success alert -->
      <div v-if="successMessage" class="tw-alert tw-alert--success">
        <span>{{ successMessage }}</span>
        <button class="tw-alert__close" @click="successMessage = ''">✕</button>
      </div>

      <!-- Error alert -->
      <div v-if="errorMessage" class="tw-alert tw-alert--error">
        <span>{{ errorMessage }}</span>
        <button class="tw-alert__close" @click="errorMessage = ''">✕</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="registerUser" class="tw-auth-form">

        <!-- Username -->
        <div class="tw-field">
          <label class="tw-label" for="reg-username">{{ $t('auth.username') }}</label>
          <input
            id="reg-username"
            class="tw-input"
            type="text"
            :placeholder="$t('auth.username')"
            v-model="form.username"
            required
            autocomplete="username"
          />
        </div>

        <!-- Email -->
        <div class="tw-field">
          <label class="tw-label" for="reg-email">{{ $t('auth.email') }}</label>
          <input
            id="reg-email"
            class="tw-input"
            type="email"
            :placeholder="$t('auth.email')"
            v-model="form.email"
            required
            autocomplete="email"
          />
        </div>

        <!-- Password -->
        <div class="tw-field">
          <label class="tw-label" for="reg-password">{{ $t('auth.password') }}</label>
          <div class="tw-password-wrap">
            <input
              id="reg-password"
              class="tw-input"
              :type="showPassword ? 'text' : 'password'"
              :placeholder="$t('auth.password')"
              v-model="form.password"
              required
              autocomplete="new-password"
            />
            <button type="button" class="tw-eye-btn" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Hide password' : 'Show password'">
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>

          <!-- Password strength bar -->
          <div v-if="form.password" class="tw-strength-bar">
            <div class="tw-strength-bar__track">
              <div
                class="tw-strength-bar__fill"
                :class="`tw-strength-bar__fill--${passwordStrengthClass}`"
              ></div>
            </div>
            <span class="tw-strength-bar__label" :class="`tw-strength-text--${passwordStrengthClass}`">
              {{ passwordStrengthText }}
            </span>
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="tw-field">
          <label class="tw-label" for="reg-confirm">{{ $t('auth.confirmPassword') }}</label>
          <div class="tw-password-wrap">
            <input
              id="reg-confirm"
              class="tw-input"
              :type="showConfirm ? 'text' : 'password'"
              :placeholder="$t('auth.confirmPassword')"
              v-model="form.password_confirmation"
              required
              autocomplete="new-password"
            />
            <button type="button" class="tw-eye-btn" @click="showConfirm = !showConfirm" :aria-label="showConfirm ? 'Hide password' : 'Show password'">
              <svg v-if="showConfirm" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Promo Code (optional) -->
        <div class="tw-field">
          <label class="tw-label" for="reg-promo">
            {{ $t('auth.promoCode') }}
            <span class="tw-label-optional">({{ $t('common.optional', 'optional') }})</span>
          </label>
          <input
            id="reg-promo"
            class="tw-input"
            type="text"
            :placeholder="$t('auth.promoCode')"
            v-model="form.promo_code"
          />
        </div>

        <!-- Submit -->
        <button type="submit" class="tw-btn tw-btn--primary w-100" :disabled="loading">
          <span v-if="loading">{{ $t('common.pleaseWait') }}</span>
          <span v-else>{{ $t('auth.signUpNow') }}</span>
        </button>

      </form>

      <!-- Divider -->
      <div class="tw-divider">
        <span>{{ $t('auth.orContinueWith') }}</span>
      </div>

      <!-- Social buttons -->
      <div class="tw-social-row">
        <router-link to="#" class="tw-social-btn">
          <i class="fab fa-facebook-f"></i>
        </router-link>
        <router-link to="#" class="tw-social-btn">
          <i class="fab fa-twitter"></i>
        </router-link>
        <router-link to="#" class="tw-social-btn">
          <i class="fab fa-google"></i>
        </router-link>
      </div>

      <!-- Footer link -->
      <p class="tw-auth-footer">
        {{ $t('auth.alreadyMember') }}
        <router-link to="/login">{{ $t('auth.login') }}</router-link>
      </p>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import apiClient from "@/utils/axios";
import createAccount from "@/assets/images/1234.jpeg";
const { t } = useI18n();

const router = useRouter();

const form = ref({
  username: "",
  email: "",
  password: "",
  password_confirmation: "",
  promo_code: "",
});

const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

// Show/hide passwords
const showPassword = ref(false);
const showConfirm = ref(false);

// Password strength
const passwordStrengthText = ref("");
const passwordStrengthClass = ref("");

watch(() => form.value.password, (newVal) => {
  if (!newVal) {
    passwordStrengthText.value = "";
    passwordStrengthClass.value = "";
  } else if (newVal.length < 6) {
    passwordStrengthText.value = t('auth.passwordStrength.weak');
    passwordStrengthClass.value = "weak";
  } else if (/[A-Z]/.test(newVal) && /[0-9]/.test(newVal) && newVal.length >= 8) {
    passwordStrengthText.value = t('auth.passwordStrength.strong');
    passwordStrengthClass.value = "strong";
  } else {
    passwordStrengthText.value = t('auth.passwordStrength.medium');
    passwordStrengthClass.value = "medium";
  }
});

const registerUser = async () => {
  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    await apiClient.post("/register", form.value);
    successMessage.value = t('auth.accountCreated');

    // Reset form
    form.value = {
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
      promo_code: "",
    };

    // Redirection après 1 seconde
    setTimeout(() => {
      router.push("/login");
    }, 1000);

  } catch (error: any) {
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.message || t('auth.registrationFailed');
    } else {
      errorMessage.value = t('auth.networkError');
    }
  } finally {
    loading.value = false;
  }
};

// Redirect to dashboard if already logged in
onMounted(() => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    router.push("/dashboard");
  }
});
</script>

<style scoped>
/* Form */
.tw-auth-form {
  width: 100%;
}

/* Field spacing */
.tw-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

/* Optional label hint */
.tw-label-optional {
  font-size: 0.75rem;
  color: rgb(var(--n3));
  font-weight: 400;
  margin-left: 4px;
}

/* Password field wrapper */
.tw-password-wrap {
  position: relative;
}

.tw-password-wrap .tw-input {
  padding-right: 44px;
}

.tw-eye-btn {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  color: rgb(var(--n3));
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.15s;
}

.tw-eye-btn:hover {
  color: rgb(var(--n8));
}

/* Password strength bar */
.tw-strength-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
}

.tw-strength-bar__track {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: rgb(var(--n2));
  overflow: hidden;
}

.tw-strength-bar__fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease, background 0.3s ease;
}

.tw-strength-bar__fill--weak {
  width: 33%;
  background: #f44336;
}

.tw-strength-bar__fill--medium {
  width: 66%;
  background: #ff9800;
}

.tw-strength-bar__fill--strong {
  width: 100%;
  background: #4caf50;
}

.tw-strength-bar__label {
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.tw-strength-text--weak   { color: #f44336; }
.tw-strength-text--medium { color: #ff9800; }
.tw-strength-text--strong { color: #4caf50; }

/* Divider */
.tw-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0 20px;
  color: rgb(var(--n3));
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.tw-divider::before,
.tw-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgb(var(--n2));
}

/* Social buttons */
.tw-social-row {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.tw-social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: rgb(var(--p3));
  border: 1px solid rgb(var(--n2));
  color: rgb(var(--n8));
  text-decoration: none;
  transition: background 0.15s, border-color 0.15s;
}

.tw-social-btn:hover {
  background: rgb(var(--n2));
  border-color: rgb(var(--g1));
  color: rgb(var(--g1));
}
</style>
