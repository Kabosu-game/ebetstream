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
                  <h3 class="mb-6 mb-md-8">Forgot Password</h3>
                  <p class="mb-10 mb-md-15">
                    Enter your email address and we'll send you a link to reset your password.
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

                  <form @submit.prevent="sendResetLink" class="login_section__form">
                    <!-- Email -->
                    <div class="mb-5 mb-md-6">
                      <input
                        class="n11-bg"
                        type="email"
                        placeholder="Email"
                        v-model="form.email"
                        required
                      />
                    </div>

                    <button
                      class="cmn-btn px-5 py-3 mb-6 w-100"
                      type="submit"
                      :disabled="loading"
                    >
                      <span v-if="loading">Sending...</span>
                      <span v-else>Send Reset Link</span>
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import apiClient from "@/utils/axios";
import login from "@/assets/images/1234.jpeg";

const router = useRouter();

const form = ref({
  email: "",
});

const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const sendResetLink = async () => {
  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const response = await apiClient.post("/forgot-password", form.value);

    if (response.data.success) {
      successMessage.value = response.data.message;
      
      // If reset_url is provided (for testing), show it
      if (response.data.reset_url) {
        successMessage.value += `\n\nFor testing purposes, use this link:\n${response.data.reset_url}`;
      }

      // Clear form
      form.value.email = "";
    }
  } catch (error: any) {
    console.error("Forgot password error:", error);
    
    if (error.response) {
      errorMessage.value = error.response.data?.message || `Server error (${error.response.status})`;
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
</style>

