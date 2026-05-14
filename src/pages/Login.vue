<template>
  <div class="tw-auth-page">
    <div class="tw-auth-card">

      <!-- Logo -->
      <div class="tw-auth-logo">
        <router-link to="/">eBetStream</router-link>
      </div>

      <!-- Title & subtitle -->
      <h2 class="tw-auth-title">{{ $t('auth.loginTitle') }}</h2>
      <p class="tw-auth-sub">{{ $t('auth.loginDescription') }}</p>

      <!-- Success alert -->
      <div v-if="successMessage" class="tw-alert tw-alert--success">
        <span>{{ successMessage }}</span>
        <button class="tw-alert__close" @click="successMessage = ''">✕</button>
      </div>

      <!-- Error alert -->
      <div v-if="errorMessage" class="tw-alert tw-alert--error">
        <div style="white-space: pre-line;">{{ errorMessage }}</div>
        <button class="tw-alert__close" @click="errorMessage = ''">✕</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="loginUser" class="tw-auth-form">

        <!-- Email -->
        <div class="tw-field">
          <label class="tw-label" for="login-email">{{ $t('auth.email') }}</label>
          <input
            id="login-email"
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
          <label class="tw-label" for="login-password">{{ $t('auth.password') }}</label>
          <div class="tw-password-wrap">
            <input
              id="login-password"
              class="tw-input"
              :type="showPassword ? 'text' : 'password'"
              :placeholder="$t('auth.password')"
              v-model="form.password"
              required
              autocomplete="current-password"
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
        </div>

        <!-- Forgot password -->
        <div class="tw-forgot">
          <router-link to="/forgot-password">{{ $t('auth.forgotPassword') }}</router-link>
        </div>

        <!-- Submit -->
        <button class="tw-btn tw-btn--primary w-100" type="submit" :disabled="loading">
          <span v-if="loading">{{ $t('common.pleaseWait') }}</span>
          <span v-else>{{ $t('auth.loginButton') }}</span>
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
        {{ $t('auth.createYourAccount') }}
        <router-link to="/create-account">{{ $t('auth.signUpNowLink') }}</router-link>
      </p>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import apiClient, { getApiErrorMessage } from "@/utils/axios";
import login from "@/assets/images/1234.jpeg";
const { t } = useI18n();

const router = useRouter();

const form = ref({
  email: "",
  password: "",
});

const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const showPassword = ref(false);

const loginUser = async () => {
  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const response = await apiClient.post("/login", form.value);

    successMessage.value = t('auth.loginSuccessful');
    localStorage.setItem("auth_token", response.data.token);
    localStorage.setItem("user_role", response.data.role || 'player');
    if (response.data.user?.username) {
      localStorage.setItem("username", response.data.user.username);
    }

    const role = response.data.role || 'player';

    // Redirection selon le rôle
    setTimeout(() => {
      if (role === 'admin') {
        router.push("/admin");
      } else if (role === 'agent') {
        router.push("/agent-dashboard");
      } else {
        router.push("/dashboard");
      }
    }, 1000);

  } catch (error: any) {
    console.error("Login error:", error);
    errorMessage.value = getApiErrorMessage(error);
  } finally {
    loading.value = false;
  }
};

// Test API connection on mount
const testApiConnection = async () => {
  try {
    // Try a simple GET request to check if API is reachable
    await apiClient.get("/streams", { params: { per_page: 1 }, timeout: 5000 });
    console.log("API connection test: OK");
  } catch (error: any) {
    console.warn("API connection test failed:", error.message);
    // Don't show error to user, just log it for debugging
  }
};

// Redirect to appropriate dashboard if already logged in
onMounted(async () => {
  const token = localStorage.getItem("auth_token");
  const userRole = localStorage.getItem("user_role");
  if (token) {
    if (userRole === 'admin') {
      router.push("/admin");
    } else if (userRole === 'agent') {
      router.push("/agent-dashboard");
    } else {
      router.push("/dashboard");
    }
  } else {
    // Test API connection when not logged in
    await testApiConnection();
  }
});
</script>

<style scoped>
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

/* Field spacing */
.tw-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

/* Forgot password */
.tw-forgot {
  text-align: right;
  margin-bottom: 20px;
  margin-top: -8px;
}

.tw-forgot a {
  font-size: 0.85rem;
  color: rgb(var(--n3));
  text-decoration: none;
  transition: color 0.15s;
}

.tw-forgot a:hover {
  color: rgb(var(--g1));
}

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

/* Form */
.tw-auth-form {
  width: 100%;
}
</style>
