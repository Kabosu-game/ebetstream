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
                  <h3 class="mb-6 mb-md-8">Reset Password</h3>
                  <p class="mb-10 mb-md-15">
                    Enter your new password below.
                  </p>

                  <!-- SUCCESS MESSAGE -->
                  <div v-if="successMessage" class="alert alert-success mb-4">
                    <div style="white-space: pre-line;">{{ successMessage }}</div>
                    <button class="close-btn" @click="successMessage = ''">✖</button>
                  </div>

                  <!-- ERROR MESSAGE -->
                  <div v-if="errorMessage" class="alert alert-danger mb-4">
                    <div style="white-space: pre-line;">{{ errorMessage }}</div>
                    <button class="close-btn" @click="errorMessage = ''">✖</button>
                  </div>

                  <form @submit.prevent="resetPassword" class="login_section__form">
                    <!-- Email (hidden, from URL) - for debugging, you can temporarily show it -->
                    <input type="hidden" v-model="form.email" />

                    <!-- New Password -->
                    <div class="mb-5 mb-md-6 password-field">
                      <input
                        :type="showPassword ? 'text' : 'password'"
                        class="n11-bg"
                        placeholder="New Password"
                        v-model="form.password"
                        required
                        minlength="6"
                      />
                      <button type="button" class="eye-btn" @click="showPassword = !showPassword">
                        {{ showPassword ? '🙈' : '👁️' }}
                      </button>
                    </div>

                    <!-- Confirm Password -->
                    <div class="mb-5 mb-md-6 password-field">
                      <input
                        :type="showConfirmPassword ? 'text' : 'password'"
                        class="n11-bg"
                        placeholder="Confirm New Password"
                        v-model="form.password_confirmation"
                        required
                        minlength="6"
                      />
                      <button type="button" class="eye-btn" @click="showConfirmPassword = !showConfirmPassword">
                        {{ showConfirmPassword ? '🙈' : '👁️' }}
                      </button>
                    </div>

                    <button
                      class="cmn-btn px-5 py-3 mb-6 w-100"
                      type="submit"
                      :disabled="loading"
                    >
                      <span v-if="loading">Resetting...</span>
                      <span v-else>Reset Password</span>
                    </button>
                  </form>

                  <div class="text-center">
                    <router-link to="/login" class="text-white-50" style="text-decoration: none;">
                      ← Back to Login
                    </router-link>
                  </div>
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
import { useRouter, useRoute } from "vue-router";
import apiClient from "@/utils/axios";
import login from "@/assets/images/1234.jpeg";

const router = useRouter();
const route = useRoute();

const form = ref({
  email: "",
  token: "",
  password: "",
  password_confirmation: "",
});

const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);

onMounted(() => {
  // Get token and email from URL query parameters
  const token = route?.query?.token as string | undefined;
  const emailParam = route?.query?.email as string | undefined;

  if (!token || !emailParam) {
    errorMessage.value = "Invalid reset link. Please request a new password reset.";
    return;
  }

  // Decode the email from URL (it may be URL encoded)
  const decodedEmail = decodeURIComponent(emailParam);

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(decodedEmail)) {
    errorMessage.value = "Invalid email format in reset link. Please request a new password reset.";
    return;
  }

  form.value.token = token;
  form.value.email = decodedEmail;
});

const resetPassword = async () => {
  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  // Validate email is present and valid
  if (!form.value.email || !form.value.email.trim()) {
    errorMessage.value = "Email is required. Please use a valid reset link.";
    loading.value = false;
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.value.email)) {
    errorMessage.value = "Invalid email format. Please use a valid reset link.";
    loading.value = false;
    return;
  }

  // Validate token is present
  if (!form.value.token || !form.value.token.trim()) {
    errorMessage.value = "Reset token is required. Please use a valid reset link.";
    loading.value = false;
    return;
  }

  // Validate passwords match
  if (form.value.password !== form.value.password_confirmation) {
    errorMessage.value = "Passwords do not match.";
    loading.value = false;
    return;
  }

  // Validate password length
  if (form.value.password.length < 6) {
    errorMessage.value = "Password must be at least 6 characters long.";
    loading.value = false;
    return;
  }

  try {
    // Debug: Log what we're sending
    console.log("Sending reset request:", {
      email: form.value.email,
      token_length: form.value.token?.length,
      token_preview: form.value.token?.substring(0, 10) + "...",
    });

    const response = await apiClient.post("/reset-password", form.value);

    if (response.data.success) {
      successMessage.value = response.data.message + "\n\nRedirecting to login page...";
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  } catch (error: any) {
    console.error("Reset password error:", error);
    console.error("Error details:", {
      response: error.response?.data,
      status: error.response?.status,
      email: form.value.email,
      token_length: form.value.token?.length,
    });
    
    if (error.response) {
      const errorMsg = error.response.data?.message || `Server error (${error.response.status})`;
      errorMessage.value = errorMsg;
      
      // If token is invalid, suggest requesting a new one
      if (errorMsg.includes('Invalid') || errorMsg.includes('token')) {
        errorMessage.value += "\n\nPlease request a new password reset link from the forgot password page.";
      }
    } else if (error.request) {
      errorMessage.value = "Cannot connect to the server. Please check your internet connection.";
    } else {
      errorMessage.value = `Error: ${error.message || 'An unexpected error occurred'}`;
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.alert {
  padding: 12px 16px;
  border-radius: 6px;
  position: relative;
}
.alert-success { 
  background: rgba(15, 111, 26, 0.2); 
  color: #4ade80; 
  border: 1px solid rgba(15, 111, 26, 0.5);
}
.alert-danger { 
  background: rgba(167, 15, 15, 0.2); 
  color: #f87171; 
  border: 1px solid rgba(167, 15, 15, 0.5);
}
.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  color: inherit;
  font-weight: bold;
  cursor: pointer;
  font-size: 18px;
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
  font-size: 18px;
}
</style>

