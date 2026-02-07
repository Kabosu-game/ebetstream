<template>
  <section class="login_section pt-120 p3-bg">
    <div class="container-fluid">
      <div class="row justify-content-between align-items-center">

        <!-- Image -->
        <div class="col-6 d-none d-lg-block">
          <div class="login_section__thumb">
            <img class="w-100" width="720" height="900" :src="login" alt="Image" />
          </div>
        </div>

        <!-- Form -->
        <div class="col-lg-6 col-xl-5">
          <div class="login_section__loginarea">
            <div class="row justify-content-start">
              <div class="col-xxl-10">
                <div class="pb-10 pt-8 mb-7 mt-12 mt-lg-0 px-4 px-sm-10">

                  <h3 class="mb-6 mb-md-8">{{ $t('auth.loginTitle') }}</h3>
                  <p class="mb-10 mb-md-15">
                    {{ $t('auth.loginDescription') }}
                  </p>

                  <!-- SUCCESS MESSAGE -->
                  <div v-if="successMessage" class="alert alert-success mb-4">
                    <span>{{ successMessage }}</span>
                    <button class="close-btn" @click="successMessage = ''">✖</button>
                  </div>

                  <!-- ERROR MESSAGE -->
                  <div v-if="errorMessage" class="alert alert-danger mb-4">
                    <div style="white-space: pre-line;">{{ errorMessage }}</div>
                    <button class="close-btn" @click="errorMessage = ''">✖</button>
                  </div>

                  <form @submit.prevent="loginUser" class="login_section__form">

                    <!-- Email -->
                    <div class="mb-5 mb-md-6">
                      <input
                        class="n11-bg"
                        type="email"
                        :placeholder="$t('auth.email')"
                        v-model="form.email"
                        required
                      />
                    </div>

                    <!-- Password with eye -->
                    <div class="mb-3 mb-md-4 password-field">
                      <input
                        :type="showPassword ? 'text' : 'password'"
                        class="n11-bg"
                        :placeholder="$t('auth.password')"
                        v-model="form.password"
                        required
                      />
                      <button type="button" class="eye-btn" @click="showPassword = !showPassword">
                        {{ showPassword ? '🙈' : '👁️' }}
                      </button>
                    </div>

                    <!-- Forgot Password Link -->
                    <div class="mb-5 mb-md-6 text-end">
                      <router-link to="/forgot-password" class="text-white-50" style="text-decoration: none; font-size: 0.9rem;">
                        {{ $t('auth.forgotPassword') }}
                      </router-link>
                    </div>

                    <button
                      class="cmn-btn px-5 py-3 mb-6 w-100"
                      type="submit"
                      :disabled="loading"
                    >
                      <span v-if="loading">{{ $t('common.pleaseWait') }}</span>
                      <span v-else>{{ $t('auth.loginButton') }}</span>
                    </button>

                  </form>

                  <!-- Social -->
                  <div class="login_section__socialmedia text-center mb-6">
                    <span class="mb-6">{{ $t('auth.orContinueWith') }}</span>
                    <div class="login_section__social d-center gap-3">
                      <router-link to="#" class="n11-bg px-3 py-2 rounded-5">
                        <IconBrandFacebookFilled :size="24" />
                      </router-link>
                      <router-link to="#" class="n11-bg px-3 py-2 rounded-5">
                        <IconBrandTwitterFilled :size="24" />
                      </router-link>
                      <router-link to="#" class="n11-bg px-3 py-2 rounded-5">
                        <IconBrandGoogle :size="24" />
                      </router-link>
                    </div>
                  </div>

                  <span class="d-center gap-1">
                    {{ $t('auth.createYourAccount') }}
                    <router-link class="g1-color" to="/create-acount">{{ $t('auth.signUpNowLink') }}</router-link>
                  </span>

                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import apiClient from "@/utils/axios";
import login from "@/assets/images/1234.jpeg";
import {
  IconBrandFacebookFilled,
  IconBrandGoogle,
  IconBrandTwitterFilled,
} from "@tabler/icons-vue";

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

    console.log('Login successful:', {
      token: response.data.token,
      role: response.data.role,
      userRole: response.data.role || 'player'
    });

    // Redirection après 1s selon le rôle
    setTimeout(() => {
      console.log('Attempting redirect...');
      if (response.data.role === 'admin') {
        console.log('Redirecting to admin...');
        router.push("/admin");
      } else {
        console.log('Redirecting to dashboard...');
        router.push("/dashboard");
      }
    }, 1000);

  } catch (error: any) {
    console.error("Login error:", error);
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      errorMessage.value = error.response.data?.message || `Server error (${error.response.status})`;
    } else if (error.request) {
      // Request was made but no response received
      if (error.code === 'ERR_NETWORK' || error.message?.includes('ERR_FAILED')) {
        errorMessage.value = "Cannot connect to the server. Please check:\n- Your internet connection\n- The API server is running\n- CORS configuration is correct";
      } else if (error.code === 'ECONNABORTED' || error.isTimeout) {
        errorMessage.value = "Request timeout. The server is taking too long to respond.";
      } else {
        errorMessage.value = `Network error: ${error.message || 'Unable to reach the server'}`;
      }
    } else if (error.isNetworkError) {
      errorMessage.value = "Network error. Please check your internet connection.";
    } else if (error.isCorsError) {
      errorMessage.value = "CORS error. Please check API configuration on the server.";
    } else {
      errorMessage.value = `Error: ${error.message || 'An unexpected error occurred'}`;
    }
  } finally {
    loading.value = false;
  }
};

// Test API connection on mount
const testApiConnection = async () => {
  try {
    // Try a simple GET request to check if API is reachable
    await apiClient.get("/game-categories", { timeout: 5000 });
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
.alert {
  padding: 12px 16px;
  border-radius: 6px;
  position: relative;
}
.alert-success { background: #0f6f1a; color: #0f6f1a; }
.alert-danger { background: #a70f0f; color: #a70f0f; }
.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  font-weight: bold;
  cursor: pointer;
}

.password-field {
  position: relative;
}

.eye-btn {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
}
</style>
