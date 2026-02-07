<template>
  <section class="login_section pt-120 p3-bg">
    <div class="container-fluid">
      <div class="row justify-content-between align-items-center">

        <!-- Image -->
        <div class="col-6 d-none d-lg-block">
          <div class="login_section__thumb">
            <img class="w-100" width="720" height="900" :src="createAccount" alt="Image" />
          </div>
        </div>

        <!-- Form -->
        <div class="col-lg-6 col-xl-5">
          <div class="login_section__loginarea">
            <div class="row justify-content-start">
              <div class="col-xxl-10">
                <div class="pb-10 pt-8 mb-7 mt-12 mt-lg-0 px-4 px-sm-10">

                  <h3 class="mb-6 mb-md-8">{{ $t('auth.createAccount') }}</h3>
                  <p class="mb-10 mb-md-15">
                    {{ $t('auth.createAccountDescription') }}
                  </p>

                  <!-- SUCCESS MESSAGE -->
                  <div v-if="successMessage" class="alert alert-success mb-4">
                    <span>{{ successMessage }}</span>
                    <button class="close-btn" @click="successMessage = ''">✖</button>
                  </div>

                  <!-- ERROR MESSAGE -->
                  <div v-if="errorMessage" class="alert alert-danger mb-4">
                    <span>{{ errorMessage }}</span>
                    <button class="close-btn" @click="errorMessage = ''">✖</button>
                  </div>

                  <form @submit.prevent="registerUser" class="login_section__form">

                    <!-- Username -->
                    <input class="n11-bg mb-5" type="text" :placeholder="$t('auth.username')" v-model="form.username" required />

                    <!-- Email -->
                    <input class="n11-bg mb-5" type="email" :placeholder="$t('auth.email')" v-model="form.email" required />

                    <!-- Password -->
                    <div class="password-field mb-5">
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

                    <!-- Confirm Password -->
                    <div class="password-field mb-5">
                      <input
                        :type="showConfirm ? 'text' : 'password'"
                        class="n11-bg"
                        :placeholder="$t('auth.confirmPassword')"
                        v-model="form.password_confirmation"
                        required
                      />
                      <button type="button" class="eye-btn" @click="showConfirm = !showConfirm">
                        {{ showConfirm ? '🙈' : '👁️' }}
                      </button>
                    </div>

                    <!-- Password strength -->
                    <div class="password-strength mb-5">
                      <div :class="passwordStrengthClass">{{ passwordStrengthText }}</div>
                    </div>

                    <!-- Promo Code -->
                    <input class="n11-bg mb-5" type="text" :placeholder="$t('auth.promoCode')" v-model="form.promo_code" />

                    <!-- Submit -->
                    <button type="submit" class="cmn-btn px-5 py-3 mb-6 w-100" :disabled="loading">
                      <span v-if="loading">{{ $t('common.pleaseWait') }}</span>
                      <span v-else>{{ $t('auth.signUpNow') }}</span>
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
                    {{ $t('auth.alreadyMember') }}
                    <router-link class="g1-color" to="/login">{{ $t('auth.login') }}</router-link>
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
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import apiClient from "@/utils/axios";
import createAccount from "@/assets/images/1234.jpeg";
import { 
  IconBrandFacebookFilled, 
  IconBrandGoogle, 
  IconBrandTwitterFilled 
} from "@tabler/icons-vue";

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
.alert {
  padding: 12px 16px;
  border-radius: 6px;
  position: relative;
}
.alert-success { background: #d1f7d6; color: #0f6f1a; }
.alert-danger { background: #f7d6d6; color: #a70f0f; }

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

.password-strength div {
  font-size: 0.9em;
  font-weight: bold;
}

.password-strength .weak { color: #f44336; }
.password-strength .medium { color: #ff9800; }
.password-strength .strong { color: #4caf50; }
</style>
